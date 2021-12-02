import { OpenAPIV3 } from 'openapi-types';

import * as helpers from './helpers';

export type TypeModel = {
  name: string,
  isArray: boolean,
  isRequired: boolean,
}

/**
 * Turns TypeModel into an array type like `name[]`
 */
export function arrayFromModel(model: TypeModel): string {
  return model.name + (model.isArray ? '[]' : '');
}

/**
 * Turns an array of TypeModels into `type1 | type2 | type3`
 */
export function makeUnionType(models: TypeModel[]): string {
  return models
    .map(arrayFromModel)
    .join(' | ');
}

export function isNotBuiltinType(model: TypeModel): boolean {
  const { name } = model;

  return ![
    'string',
    'number',
    'boolean',
    'undefined',
    'null',
    'any',
    'BigInt',
  ].includes(name);
}

/**
 * Finds the type definition in the schema. Depending on the kind of data,
 * the type can be defined directly in the schema or in its `items` field
 */
export function findType(schema: OpenAPIV3.SchemaObject): TypeModel[] {
  const isArray = schema.type === 'array';

  if (!helpers.isArraySchema(schema)) {
    // The simplest scenario - a simple type. The name is defined directly in
    // the schema...
    return [{
      name: capitalizeType(
        String(schema.format || schema.type),
      ),
      isRequired: true,
      isArray: false,
    }];
  }

  // If we reach this line, we are dealing with an array

  const { items } = schema;

  if (helpers.isSchema(items) && helpers.isOneOf(items.oneOf)) {
    // If `items` have `oneOf` field, we have to extract multiple types
    return items.oneOf
      .map(({ $ref }) => ({
        name: capitalizeType(getNameFromRef($ref)),
        isArray: true,
        isRequired: true,
      }));
  }

  if (helpers.hasRef(items)) {
    // But if it only has `$ref`, we can extract the name from there
    return [{
      name: capitalizeType(
        getNameFromRef(items.$ref),
      ),
      isArray,
      isRequired: true,
    }];
  }

  // Or the type name can be inside items
  return [{
    name: capitalizeType(
      getNameFromRef(String(items.format || items.type)),
    ),
    isArray,
    isRequired: true,
  }];
}

/**
 * Performs some naive (but OK for this scenario) type name extraction from
 * the OpenAPI $ref string
 */
export const getNameFromRef = (s: string) => {
  const parts = s.split('/');
  const schemaName = parts[parts.length - 1];

  return schemaName;
};

export function capitalizeType(lowercaseTypeName: string): string {
  const alwaysLowercase = [
    'undefined',
    'string',
    'number',
    'boolean',
    'hash',
    'blknum',
    'bytes',
    'date',
    'address',
    'timestamp',
    'wei',
    'int256',
    'uint256',
    'uint32',
    'gas',
    'uint32',
    'uint64',
    'int64',
    'double',
    'bytes32',
    'ipfshash',
    'topic',
  ];

  if (alwaysLowercase.includes(lowercaseTypeName)) return lowercaseTypeName;

  return helpers.capitalize(lowercaseTypeName);
}

/**
 * Extracts type data from OpenAPI SchemaObject
 */
export function getTypesFromSchemaProperties(
  properties: OpenAPIV3.SchemaObject,
): { names: string[], types: TypeModel[] } {
  const names: string[] = [];
  const types: TypeModel[] = [];

  Object.entries(properties).forEach(([name, property]) => {
    names.push(name);
    types.push({
      name: capitalizeType(
        helpers.isObjectOrArraySchema(property)
          ? getNameFromRef(property.items.$ref)
          : property.format || property.type,
      ),
      isRequired: true,
      isArray: property.type === 'array',
    });
  });

  return {
    names,
    types,
  };
}

/**
 * Extract the type of the data we get in response to the given request (path)
 */
export function getResponseBodyType(path: OpenAPIV3.OperationObject) {
  const successResponse = path.responses['200'] as OpenAPIV3.ResponseObject;

  // We only need to extract the type of successful response, as the type of error response
  // is constant (`{ errors: []string }`)
  if (!successResponse || !Object.keys(successResponse).length) {
    throw new Error(`Cannot find success response for ${path.operationId}`);
  }

  const content = successResponse.content as NonNullable<OpenAPIV3.ResponseObject['content']>;

  if (!content) {
    // Some responses don't have Body (e.g. DELETE, but this can change)
    return [{ name: 'undefined', isRequired: true, isArray: false }];
  }

  // Right now we only support JSON responses
  if (!('application/json' in content)) {
    throw new Error(`No application/json response for ${path.operationId}`);
  }

  const jsonContent = content['application/json'];

  if (!helpers.isSchema(jsonContent.schema)) {
    throw new Error(`Wrong schema for ${path.operationId}`);
  }

  const data = jsonContent.schema.properties?.data;

  if (!data) {
    throw new Error(`Empty schema for ${path.operationId}`);
  }

  return findType(data as OpenAPIV3.SchemaObject);
}
