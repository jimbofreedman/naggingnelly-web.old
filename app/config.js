const config = {
  development: {
    api: {
      endpoint: 'http://localhost:8000/',
    },
    autoRefresh: false,
  },
  test: {
    api: {
      endpoint: 'http://localhost:8000/',
    },
    autoRefresh: false,
  },
  production: {
    api: {
      endpoint: 'https://api.naggingnelly.com/',
    },
    autoRefresh: true,
  },
};

export default config[process.env.NODE_ENV];
