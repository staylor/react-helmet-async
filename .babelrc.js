module.exports = {
  presets: [
    [
      'babel-preset-kyt-react',
      {
        includeRuntime: true,
      },
    ],
  ],
  env: {
    test: {
      plugins: [['@babel/plugin-proposal-private-property-in-object', { loose: true }]],
    },
  },
};
