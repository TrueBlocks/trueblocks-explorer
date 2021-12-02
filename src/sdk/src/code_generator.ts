import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs/promises';
import { OpenAPIV3 } from 'openapi-types';
import { Project } from 'ts-morph';

import * as helpers from './helpers';
import * as pathFile from './path_file';
import * as typeFile from './type_file';

const openApiUrl = 'http://trueblocks.io/api/openapi.yaml'; // 'https://raw.githubusercontent.com/TrueBlocks/trueblocks-docs/master/content/api/openapi.yaml';

async function parseOpenApi() {
  const parsed = await SwaggerParser.parse(openApiUrl);
  return parsed as OpenAPIV3.Document;
}

export async function addDeps(project: Project) {
  const files = await fs.readdir(helpers.joinWorkingPath('../input'));

  const readPromises = files
    .map(async (fileName) => {
      const source = await fs.readFile(helpers.joinWorkingPath('../input', fileName));
      return [
        fileName,
        source,
      ];
    });

  project.createDirectory(`${helpers.generatedTsDir}/lib`);
  const fileData = await Promise.all(readPromises);
  fileData.forEach(([fileName, source]) => {
    let destinationDirectory = `${helpers.generatedTsDir}/lib`;
    if (fileName === 'base_types.ts') {
      destinationDirectory = `${helpers.generatedTsDir}/types`;
    }

    project.createSourceFile(`${destinationDirectory}/${fileName}`, String(source), { overwrite: true }).save();
  });
}

export async function makeMasterIndex(project: Project) {
  project.createSourceFile(`${helpers.generatedTsDir}/index.ts`, (writer) => {
    [
      'lib/api_callers',
      'paths',
      'types',
    ].forEach((identifier) => {
      writer.writeLine(`export * from './${identifier}';`);
    });
  }, { overwrite: true }).save();
}

export function initTypescript() {
  return new Project({
    tsConfigFilePath: helpers.joinWorkingPath('../generated_tsconfig.json'),
  });
}

export async function generateCodebase() {
  const content = await parseOpenApi();
  const project = initTypescript();

  await addDeps(project);

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
    const { source: sourceFile } = pathFile.makePathsInSameFile(project, model);
    sourceFile.saveSync();
    return sourceFile.getFilePath();
  });
  pathFile.makePathIndex(project, pathsFilePaths);
  makeMasterIndex(project);

  project.resolveSourceFileDependencies();
  const diagnostics = project.getPreEmitDiagnostics();
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));

  project.emitSync();
}
