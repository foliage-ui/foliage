module.exports = {
  plugins: [
    [
      require.resolve('./babel-plugin.js'),
      { allowedModules: '../foliage', debug: true },
    ],
    ['effector/babel-plugin', { addLoc: true }],
  ],
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
};
