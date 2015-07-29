/**
 * Created by iceli on 15/7/28.
 */
var request = require('request'),
    urlparse = require('url').parse,
    fs = require("fs"),
    http = require('http');

var getImg = {
    init: function(url) {
        this.url = url; // css路径
        this.filePath = this.url.substring(0, this.url.lastIndexOf('/') + 1); // css文件路径
        this.downFile(url, '', true);
    },
    /**
     * 下载远程文件
     * @param url 文件地址
     * @param dirname 本地保存文件路径 TODO
     * @param cb 下载完成后的回调
     */
    downFile: function(url, dirname, cb) {
        var that = this;
        var urlInfo  = urlparse(url);
        console.log(urlInfo);
        var fileName  = urlInfo.pathname.split('/').pop();
        var downFileDir = dirname + fileName;

        cb && (this.file = downFileDir);

        request(url).pipe(fs.createWriteStream(downFileDir).on('drain', function() {
            cb && that.parseSrc(downFileDir);
        }));
    },
    /**
     * 解析css文件
     * @param file 保存到本地的css文件
     */
    parseSrc: function(file) {
        var that = this;
        that.files = [];

        fs.readFile(file, 'utf-8', function (err, data) {
            var r = data.match(/url\(([^\(\)]+)\)/ig);
            var body = '';
            var tmp = {};
            //去重
            r.forEach(function (item, index, a) {
                var imgSrc = item.replace(/(url\(['"]?)|(['"]?\))/ig, '');
                if(!tmp[item]) {
                    tmp[item] = 1;
                    that.files.push(imgSrc);
                }
            });

            that.files.forEach(function(imgSrc, index){
                that.downFile(that.filePath + imgSrc, '');
                body += index + ': ' + imgSrc + '<img src="'+ that.filePath + imgSrc + '"/><br/>';
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
    server: function(html){
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(html);
        }).listen(1337, '127.0.0.1');
        console.log('Server running at http://127.0.0.1:1337/');
    }
};
// 获取css文件所包含的图片
getImg.init('http://www.maisulang.com/dsw/front/css/index.css?V2.1');
