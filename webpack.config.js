const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

var website ={
    publicPath:"http://localhost:8888/"
    // publicPath:"http://192.168.1.103:8888/"
}

module.exports = {
    mode: "development",
    //入口文件配置
    entry: {
        //main可以随便写
        main: "./src/main.js",
        // main2: "./src/main2.js"
    },
    //出口文件配置项
    output: {
        //打包路径
        path: path.resolve(__dirname, "dist"),
        //打包文件名
        filename: "[name].js", //[name]的意思是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件
        publicPath: website.publicPath  //publicPath：主要作用就是处理静态文件路径的。你会发现原来的相对路径改为了绝对路径，这样来讲速度更快
    },
    //模块， 解读css，图片等
    module: {
        rules: [
            //css loader
            {
                test:/\.css$/,
                use: extractTextPlugin.extract({
                    fallback: {
                        loader: "style-loader",// 这里表示不提取的时候，使用什么样的配置来处理css
                        options: {
                            singleton: true // 表示将页面上的所有css都放到一个style标签内
                        }
                    },
                    use:[// 提取的时候，继续用下面的方式处理
                        {
                            loader:"css-loader?importLoaders=1",//参数importLoaders=1是为了预防css文件里面再import其他css文件，会使得import进来的不会自动加前缀
                            options: {
                                minimize: true  // 开启压缩
                            }
                        },
                        {
                            loader:"postcss-loader",
                            options: {
                                ident: 'postcss',  // 表示下面的插件是对postcss使用的
                                // plugins: [
                                //     PostCss_CssNext(), // 允许使用未来的css（包含AutoPrefixer功能）
                                // ]
                            }
                        },
                    ]
                }),
                exclude: /node_modules/
                // use: extractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
                // use: [
                //         {
                //             loader:"style-loader"
                //         },
                //         {
                //             loader: "css-loader"
                //         }
                //     ]
            },
            //图片 loader
            {
                test:/\.(png|jpg|gif|jpeg)$/,  //是匹配图片文件后缀名称
                use:[{
                    loader:'url-loader', //是指定使用的loader和loader的配置参数
                    options:{
                        limit:500,  //是把小于500B的文件打成Base64的格式，写入JS
                        outputPath:'images/',  //打包后的图片放到images文件夹下
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'],
                exclude: /node_modules/
            },
            //less loader
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                }),
                exclude: /node_modules/
                // use: [
                //     {
                //        loader: "style-loader" // creates style nodes from JS strings
                //     }, 
                //     {
                //         loader: "css-loader" // translates CSS into CommonJS
                //     },
                //     {
                //         loader: "less-loader" // compiles Less to CSS
                //     }
                // ]
            },
            //scss loader
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                }),
                exclude: /node_modules/
                // use: [{
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "sass-loader" // compiles Sass to CSS
                // }]
            },
            //babel 配置
           {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude:/(node_modules|bower_components)/
            },
			//vue loader
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
        ]
    },
    //插件, 用于生产板块和各项功能
    plugins: [
        new CleanWebpackPlugin(
            ['dist'],
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: true        　　　　　　　　　　//启用删除文件
            }),
        new uglify(), //js压缩插件
        new htmlPlugin({
            minify:{ //是对html文件进行压缩
                removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./src/index.html' //是要打包的html模版路径和文件名称。
        }),
        new extractTextPlugin("css/index.css"),  //这里的/css/index.css 是分离后的路径
        // new PurifyCSSPlugin({ 
        //     paths: glob.sync([ // 传入多文件路径
        //         path.resolve(__dirname, './*.html'), // 处理根目录下的html文件
        //         path.resolve(__dirname, './src/*.js') // 处理src目录下的js文件
        //     ])
        // }),
		new OpenBrowserPlugin(
            { 
                url: 'http://localhost:8888' 
            }
        ),
		new VueLoaderPlugin()
    ],
    //配置webpack开发服务功能
    devServer: {
        inline: true,   //实时刷新
        //设置基本目录结构
        contentBase: path.resolve(__dirname, "dist"),
        //服务器的ip地址，可以使用ip，也可以使用localhost
        host: "localhost",
        //服务器端压缩是否开启
        compress: true,
        //服务器端口号
        port: 8888
    }
};