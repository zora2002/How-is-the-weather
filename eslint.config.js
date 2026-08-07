import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    // @typescript-eslint doesn't support TypeScript 7 yet (peer range <6.1.0),
    // so .ts/.tsx can't be parsed here until it catches up.
    ignores: ['build', 'coverage', 'doc', 'node_modules', '**/*.ts', '**/*.tsx', '**/*.mts'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': 'error',
    },
  },
]
