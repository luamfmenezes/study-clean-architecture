module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: 'latest',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
