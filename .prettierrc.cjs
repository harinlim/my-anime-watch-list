// @ts-check
/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  endOfLine: 'lf',
  arrowParens: 'avoid',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,

  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
        tabWidth: 2,
      },
    },
    {
      files: '*.css',
      options: {
        parser: 'css',
        printWidth: 80,
      },
    },
  ],
}
