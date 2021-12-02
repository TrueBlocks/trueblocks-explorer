import { OpenAPIV3 } from "openapi-types";

export const makeResponse = (responseType: string) => {
  return {
    description: '',
    content: {
      'application/json': {
        schema: {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: `#/components/schemas/${responseType}`,
              }
            } as OpenAPIV3.ArraySchemaObject
          }
        }
      }
    }
  };
};

export function mockOpenApiPaths() {

  return {
    '/list': {
      get: {
        tags: ['Admin'],
        summary: 'Manage chunks',
        description: 'Manage and investigate chunks and bloom filters.',
        operationId: 'admin-chunks',
        parameters: [
          {
            name: 'blocks',
            description: 'an optional list of blocks to process',
            required: false,
            style: 'form',
            in: 'query',
            explode: true,
            schema: { type: 'array', items: { type: 'string', format: 'blknum' } } as OpenAPIV3.ArraySchemaObject
          },
          {
            name: 'check',
            description: 'check the validity of the chunk or bloom',
            required: false,
            style: 'form',
            in: 'query',
            explode: true,
            schema: { type: 'boolean' } as OpenAPIV3.NonArraySchemaObject
          },
        ],
        responses: { '200': makeResponse('appearance'), '400': {} as OpenAPIV3.ResponseObject }
      },
      delete: {
        tags: ['Admin'],
        summary: 'Manage chunks',
        description: 'Manage and investigate chunks and bloom filters.',
        operationId: 'admin-chunks',
        parameters: [
          {
            name: 'blocks',
            description: 'an optional list of blocks to process',
            required: false,
            style: 'form',
            in: 'query',
            explode: true,
            schema: { type: 'array', items: { type: 'string', format: 'blknum' } } as OpenAPIV3.ArraySchemaObject
          },
        ],
        responses: { '200': { description: '' }, '400': {} as OpenAPIV3.ResponseObject }
      }
    },
    '/chunks': {
      get: {
        tags: ['Admin'],
        summary: 'Manage chunks',
        description: 'Manage and investigate chunks and bloom filters.',
        operationId: 'admin-chunks',
        parameters: [
          {
            name: 'blocks',
            description: 'an optional list of blocks to process',
            required: false,
            style: 'form',
            in: 'query',
            explode: true,
            schema: { type: 'array', items: { type: 'string', format: 'blknum' } } as OpenAPIV3.ArraySchemaObject
          },
          {
            name: 'check',
            description: 'check the validity of the chunk or bloom',
            required: false,
            style: 'form',
            in: 'query',
            explode: true,
            schema: { type: 'boolean' } as OpenAPIV3.NonArraySchemaObject
          },
        ],
        responses: { '200': makeResponse('chunk'), '400': {} as OpenAPIV3.ResponseObject }
      }
    }
  };
}