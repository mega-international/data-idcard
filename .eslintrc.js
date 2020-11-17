module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'linebreak-style': 'off',
    semi: 'error',
    indent: [ 'error', 2, {
      SwitchCase: 1
    } ],
    'brace-style': [ 'error', '1tbs' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'comma-dangle': [ 'error', 'only-multiline' ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-irregular-whitespace': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'import/extensions': [ 'warn', 'ignorePackages' ],
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'arrow-parens': 'warn',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state'
        ]
      }
    ],
    'no-return-assign': 'off',
    'max-len': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': [ 'warn', {
      singleline: 3,
      multiline: {
        max: 3,
        allowFirstLine: false
      }
    } ]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
};
