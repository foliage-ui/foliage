module.exports = {
  plugins: [
    ['effector/babel-plugin', { addLoc: true }],
    [
      require.resolve('./babel-plugin.js'),
      { allowedModules: '../foliage', debug: true },
    ],
  ],
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
};
