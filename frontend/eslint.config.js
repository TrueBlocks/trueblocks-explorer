import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import testingLibrary from 'eslint-plugin-testing-library';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: ['wailsjs/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        jsx: true,
        project: new URL('tsconfig.eslint.json', import.meta.url).pathname,
      },
    },
    plugins: {
      react: reactRecommended.plugins.react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
      prettier: prettier,
      'unused-imports': unusedImports,
      'testing-library': testingLibrary,
    },
    rules: {
      ...reactRecommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...prettierRecommended.rules,
      ...testingLibrary.configs.react.rules,
      'testing-library/prefer-screen-queries': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/__tests__/**/*', '**/__mocks__/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
