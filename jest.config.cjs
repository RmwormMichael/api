module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testTimeout: 10000 // Esto puede quedarse si necesitas más tiempo para las pruebas
  };