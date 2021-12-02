import { OpenAPIV3 } from 'openapi-types';
import * as pathFile from '../path_file';
import { mockOpenApiPaths } from './helpers';

describe('makePathsFromOpenApi', () => {
    test('returns correct data', () => {
        const result = pathFile.makePathsFromOpenApi(mockOpenApiPaths());
        expect(result.length).toBe(2);
        expect(result[0].length).toBe(2);
        expect(result[1].length).toBe(1);
    });
});

describe('makeFunctionParameters', () => {
    test('schema input', () => {
        const input = [
            {
                name: 'addrs',
                description: 'one or more addresses (0x...) to list',
                required: true,
                style: 'form',
                in: 'query',
                explode: true,
                schema: { type: 'array', items: { type: 'string', format: 'address' } } as OpenAPIV3.ArraySchemaObject
            },
            {
                name: 'count',
                description: 'present only the number of records',
                required: false,
                style: 'form',
                in: 'query',
                explode: true,
                schema: { type: 'boolean' } as OpenAPIV3.NonArraySchemaObject
            },
            {
                name: 'appearances',
                description: 'export a list of appearances',
                required: false,
                style: 'form',
                in: 'query',
                explode: true,
                schema: { type: 'boolean' } as OpenAPIV3.NonArraySchemaObject
            }
        ];
        const result = pathFile.makeFunctionParameters(input)

        expect(result.names).toEqual([
            'addrs',
            'count?',
            'appearances?'
        ]);
        expect(result.types).toEqual([
            {
                name: 'address',
                isArray: true,
                isRequired: false,
            },
            {
                name: 'boolean',
                isArray: false,
                isRequired: false,
            },
            {
                name: 'boolean',
                isArray: false,
                isRequired: false,
            },
        ]);
    });
});