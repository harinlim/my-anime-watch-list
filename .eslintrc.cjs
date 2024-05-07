// @ts-check
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@next/next/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended-type-checked', // @typescript-eslint @v6
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  plugins: ['jsx-a11y', '@typescript-eslint', 'import'],
  rules: {
    'no-void': ['error', { allowAsStatement: true }],

    'import/no-empty-named-blocks': 'error',

    'react/jsx-max-depth': ['warn', { max: 8 }],
    'react/jsx-curly-newline': ['error', 'consistent'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'], allow: 'as-needed' }],

    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/promise-function-async': 'error',
  },

  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', // Infer typing on specified ECMAScript features - should be in parity with TSConfig lib
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    project: './tsconfig.json', // Configure parser to use TSConfig specified for type information
    sourceType: 'module', // Use ESM source for imports
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: true,
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
