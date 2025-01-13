module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',  // Usa babel-jest para transformar los archivos JS
  },
  moduleFileExtensions: ['js', 'json'],
  transformIgnorePatterns: [
    '/node_modules/(?!some-esm-package).*/', // Asegúrate de que Jest procese los módulos ESM
  ],
  globals: {
    'babel-jest': {
      useESM: true, // Habilita el soporte para módulos ESM en Jest
    },
  },
  moduleNameMapper: {
    '^some-esm-package$': '<rootDir>/node_modules/some-esm-package/dist/index.js',
  }
  
};
