/**
 * Created by iceli on 15/7/28.
 */
var request = require('request'),
    urlparse = require('url').parse,
    fs = require("fs"),
    http = require('http');

var getImg = {
    init: function(url) {
        this.url = url; // css·��
        this.filePath = this.url.substring(0, this.url.lastIndexOf('/') + 1); // css�ļ�·��
        this.downFile(url, '', true);
    },
    /**
     * ����Զ���ļ�
     * @param url �ļ���ַ
     * @param dirname ���ر����ļ�·�� TODO
     * @param cb ������ɺ�Ļص�
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
     * ����css�ļ�
     * @param file ���浽���ص�css�ļ�
     */
    parseSrc: function(file) {
        var that = this;
        that.files = [];

        fs.readFile(file, 'utf-8', function (err, data) {
            var r = data.match(/url\(([^\(\)]+)\)/ig);
            var body = '';
            var tmp = {};
            //ȥ��
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
     * �������� ��ʾͼƬ�б�
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
// ��ȡcss�ļ���������ͼƬ
getImg.init('http://www.maisulang.com/dsw/front/css/index.css?V2.1');
