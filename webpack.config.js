/*
* @Author: Xiaohan
* @Date:   2016-07-21 15:22:27
* @Last Modified by:   Xiaohan
* @Last Modified time: 2016-07-29 14:38:30
*/

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

module.exports = {
  entry: {
    index: './js/index',


  },
  output: {
    path: './dist',
    filename: 'js/[name].js',

  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    root: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './components')
    ],
    alias: {
      // angular:'./lib/angular.min.js'


    }
  },
  module:{
    loaders:[{
      test:/\.js$/,
      loader:'babel',
      exclude:/node_modules/,
    }, {
      test:/\.css$/,
      // loader:ExtractTextPlugin.extract('style', 'css'),

      loader:'style!css',
    }, {
      test:/\.(scss|sass)$/,
      // loader:ExtractTextPlugin.extract('style', 'css!sass'),
      loader:'style!css!sass',
    },{
      test:/\.(?:jpg|png|gif|eot|svg|ttf|woff)$/,
      loader:'file',
    },],
  },
  babel: {
    presets: ['es2015'],
  },
  externals: {
    'io': 'io',
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),

    new webpack.ProvidePlugin({ //加载jq                                                                                                      +
        $: 'jquery',
        jQuery: 'jquery'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
    //     chunks: ['index','grade','login','detail'], //提取哪些模块共有的部分
    //     minChunks: 3 // 提取至少3个模块共有的部分
    // }),

    new HtmlWebpackPlugin({
        template:'index.html',
        filename: './index.html',
        inject: true, //js插入的位置，true/'head'/'body'/false
        hash:true,
        chunks: ['index'],
        minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    }),
    // new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    //     // favicon: './src/img/favicon.ico',
    //     filename: './html/gradeClass.html', //生成的html存放路径，相对于path
    //     template: './html/gradeClass.html', //html模板路径
    //     inject: true, //js插入的位置，true/'head'/'body'/false
    //     hash: true, //为静态资源生成hash值
    //     chunks: ['vendors', 'grade'],//需要引入的chunk，不配置就会引入所有页面的资源
    //     minify: { //压缩HTML文件
    //         removeComments: true, //移除HTML中的注释
    //         collapseWhitespace: false //删除空白符与换行符
    //     }
    // }),
    // new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    //     // favicon: './src/img/favicon.ico',
    //     filename: './html/detail.html', //生成的html存放路径，相对于path
    //     template: './html/detail.html', //html模板路径
    //     inject: true, //js插入的位置，true/'head'/'body'/false
    //     hash: true, //为静态资源生成hash值
    //     chunks: ['vendors', 'detail'],//需要引入的chunk，不配置就会引入所有页面的资源
    //     minify: { //压缩HTML文件
    //         removeComments: true, //移除HTML中的注释
    //         collapseWhitespace: false //删除空白符与换行符
    //     }
    // }),
    // new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    //       // favicon: './src/img/favicon.ico',
    //       filename: './html/login.html', //生成的html存放路径，相对于path
    //       template: './html/login.html', //html模板路径
    //       inject: true, //js插入的位置，true/'head'/'body'/false
    //       hash: true, //为静态资源生成hash值
    //       chunks: ['vendors', 'login'],//需要引入的chunk，不配置就会引入所有页面的资源
    //       minify: { //压缩HTML文件
    //           removeComments: true, //移除HTML中的注释
    //           collapseWhitespace: false //删除空白符与换行符
    //       }
    // }),

    // new ExtractTextPlugin('./css/[name].css'),

    new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js')
  ],

  devServer: {
        // hot: true,
        // inline: true,

        proxy: {
          '/ws/*':{
            target: {
              host: '192.168.2.164',
              protocol: 'http:',
              port: 8080
            },
            secure: false,
            changeOrigin: true
          },
          '/courseware/api/*':{
            target: {
              host: '192.168.2.222',
              protocol: 'http:',
              port: 2016
            },
            secure: false,
            changeOrigin: true
          },
          '/upnote/upnoteDetailList': {
              target: {
                host: 'www.xuexibao.cn',
                protocol: 'http:',
                port: 80
              },
              secure: false,
              changeOrigin: true

          },
          '/upnote/upnoteDetailDateList': {
              target: {
                host: 'www.xuexibao.cn',
                protocol: 'http:',
                port: 80
              },
              secure: false,
              changeOrigin: true

          },
          '/upnote/getUser': {

              target: {
                host: 'www.xuexibao.cn',
                protocol: 'http:',
                port: 80
              },
              secure: false,
              changeOrigin: true

          },
          '/notebook/api/*': {

              target: {
                host: 'webapi.91xuexibao.com',
                protocol: 'http:',
                port: 12306
              },
              secure: false,
              changeOrigin: true

          }
        }
  }
}
