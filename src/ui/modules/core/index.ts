import { notification } from 'antd';
import { either as Either, taskEither as TaskEither } from 'fp-ts';
import { pipe } from 'fp-ts/function';

export type CoreCommand =
  | 'export'
  | 'list'
  | 'tags'
  | 'names'
  | 'collections'
  | 'abis'
  | 'rm'
  | 'status'
  | 'help'
  | 'scraper'
  | 'blocks'
  | 'transactions'
  | 'receipts'
  | 'logs'
  | 'traces'
  | 'when'
  | 'state'
  | 'tokens'
  | 'quotes'
  | 'slurp'
  | 'pins';

export type CommandParams = Record<string, string | boolean | number | string[]>;

/* Helper functions that transform the response */

export type JsonResponse = Record<string, any>;

// Extracts JSON from the response
function turnResponseIntoJson(response: Response) {
  return TaskEither.tryCatch(
    // Try to parse response as JSON
    (): Promise<JsonResponse> => response.json(),
    // If there is an error, just keep it
    Either.toError,
  );
}

// Checks response status. If it is anything else than 200 (so `response.ok` is false)
// it uses `response.statusText` (e.g. 'Unauthorized') as an Error. If everything is
// fine, it leaves `response` intact inside of TaskEither
function validateStatus(response: Response): TaskEither.TaskEither<Error, Response> {
  // `pipe` takes a value and runs a cascade of functions
  return pipe(
    // Take response...
    response,
    // ...and pass it into `fromPredicate`, which creates a new TaskEither.
    // If the status is not OK, we use `statusText` as Error. If everything
    // is fine, this will use `response` from the line above
    TaskEither.fromPredicate(
      () => response.ok,
      () => Either.toError(response.statusText),
    ),
  );
}

/* End of helpers */

export function runCommand(command: CoreCommand, params?: CommandParams) {
  const url = new URL(command, process.env.CORE_URL);
  // We rely on JS to cast booleans and numbers to strings automatically, hence type cast
  url.search = new URLSearchParams(params as Record<string, string>).toString();
  return pipe(
    // Try to call a command and retrieve its output through HTTP
    TaskEither.tryCatch(
      () => fetch(url.toString()),
      (error) => {
        notification.warning({
          message: `Error running "${command}"`,
          description: `${error}`,
        });
        return Either.toError(error);
      },
    ),
    // Validate response status (only if there was no Error)
    TaskEither.chain(validateStatus),
    // Extract JSON from the response
    TaskEither.chain(turnResponseIntoJson),
  )();
}
