import { OpenAPIV3 } from 'openapi-types';
import { Project } from 'ts-morph';

import * as helpers from './helpers';
import * as types from './type';

/**
 * Turns data extracted from OpenAPI schema into Typescript type definition
 */
export function makeType(project: Project, typeName: string, schema: OpenAPIV3.SchemaObject) {
  if (!schema.properties) {
    // It seems that by a mistake we do have schemas with no properties
    // throw new Error(`Empty properties: ${typeName}`);
    return '';
  }

  // This is a utility type that we don't really need
  if (typeName === 'response') return '';

  // We want to use capital letters for complex types (objects)
  const uppercased = helpers.capitalize(typeName);
  const fileName = `${typeName}`;

  const namesAndTypes = types.getTypesFromSchemaProperties(schema.properties as OpenAPIV3.SchemaObject);
  const typesToImport: Set<string> = new Set();

  // Save the names of the types that we use, so we can import them
  namesAndTypes.types
    .filter(types.isNotBuiltinType)
    // Don't import the type if we're using recursive types
    .filter(({ name }) => name !== uppercased)
    .forEach(({ name }) => typesToImport.add(name));

  const source = project.createSourceFile(`${helpers.typesOutDir}/${fileName}.ts`, (writer) => {
    writer
      .write(`export type ${uppercased} =`)
      .block(() => {
        namesAndTypes.types.forEach((model, index) => {
          writer.writeLine(`${namesAndTypes.names[index]}: ${types.arrayFromModel(model)}`);
        });
      });
  }, { overwrite: true });

  // Import the used types
  source.addImportDeclaration({
    moduleSpecifier: '../types',
    namedImports: [...typesToImport.values()],
  });

  source.saveSync();

  return fileName;
}

export function makeTypesFromSchema(project: Project, schemas: Record<string, OpenAPIV3.SchemaObject>) {
  return Object.entries(schemas)
    .map(([name, definition]) => makeType(project, name, definition))
    .filter(Boolean);
}

export function makeTypesIndex(project: Project, fileNames: string[]) {
  project.createSourceFile(`${helpers.typesOutDir}/index.ts`, (writer) => {
    writer.writeLine('export * from \'./base_types\'');
    fileNames.forEach((fileName) => writer.writeLine(`export * from './${fileName}'`));
  }, { overwrite: true }).save();
}
