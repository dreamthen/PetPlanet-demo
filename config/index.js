const webpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  projectName: 'Pet-Planet',
  date: '2018-11-26',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-sass',
    '@tarojs/plugin-less'
  ],
  babel: {
    sourceMap: false,
    presets: [
      'env'
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        helpers: false,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime'
      }]
    ]
  },
  uglify: {
    enable: true,
    config: {}
  },
  csso: {
    enable: true,
    config: {}
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  mini: {
    commonChunks: ['runtime', 'common', 'vendors'],
    webpackChain(chain, webpack, PARSE_AST_TYPE) {
      chain.plugin('analyzer').use(webpackBundleAnalyzer, []);
      //使用ContextReplacementPlugin将moment.locale当中除了zh-cn的语言包,其余都剔除掉
      chain.plugin('contextReplacement').use(new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /zh-cn/), []);
      //使用SplitChunksPlugin覆盖taro的默认配置
      chain.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        name: 'vendors',
        cacheGroups: {
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'initial',
            priority: 1
          },
          vendors: {
            name: 'vendors',
            minChunks: 2,
            chunks: 'initial',
            test: module => {
              // 如果需要自定义配置，PARSE_AST_TYPE 可以从 webpackChain 第三个参数获得
              return /[\\/]node_modules[\\/]/.test(module.resource)
            },
            priority: 10
          }
        }
      });
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      }
    },
    compile: {}
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
};
