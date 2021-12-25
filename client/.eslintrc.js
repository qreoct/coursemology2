module.exports = {
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'jest',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'eslint-comments',
    'simple-import-sort',
  ],
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/strict',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['lib', './app/lib'],
          ['api', './app/api'],
          ['course', './app/bundles/course'],
          ['testUtils', './app/__test__/utils'],
        ],
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': ['error', { forbid: ['any', 'array'] }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'off',
    'react/no-unused-prop-types': ['warn', { skipShapeProps: true }],
    'react/prefer-stateless-function': 'off',
    'react/require-default-props': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    'eslint-comments/no-aggregating-enable': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
    'eslint-comments/no-use': [
      'error',
      {
        allow: [
          'eslint-disable',
          'eslint-disable-line',
          'eslint-disable-next-line',
          'eslint-enable',
        ],
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
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(lib|api|course|testUtils)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` behind, and style imports last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    camelcase: ['warn', { properties: 'never', allow: ['^UNSAFE_'] }],
    'comma-dangle': ['error', 'always-multiline'],
    'default-param-last': 'off',
    'func-names': 'off',
    'max-len': ['warn', 120],
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
  },
  overrides: [
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
        intlShape: true,
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
