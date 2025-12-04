module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'prefer-const': 'warn',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ]
};
