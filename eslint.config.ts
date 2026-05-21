// import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { prettier: prettierPlugin },
    extends: ['js/recommended', prettierConfig],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // ...(prettierPlugin.configs?.recommended as any).rules,
      'prettier/prettier': 'error',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-else-return': 'warn',
      // allowObjectTypes: 'warn',
    },
  },
  tseslint.configs.recommended,
]);
