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
    filename:'index.js'
  },
  //指定使用模块
  module:{
      rules: [{
        //test指定规则生效文件
        test: /\.ts$/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets:[
                [
                  '@babel/preset-env',
                  {
                    targets:{
                      chrome:"88"
                    },
                    "corejs": 3,
                    "useBuiltIns": "ussage"
                  },
                ]
              ]
            }
          },
          'ts-loader'
        ],
        exclude:/node_modules/
      }]
  },
  //指定使用插件
  plugins:[
    //自定义输入index.html插件
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
        title:'my-diy',
        filename:'myDiy.html',
        template:'./src/index.html'
    }),
  ],
  resolve:{
    extensions:['.ts','.js']
  }
}