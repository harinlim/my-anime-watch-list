// @ts-check
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:react/jsx-runtime',

    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended-type-checked', // @typescript-eslint @v6
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  plugins: ['jsx-a11y', '@typescript-eslint', 'import'],
  rules: {
    'no-void': ['error', { allowAsStatement: true }],
    'no-console': ['warn', { allow: ['warn', 'error', 'time', 'timeEnd', 'info', 'table'] }],

    'import/no-empty-named-blocks': 'error',
    'import/prefer-default-export': 'off',

    'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],

    'react/jsx-max-depth': ['warn', { max: 8 }],
    'react/jsx-curly-newline': ['error', 'consistent'],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'], allow: 'as-needed' }],

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',

    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
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
