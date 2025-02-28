module.exports = {
  parser: 'babel-eslint',
  plugins: ['jest'],
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['api', './app/api'],
          ['lib', './app/lib'],
          ['theme', './app/theme'],
          ['types', './app/types'],
          ['utilities', './app/utilities'],
          ['course', './app/bundles/course'],
          ['testUtils', './app/__test__/utils'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': ['error', { forbid: ['any', 'array'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'off',
    'react/no-unused-prop-types': ['warn', { skipShapeProps: true }],
    'react/prefer-stateless-function': 'off',
    'react/require-default-props': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
    'import/prefer-default-export': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-len': ['warn', 120],
    camelcase: ['warn', { properties: 'never', allow: ['^UNSAFE_'] }],
    'comma-dangle': ['error', 'always-multiline'],
    'func-names': 'off',
    'no-multi-str': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // Use `_` to indicate that the method is private
    'no-underscore-dangle': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'prefer-destructuring': 'off',
  },
  globals: {
    window: true,
    document: true,
    AudioContext: true,
    navigator: true,
    URL: true,
    $: true,
    FormData: true,
    File: true,
    FileReader: true,
    JSX: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'airbnb-typescript',
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      plugins: ['react-hooks'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
        'no-unused-vars': 'off',
        'react-hooks/rules-of-hooks': 'warn',
        'react/react-in-jsx-scope': 'off',
        'no-param-reassign': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              String: {
                message: 'Use string instead',
                fixWith: 'string',
              },
              Boolean: {
                message: 'Use boolean instead',
                fixWith: 'boolean',
              },
              Number: {
                message: 'Use number instead',
                fixWith: 'number',
              },
              Symbol: {
                message: 'Use symbol instead',
                fixWith: 'symbol',
              },
              Function: {
                message: [
                  'The `Function` type accepts any function-like value.',
                  'It provides no type safety when calling the function, which can be a common source of bugs.',
                  'It also accepts things like class declarations, ',
                  'which will throw at runtime as they will not be called with `new`.',
                  'If you are expecting the function to accept certain arguments, ',
                  'you should explicitly define the function shape.',
                ].join('\n'),
              },
              '{}': {
                message: [
                  '`{}` actually means "any non-nullish value".',
                  '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                  '- If you want a type meaning "any value", you probably want `unknown` instead.',
                ].join('\n'),
              },
            },
            extendDefaults: false,
          },
        ],
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-empty-function': [
          'error',
          { allow: ['arrowFunctions'] },
        ],
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowNumber: true,
            allowBoolean: true,
            allowAny: true,
            allowNullish: true,
            allowRegExp: true,
          },
        ],
      },
    },
    {
      files: [
        '**/__test__/**/*.js',
        '**/__test__/**/*.jsx',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
      ],
      env: {
        jest: true,
      },
      globals: {
        courseId: true,
        intl: true,
        sleep: true,
        buildContextOptions: true,
        localStorage: true,
      },
      rules: {
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-alias-methods': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-done-callback': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/prefer-to-be': 'error',
        'jest/prefer-to-contain': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/prefer-spy-on': 'error',
        'jest/valid-expect': 'error',
        'jest/no-deprecated-functions': 'error',
        'react/no-find-dom-node': 'off',
        'react/jsx-filename-extension': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': [
          'error',
          {
            ignore: ['utils/'],
          },
        ],
      },
    },
  ],
};
