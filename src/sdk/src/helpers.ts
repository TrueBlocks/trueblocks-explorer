import { OpenAPIV3 } from 'openapi-types';
import { join } from 'path';

type FilePathPart = Parameters<typeof join>;

/**
 * Like Node's `path.join`, but always prepends `__dirname`
 */
export function joinWorkingPath(...paths: FilePathPart) {
  return join(__dirname, ...paths);
}

/**
 * Like Node's `path.join`, but always prepends the generated_ts directory
 */
export function joinGeneratedPath(...paths: FilePathPart) {
  return joinWorkingPath(generatedTsDir, ...paths);
}

// Path constants
export const outDir = 'out';
export const inputDir = 'input';
export const generatedTsDir = '../generated_ts';
export const typesOutDir = joinGeneratedPath('/types');
export const pathsOutDir = joinGeneratedPath('/paths');

export function capitalize(someString: string) {
  return someString.replace(/^[a-z]/, (letter) => letter.toUpperCase());
}

/**
 * Checks if the given object is OpenAPI SchemaObject
 */
export function isSchema(
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined,
): schema is OpenAPIV3.SchemaObject {
  if (!schema) return false;

  return !('$ref' in schema);
}

/**
 * Checks if the given schema is ArraySchema
 */
export function isArraySchema(schema: OpenAPIV3.SchemaObject): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === 'array';
}

/**
 * Checks if the given schema is Object- or ArraySchema
 */
export function isObjectOrArraySchema(schema: OpenAPIV3.SchemaObject): boolean {
  return schema.type === 'object' || isArraySchema(schema);
}

/**
 * Checks if the given object has OpenAPI's $ref key
 */
export function hasRef(items: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): items is OpenAPIV3.ReferenceObject {
  return '$ref' in items;
}

/**
 * Checks if the given object is OpenAPI's `oneOf` declaration
 */
export function isOneOf(oneOf: OpenAPIV3.SchemaObject['oneOf']): oneOf is OpenAPIV3.ReferenceObject[] {
  return Boolean(oneOf && oneOf.length && '$ref' in oneOf[0]);
}
