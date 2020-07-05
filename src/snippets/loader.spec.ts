import * as mock from 'mock-fs';
import SnippetsLoader from './loader';

const testData = {
  testsnippet: {
    prefix: 'snip',
    body: ['test'],
    description: 'some test snippet',
    context: {
      file: '.github/.workflows/.*.yaml'
    }
  }
};

let loader: SnippetsLoader;

beforeEach(() => {
  loader = new SnippetsLoader();
  mock({
    '/snippets': {
      'test.json': JSON.stringify(testData)
    }
  });
});

describe('Snippets Loader', () => {
  it('loads snippet files', async () => {
    const snippets = await loader.load(['/snippets']);
    expect(snippets.length).toBe(1);
    expect(snippets[0].id).toBe('testsnippet');
    expect(snippets[0].prefix).toBe('snip');
    expect(snippets[0].description).toBe('some test snippet');
    expect(snippets[0].body).toContain('test');
  });

  it('loads empty files if snippet folder was not found', async () => {
    const snippets = await loader.load(['/not-existing-snippets']);
    expect(snippets.length).toBe(0);
  });
});

afterEach(() => {
  mock.restore();
});
