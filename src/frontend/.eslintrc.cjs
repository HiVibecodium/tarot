module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'public/*.js', '**/*.backup*.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Relax unused vars rules - allow unused vars starting with _ or in JSX
    'no-unused-vars': ['warn', {
      varsIgnorePattern: '^_|^React$',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    // React specific
    'react/prop-types': 'off', // We don't use PropTypes
    'react/no-unescaped-entities': 'off',
  },
}
