import { OpenAPIV3 } from 'openapi-types';
import { join } from 'path';

type FilePathPart = Parameters<typeof join>;

export const joinWorkingPath = (...paths: FilePathPart) => join(__dirname, ...paths);
export const joinGeneratedPath = (...paths: FilePathPart) => joinWorkingPath(generatedTsDir, ...paths);

export const outDir = 'out';
export const inputDir = 'input';
export const generatedTsDir = '../generated_ts';
export const typesOutDir = joinGeneratedPath('/types');
export const pathsOutDir = joinGeneratedPath('/paths');

export const makeUpperCase = (s: string) => s.replace(/^[a-z]/, (letter) => letter.toUpperCase());

export function isSchema(
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined,
): schema is OpenAPIV3.SchemaObject {
  if (!schema) return false;

  return !('$ref' in schema);
}

export function isArraySchema(schema: OpenAPIV3.SchemaObject): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === 'array';
}

export function isObjectOrArraySchema(schema: OpenAPIV3.SchemaObject): boolean {
  return schema.type === 'object' || isArraySchema(schema);
}

export function hasRef(items: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): items is OpenAPIV3.ReferenceObject {
  return '$ref' in items;
}

export function isOneOf(oneOf: OpenAPIV3.SchemaObject['oneOf']): oneOf is OpenAPIV3.ReferenceObject[] {
  return Boolean(oneOf && oneOf.length && '$ref' in oneOf[0]);
}
