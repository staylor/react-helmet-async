module.exports = {
  extends: ['kyt'],

  rules: {
    'react/static-property-placement': 0,
  },

  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'react/jsx-props-no-spreading': 0,
      },
    },
  ],
};
