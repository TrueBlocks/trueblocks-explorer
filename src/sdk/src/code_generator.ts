import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs/promises';
import { OpenAPIV3 } from 'openapi-types';
import { Project } from 'ts-morph';

import * as helpers from './helpers';
import * as pathFile from './path_file';
import * as typeFile from './type_file';

const openApiUrl = 'http://trueblocks.io/api/openapi.yaml';

/**
 * Downloads OpenAPI file and returns it parsed
 */
async function parseOpenApi() {
  const parsed = await SwaggerParser.parse(openApiUrl);
  return parsed as OpenAPIV3.Document;
}

/** Libraries are modules that are not auto generated, but provide
 * functionalities to the auto generated code (e.g. Fetch API wrappers)
 */
export async function makeLibraries(project: Project) {
  // Read files from the input directory
  const files = await fs.readdir(helpers.joinWorkingPath('../input'));
  const readPromises = files
    .map(async (fileName) => {
      const source = await fs.readFile(helpers.joinWorkingPath('../input', fileName));
      return [
        fileName,
        source,
      ];
    });

  // copy them into the generated project
  project.createDirectory(helpers.joinGeneratedPath('/lib'));

  const fileData = await Promise.all(readPromises);

  fileData.forEach(([fileName, source]) => {
    let destinationDirectory = helpers.joinGeneratedPath('/lib');

    if (fileName === 'base_types.ts') {
      destinationDirectory = helpers.typesOutDir;
    }

    project.createSourceFile(`${destinationDirectory}/${fileName}`, String(source), { overwrite: true }).save();
  });
}

/**
 * Creates the main 'index.ts' file
 */
export async function makeMasterIndex(project: Project) {
  project.createSourceFile(helpers.joinGeneratedPath('/index.ts'), (writer) => {
    [
      'lib/api_callers',
      'paths',
      'types',
    ].forEach((identifier) => {
      writer.writeLine(`export * from './${identifier}';`);
    });
  }, { overwrite: true }).save();
}

/**
 * Creates new TS project. We will use it as a base for the auto generated code
 */
export function initTypescript() {
  return new Project({
    tsConfigFilePath: helpers.joinWorkingPath('../generated_tsconfig.json'),
  });
}

/**
 * Performs the main task: generates types, turns OpenAPI paths into functions and
 * copies `input/` into the project
 */
export async function generateCodebase() {
  const content = await parseOpenApi();
  const project = initTypescript();

  await makeLibraries(project);

  // If we have schemas, let's generate the types
  if (content.components?.schemas) {
    const typeFileNames = typeFile.makeTypesFromSchema(
      project,
      content.components.schemas as Record<string, OpenAPIV3.SchemaObject>,
    );

    if (typeFileNames.length) {
      typeFile.makeTypesIndex(project, typeFileNames as string[]);
    }
  }

  const paths = pathFile.makePathsFromOpenApi(content.paths);
  const pathsFilePaths = paths.map((model) => {
    // Group REST operations on the same resource in the same file
    const { source: sourceFile } = pathFile.makePathsInSameFile(project, model);
    sourceFile.saveSync();

    return sourceFile.getFilePath();
  });
  pathFile.makePathIndex(project, pathsFilePaths);

  makeMasterIndex(project);

  // Print any TS compiler errors
  project.resolveSourceFileDependencies();
  const diagnostics = project.getPreEmitDiagnostics();
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));

  project.emitSync();
}
