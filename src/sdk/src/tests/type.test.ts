import * as types from '../type';

describe('findType', () => {
  test('simple type', () => {
    const result = types.findType({
      type: 'string',
      format: 'gas',
    });
    expect(result[0].name).toBe('gas');
  });
  test('primitive type', () => {
    const result = types.findType({
      type: 'string',
    });
    expect(result[0].name).toBe('string');
  });
  test('array', () => {
    const result = types.findType({
      type: 'array',
      items: {
        type: 'string',
        format: 'address',
      },
    });
    expect(result[0].name).toBe('address');
    expect(result[0].isArray).toBe(true);
  });
  test('from oneOf', () => {
    const result = types.findType({
      type: 'array',
      items: {
        oneOf: [
          { $ref: '#/components/schemas/pinnedChunk' },
          { $ref: '#/components/schemas/appearance' },
          { $ref: '#/components/schemas/block' },
          { $ref: '#/components/schemas/transaction' },
        ],
      },
    });
    expect(result.length).toBe(4);

    [
      'PinnedChunk',
      'Appearance',
      'Block',
      'Transaction',
    ].forEach((typeName, index) => {
      expect(result[index].name).toBe(typeName);
      expect(result[index].isArray).toBe(true);
    });
  });
  test('from response', () => {
    const result = types.findType({
      type: 'array',
      items: {
        $ref: '#/components/schemas/appearance',
      },
    });
    expect(result[0].name).toBe('Appearance');
    expect(result[0].isArray).toBe(true);
  });
});

describe('getResponseBodyType', () => {
  test('get type from response body', () => {
    const result = types.getResponseBodyType({
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: {
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      oneOf: [
                        { $ref: '#/components/schemas/status' },
                        { $ref: '#/components/schemas/cache' },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Status');
    expect(result[0].isArray).toBe(true);
    expect(result[1].name).toBe('Cache');
    expect(result[1].isArray).toBe(true);
  });
});

describe('makeUnionType', () => {
  test('single type', () => {
    const result = types.makeUnionType([{
      name: 'string',
      isRequired: false,
      isArray: false,
    }]);
    expect(result).toBe('string');
  });
  test('multiple types', () => {
    const result = types.makeUnionType([
      {
        name: 'string',
        isRequired: false,
        isArray: false,
      },
      {
        name: 'number',
        isRequired: true,
        isArray: false,
      },
      {
        name: 'Appearance',
        isRequired: true,
        isArray: false,
      },
    ]);
    expect(result).toBe('string | number | Appearance');
  });
  test('arrays', () => {
    const result = types.makeUnionType([
      {
        name: 'string',
        isRequired: false,
        isArray: true,
      },
      {
        name: 'number',
        isRequired: true,
        isArray: true,
      },
    ]);
    expect(result).toBe('string[] | number[]');
  });
});
