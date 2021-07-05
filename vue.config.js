const path                     = require('path');
const resolve                  = dir => path.join(__dirname, dir);
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // "compression-webpack-plugin": "^6.0.3"
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: '../view2-comp-dash-board-dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 以多页模式构建应用程序。
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: process.env.VUE_APP_WEBSITE_NAME
    }
  },
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // webpack配置
  // 对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // 兼容低版本
    // config.entry('index').add('babel-polyfill');
    // 添加别名
    config.resolve.alias.set('@', resolve('src'));

    // @see https://www.tailwindcss.cn/docs/configuration
    config.module.rule('css').use('postcss').loader('postcss-loader').options({
      ident  : 'postcss',
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    });
  },
  // 调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: {
    plugins: [
      // 配置compression-webpack-plugin压缩 https://www.webpackjs.com/plugins/compression-webpack-plugin/
      new CompressionWebpackPlugin({
        algorithm           : 'gzip',
        test                : new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold           : 10240, // 对10K以上的数据进行压缩
        minRatio            : 0.8,
        deleteOriginalAssets: false // 是否删除源文件
      })
    ]
  },
  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    host   : '0.0.0.0',
    port   : 8000, // 端口号
    https  : false, // https:{type:Boolean}
    open   : true, // 配置自动启动浏览器
    hotOnly: true // 热更新
    // proxy  : { // 配置自动启动浏览器
    //   [process.env.VUE_APP_URL_PREFIX]: {
    //     'target'      : process.env.VUE_APP_PROXY_URL,
    //     'changeOrigin': true,
    //     'secure'      : false,
    //     'bypass'      : function (req, res, proxyOptions) {
    //       console.log('devServer proxy : ', proxyOptions.target);
    //     }
    //   }
    // }
    // proxy  : {
    //   '/ubuntu-releases': {
    //     target        : 'http://mirrors.163.com/',
    //     'changeOrigin': true,
    //     'secure'      : false
    //   }
    // }
  }
};
