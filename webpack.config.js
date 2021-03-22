const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  //入口
  entry:{
    path:'/src/index.ts'
  },
  //出口
  output:{
    path:path.resolve(__dirname,'dist'),
    filename: 'bundle.js'
  },
  //打包模式
  // mode: 'development',
  //指定使用模块
  module:{
      rules: [
        {
        //test指定规则生效文件
          test: /\.ts$/,
          use: [
          {
            loader: 'babel-loader', // 指定加载器
            options: { // 指定加载器
              presets: [ // 设置预定义的环境
                [
                  '@babel/preset-env', // 指定环境的插件
                  {
                    targets:{
                      chrome: "88" // 要兼容的目标浏览器
                    },
                    "corejs": 3, // 指定corejs的版本
                    "useBuiltIns": "usage" // 使用corejs的方式 "usage" 表示按需加载
                  },
                ]
              ]
            }
          },
          'ts-loader'
        ],
        exclude:/node_modules/  // 要排除的文件
      },
      //设置less文件处理
      {
          test:/\.less$/,
          use:[
            'style-loader',
            'css-loader',
            //处理css兼容
            {
              loader:'postcss-loader',
              options:{
                postcssOptions:{
                  plugins:[
                    [
                      'postcss-preset-env', // 浏览器兼容插件
                      {
                        browsers:'last 2 versions'// 每个浏览器最新两个版本
                      }
                    ]
                  ]
                }
              }
            },
            'less-loader',
          ]
      }
    ]
  },
  //指定使用插件
  plugins:[
    //自定义输入index.html插件
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
        title:'greedy-snake',
        filename:'index.html',
        template:'./src/index.html'
    }),
  ],
  resolve:{
    extensions:['.ts','.js']
  }
}