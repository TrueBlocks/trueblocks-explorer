import * as Callers from './api_callers';

const baseUrl = 'http://localhost:8080';
beforeEach(() => {
  Callers.setBaseUrl(baseUrl);
  Callers.setFetch(global.fetch);
});

describe('makeUrl', () => {
  it('returns correct URL when no params', () => {
    const expected = `${baseUrl}/hello`;
    const result = Callers.makeUrl('/hello');
    expect(result).toBe(expected);
  });
  it('returns correct URL when params', () => {
    const expected = `${baseUrl}/hello?a=1&b=string&c=true&d=false`;
    const result = Callers.makeUrl('/hello', {
      a: 1,
      b: 'string',
      c: true,
      d: false,
    });
    expect(result).toBe(expected);
  });
});

describe('fetchBody', () => {
  it('fetches resource and returns Body', async () => {
    Callers.setFetch(() => Promise.resolve({
      json() {
        return Promise.resolve(JSON.stringify('hello'));
      },
    } as Response));
    const result = await Callers.fetchBody({
      endpoint: '/hello',
      method: 'get',
    });
    const value = await result.json();
    expect(JSON.parse(value)).toBe('hello');
  });
});
