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
  plugins: ['jsx-a11y', '@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    'no-void': ['error', { allowAsStatement: true }],
    'no-console': ['warn', { allow: ['warn', 'error', 'time', 'timeEnd', 'info', 'table'] }],

    'import/no-empty-named-blocks': 'error',
    'import/prefer-default-export': 'off',
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
      },
    ],

    'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],

    'react/jsx-max-depth': ['warn', { max: 8 }],
    'react/jsx-curly-newline': ['error', 'consistent'],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'], allow: 'as-needed' }],

    'unicorn/filename-case': 'off',
    'unicorn/prefer-string-raw': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-null': 'off',

    // Autofixes unused imports. Consider turning it off locally if it impedes your workflow.
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    // '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: null,
      },
    ],
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-explicit-any': 'warn',
  },

  overrides: [
    {
      /* --- ESM config files --- */
      files: ['**/*.config.ts', '**/*.mjs'],
      rules: {
        // Require default exports for config files (requirement)
        'import/prefer-default-export': 'error',
        'import/no-default-export': 'off',
      },
    },
    {
      /* --- CJS config files --- */
      files: ['**/*.config.js', '**/*.cjs'],
      rules: {
        // Require default exports for config files (requirement)
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      /* --- Testing files (Jest) --- */
      files: ['**.spec.ts', '**.spec.tsx'],
      plugins: ['jest', 'jest-extended', 'jest-formatting'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:jest-extended/all',
        'plugin:jest-formatting/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
      ],
      rules: {
        /* --- Additional auto-fixable rules --- */
        // Prefer semantic Jest matchers (e.g. `expect(x === 5).toBe(true)` -> `expect(x).toBe(5)`)
        'jest/prefer-equality-matcher': 'warn',
        // Enforces "_.todo" instead of empty tests
        'jest/prefer-todo': 'warn',
        // Prefer Promise utilities (e.g., `mockReturnValue(Promise.resolve(...))` -> `mockResolvedValue(...)`
        'jest/prefer-mock-promise-shorthand': 'warn',

        /* --- Other rules --- */
        // Other methods of asserting are fine (node:assert, RTL helpers, etc.). Can be configured to
        // allow other assertion keywords, but when abstracting to helpers, can get distracting
        'jest/expect-expect': 'off',

        // Enforce unbound methods to be called in their specific scope, expect when it's safe with `expect` calls
        // It's has issues with methods from `@testing-library`, so until it's resolved, we'll keep this off for now
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'off',
      },
    },
    {
      /* --- Generated type files --- */
      files: ['src/types/generated/*.ts'],
      rules: {
        '@typescript-eslint/no-redundant-type-constituents': 'off',
      },
    },
  ],

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
