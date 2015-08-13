/**
 * Created by iceli on 15/7/28.
 */
var request = require('request'),
    url = require('url'),
    urlparse = url.parse,
    fs = require("fs"),
    http = require('http');

var i = 0; // 下载文件计数

var getImg = {
    init: function (url) {
        this.url = url; // css路径
        this.filePath = this.url.substring(0, this.url.lastIndexOf('/') + 1); // css文件路径
        this.downFile(url, './download/', true);
    },
    /**
     * 下载远程文件
     * @param url 文件地址
     * @param dirname 本地保存文件路径
     * @param cb 下载完成后的回调
     */
    downFile: function (url, dirname, cb) {
        var that = this;
        var urlInfo = urlparse(url);
        var fileName = urlInfo.pathname.split('/').pop();
        var downFileDir = dirname + fileName;

        // 创建文件保存目录
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
            console.log('目录创建成功');
        } else {
            //console.log('目录已存在');
        }

        cb && (this.file = downFileDir);

        // base64图片下载
        if(/^data:image\/\w+;base64,/.test(url)) {
            var base64Data = url.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            var tmp = Date.now();
            var tmpName = Math.ceil(Math.random() * tmp).toString(36) + ".png";

            fs.writeFile(dirname + tmpName, dataBuffer, function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('下载' + i++ + ' ' +tmpName + ' base64');
                }
            });

        } else {
            //返回 fs.createReadStream(url) 流
            request(url).on('end', function() {
                cb && that.parseSrc(downFileDir);
                console.log('下载' + i++, fileName);
            }).pipe(fs.createWriteStream(downFileDir));
        }
    },
    /**
     * 解析css文件
     * @param file 保存到本地的css文件
     */
    parseSrc: function (file) {
        var that = this;
        that.files = [];

        fs.readFile(file, {encoding:'utf8',flag:'r'}, function (err, data) {
            var r = data.match(/url\(([^\(\)]+)\)/ig);
            var body = '<h1>' + err + '</h1><br/>' + data + '<br/>';
            var tmp = {};
            //去重
            console.log(r.length);
            r.forEach(function (item, index, a) {
                var imgSrc = item.replace(/(url\(['"]?)|(['"]?\))/ig, '');
                if (!tmp[imgSrc]) {
                    tmp[imgSrc] = 1;
                    that.files.push(imgSrc);
                }
            });
            console.log(that.files.length);
            that.files.forEach(function (imgSrc, index) {
                var imgPath = url.resolve(that.filePath, imgSrc); // fix '../' && './' && /^http(s)/

                that.downFile(imgPath, './download/'); // TODO: img目录
                body += index + ': ' + imgPath + '<img src="' + imgPath + '"/><br/>';
            });

            var header = '<!DOCTYPE html>' +
                '<html lang="zh-CN">' +
                '<head>' +
                '<title>readFile Demo</title>' +
                '<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
                '</head><body>';

            var footer = '<script src="http://cdn.bootcss.com/jquery/1.11.2/jquery.min.js"></script>' +
                '<script src="http://cdn.bootcss.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>' +
                '</body></html>';

            that.server(header + body + footer);
        });
    },
    /**
     * 启动服务 显示图片列表
     * @param html
     */
    server: function (html) {
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(html);
        }).listen(1337, '127.0.0.1');
        console.log('Server running at http://127.0.0.1:1337/');
    }
};
// 获取css文件所包含的图片
getImg.init('http://img1.cache.netease.com/utf8/3g/touch/20150727151246/styles/index.css');
