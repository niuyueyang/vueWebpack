const path=require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isDev=process.env.NODE_ENV==='development';
const htmlWebpack=require('html-webpack-plugin');
const webpack=require('webpack');
const extractPlugin=require('extract-text-webpack-plugin');

const config={
	target:'web',
	entry:path.join(__dirname,'src/main.js'),
	output:{
		filename:"bundle.js",
		path:path.join(__dirname,'dist')
	},
	plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(),
        //自动生成html文件，并且引入
        new htmlWebpack(),
        new webpack.DefinePlugin({
        	'process_env':{
        		NODE_ENV:isDev?'"development"':'"production"'
        	}
        })
    ],
	module:{
		rules:[
			{
				test:/\.vue$/,
				loader:'vue-loader'
			},
			{
				test:/\.jsx$/,
				loader:'babel-loader'
			},
			{
				test:/\.(gif|jpg|jpeg|png|svg)$/,
				use:[
					{
						loader:'url-loader',
						options:{
							limit:1024,
							name:'[name].[ext]'
						}
					}
				]
			}			
		]
	}
}

if(isDev){
	config.devtool="#cheap-module-eval-source-map";
	config.module.rules.push(
			{
				test:/\.styl$/,
				use:[
					'style-loader',
					'css-loader',
					{
						loader:'postcss-loader',
						options:{
							sourceMap:true
						}
					},
					'stylus-loader'
				]
			},
			{
				test:/\.css$/,
				loaders:extractPlugin.extract({
					//转换.css文件需要使用的Loader
					use:['css-loader']//压缩css代码
				}),							
			}
	);
	config.plugins.push(
		new extractPlugin('style.css'),
	);
	config.devServer={
		port:'8000',
		host:'0.0.0.0',
		overlay:{
			errors:true,//将错误信息显示到页面上
		},
		hot:true,//防止全部刷新
	}
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	)
}else{
	config.entry={
		app:path.join(__dirname,'src/main.js'),
		vendor:['vue','vue-router','vuex']
	}
	config.output.filename='[name].[chunkhash:8].js';
	config.module.rules.push(
			{
				test:/\.styl$/,
				use:extractPlugin.extract({
					fallback:'style-loader',
					use:[
						'css-loader',
						{
							loader:'postcss-loader',
							options:{
								sourceMap:true
							}
						},
						'stylus-loader'
					]
				})
			},
			{
				test:/\.css$/,
				loaders:extractPlugin.extract({
					//转换.css文件需要使用的Loader
					use:['css-loader']//压缩css代码
				}),							
			}
	);
	config.plugins.push(
		new extractPlugin('style.css'),
	);
	 config.optimization = {
	     splitChunks: {
	      cacheGroups: {
	        commons: {
	          chunks: 'initial',
	          minChunks: 2, 
	          maxInitialRequests: 5,
	          minSize: 0
	        },
	        vendor: {
	          test: /node_modules/,
	          chunks: 'initial',
	          name: 'vendor',
	          priority: 10,
	          enforce: true
	        }
	      }
	    },
	    runtimeChunk: true
   	}
}

module.exports=config;