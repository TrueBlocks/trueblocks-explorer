import { StandardizedFilePath } from '@ts-morph/common';
import { OpenAPIV3 } from 'openapi-types';
import { basename } from 'path';
import { Project } from 'ts-morph';

import { formatSource } from './format_source';
import * as helpers from './helpers';
import * as types from './type';

export type PathModel = {
  route: string,
  method: string,
  path: OpenAPIV3.OperationObject,
};

/**
 * Generates parameters for REST request functions based on OpenAPI schema
 */
export function makeFunctionParameters(parameters: OpenAPIV3.ParameterObject[]) {
  // We want to get both parameters' names and types
  const names: string[] = [];
  const extractedTypes: types.TypeModel[] = [];

  parameters.forEach((parameter) => {
    names.push(`${parameter.name}${parameter.required ? '' : '?'}`);

    const schema = (parameter.schema as OpenAPIV3.SchemaObject);
    const parameterType = (() => {
      if (schema.type !== 'object' && schema.type !== 'array') {
        // if it's not object or an array, the types are defined in `format` or `type`
        // fields directly
        return {
          name: (schema.format || schema.type) as string,
          isArray: false,
          isRequired: false,
        };
      }

      // otherwise they will be defined in items field
      const items = (schema as OpenAPIV3.ArraySchemaObject).items as OpenAPIV3.SchemaObject;
      return {
        name: (items.format || items.type) as string,
        isArray: schema.type === 'array',
        isRequired: false,
      };
    })();

    extractedTypes.push(parameterType);
  });

  return {
    names,
    types: extractedTypes,
  };
}

/**
 * Generates all REST functions operating on a given resource in the same file
 */
export function makePathsInSameFile(project: Project, models: PathModel[]) {
  // Cut the leading slash
  const endpointName = models[0].route.replace(/^\//, '');
  // Keep a list of types used, so that we can import them
  const typesToImport: Set<string> = new Set();
  // Also keep a list of the generated function names (useful for testing)
  const functionNames: string[] = [];

  const source = project.createSourceFile(`${helpers.pathsOutDir}/${endpointName}.ts`, (writer) => {
    models.forEach(({ route, method, path }) => {
      // Get function parameters (the options that we want to send with the request)
      const parameters = makeFunctionParameters(path.parameters as OpenAPIV3.ParameterObject[]);
      // Get the type of the data we will get in the response
      const responseType = types.getResponseBodyType(path);
      // Save all types so we can import them (unless they are built in)
      [...parameters.types, ...responseType]
        .filter(types.isNotBuiltinType)
        .forEach(({ name }) => typesToImport.add(name));

      const functionName = `${method}${helpers.capitalize(endpointName)}`;
      functionNames.push(functionName);

      writer
        .writeLine(`export function ${functionName}(`)
        .setIndentationLevel(1)
        .write('')
        .write('parameters: ')
        .inlineBlock(() => {
          parameters
            .types
            .forEach(
              (typeModel, index) => writer.writeLine(`${parameters.names[index]}: ${types.arrayFromModel(typeModel)},`),
            );
        })
        .write(',')
        .writeLine('options?: RequestInit,')
        .setIndentationLevel(0)
        .write(')')
        .block(() => {
          writer
            .write(`return ApiCallers.fetch<${types.makeUnionType(responseType)}>({ endpoint: '${route}', method: '${method}', parameters, options });`);
        });
    });
  }, { overwrite: true });

  formatSource(source);

  // Add ApiCallers dependency so we can actually call the API
  source.addImportDeclaration({
    moduleSpecifier: '../lib/api_callers',
    namespaceImport: 'ApiCallers',
  });
  // Import all types used in this file
  source.addImportDeclaration({
    moduleSpecifier: '../types',
    namedImports: [...typesToImport.values()],
  });

  return { source, functionNames };
}

/**
 * Scans OpenAPI file for path definitions and turnes them into a model that can be later
 * used to generate functions to make requests
 */
export function makePathsFromOpenApi(paths: OpenAPIV3.PathsObject): PathModel[][] {
  return Object.entries(paths)
    .filter(([, path]) => Boolean(path))
    .map(([route, path]) => {
      // The `path` stores definitions of all REST actions allowed the given resource (GET, POST, etc.)
      const result: PathModel[] = Object.entries(path as OpenAPIV3.PathItemObject)
        .map(([method, pathConfig]) => ({
          route,
          method,
          path: pathConfig as OpenAPIV3.OperationObject,
        }));
      return result;
    });
}

/**
 * Generates index.ts file for all the path files
 */
export function makePathIndex(project: Project, filePaths: StandardizedFilePath[]) {
  const fileNames = filePaths.map((path) => basename(path, '.ts'));

  const source = project.createSourceFile(`${helpers.pathsOutDir}/index.ts`, (writer) => {
    fileNames.forEach((fileName) => {
      writer.writeLine(`export * from './${fileName}';`);
    });
  }, { overwrite: true });

  formatSource(source);
  source.save();
}
