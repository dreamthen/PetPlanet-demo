module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  weapp: {
    module: {
      postcss: {
        url: {
          enable: true,
          limit: 102400000000
        }
      }
    }
  },
  h5: {}
};
