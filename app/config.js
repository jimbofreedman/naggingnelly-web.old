const config = {
  development: {
    api: {
      endpoint: 'http://localhost:8000/',
    },
  },
  test: {
    api: {
      endpoint: 'http://localhost:8000/',
    },
  },
  production: {
    api: {
      endpoint: 'https://api.naggingnelly.com/',
    },
  },
};

export default config[process.env.NODE_ENV];
