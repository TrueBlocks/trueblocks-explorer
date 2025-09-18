import { LogFrontend } from '@app';

export const Log = (...args: string[]) => {
  // Calls LogFrontend asynchronously and ignores the returned promise
  LogFrontend(args.join(' ')).then(() => {});
};

export const LogError = (...args: string[]) => {
  // Calls LogFrontend asynchronously and ignores the returned promise
  LogFrontend('❌ ERROR: ' + args.join(' ')).then(() => {});
};
