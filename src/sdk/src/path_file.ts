import { StandardizedFilePath } from '@ts-morph/common';
import { OpenAPIV3 } from 'openapi-types';
import { basename } from 'path';
import { Project } from 'ts-morph';

import * as helpers from './helpers';
import * as types from './type';

export type PathModel = {
  route: string,
  method: string,
  path: OpenAPIV3.OperationObject,
};

export function makeFunctionParameters(parameters: OpenAPIV3.ParameterObject[]) {
  const names = parameters.map(({ name, required }) => `${name}${required ? '' : '?'}`);
  const types = parameters.map((parameter) => {
    const schema = (parameter.schema as OpenAPIV3.SchemaObject);
    const parameterType = (() => {
      if (schema.type !== 'object' && schema.type !== 'array') {
        return {
          name: (schema.format || schema.type) as string,
          isArray: false,
          isRequired: false,
        };
      }

      const items = (schema as OpenAPIV3.ArraySchemaObject).items as OpenAPIV3.SchemaObject;
      return {
        name: (items.format || items.type) as string,
        isArray: schema.type === 'array',
        isRequired: false,
      };
    })();

    return parameterType;
  });

  return {
    names,
    types,
  };
}

export function makePathsInSameFile(project: Project, models: PathModel[]) {
  const endpointName = models[0].route.replace(/^\//, '');
  const typesToImport: Set<string> = new Set();
  const functionNames: string[] = [];

  const source = project.createSourceFile(`${helpers.pathsOutDir}/${endpointName}.ts`, (writer) => {
    models.forEach(({ route, method, path }) => {
      const parameters = makeFunctionParameters(path.parameters as OpenAPIV3.ParameterObject[]);
      const responseType = types.getResponseBodyType(path);
      [...parameters.types, ...responseType]
        .filter(types.isNotBuiltinType)
        .forEach(({ name }) => typesToImport.add(name));
      const functionName = `${method}${helpers.makeUpperCase(endpointName)}`;
      functionNames.push(functionName);

      writer
        .writeLine(`export function ${functionName}(`)
        .setIndentationLevel(1)
        .write('')
        .write('parameters: ')
        .inlineBlock(() => {
          parameters.types.forEach((typeModel, index) => writer.writeLine(`${parameters.names[index]}: ${types.arrayFromModel(typeModel)},`));
        })
        .write(',')
        .writeLine('options?: RequestInit')
        .setIndentationLevel(0)
        .write(')')
        .block(() => {
          writer
            .write(`return ApiCallers.fetch<${types.makeUnionType(responseType)}>({ endpoint: '${route}', method: '${method}', parameters, options });`);
        });
    });
  }, { overwrite: true });

  source.addImportDeclaration({
    moduleSpecifier: '../lib/api_callers',
    namespaceImport: 'ApiCallers',
  });
  source.addImportDeclaration({
    moduleSpecifier: '../types',
    namedImports: [...typesToImport.values()],
  });

  return { source, functionNames };
}

export function makePathsFromOpenApi(paths: OpenAPIV3.PathsObject): PathModel[][] {
  return Object.entries(paths)
    .filter(([, path]) => Boolean(path))
    .map(([route, path]) => {
      const result: PathModel[] = Object.entries(path as OpenAPIV3.PathItemObject)
        .map(([method, pathConfig]) => ({
          route,
          method,
          path: pathConfig as OpenAPIV3.OperationObject,
        }));
      return result;
    });
}

export function makePathIndex(project: Project, filePaths: StandardizedFilePath[]) {
  const fileNames = filePaths.map((path) => basename(path, '.ts'));

  project.createSourceFile(`${helpers.pathsOutDir}/index.ts`, (writer) => {
    fileNames.forEach((fileName) => {
      writer.writeLine(`export * from './${fileName}';`);
    });
  }, { overwrite: true }).save();
}
