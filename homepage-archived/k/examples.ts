/**
 * usage code snippet
 */
export const examples = {
  simplest: (
    t: string,
    key: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ) => `fetch('https://proxy.cors.sh/${t}', {
  headers: {
    'x-cors-api-key': '${key}',
  }
}).then(console.log);`,
  fetch: (
    t: string,
    key: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ) => `fetch('https://proxy.cors.sh/${t}', {
  headers: {
    'x-cors-api-key': '${key}',
  }
});

// or...
functon fetchWithProxy(url, params){
  return fetch(\`https://proxy.cors.sh/\${url}\`, 
  { 
    ...params,
    headers: 
    { 
      ...params.headers,
      'x-cors-api-key': '${key}'
    }
  });
}

fetchWithProxy('${t}')
  `,
  axios: (
    t: string,
    key: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ) => `import Axios from "axios";

Axios.get('https://proxy.cors.sh/${t}', {
  headers: {
    'x-cors-api-key': '${key}',
  }
})

// or...
const client = Axios.create({
  baseURL: 'https://proxy.cors.sh/' + '${t}',
  headers: {
    'x-cors-api-key': '${key}',
  }
})

client.get('/')
`,
} as const;
