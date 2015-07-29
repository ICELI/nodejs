/**
 * Created by iceli on 15/7/28.
 */
var fs = require("fs")
    ,http = require('http');

fs.readFile('/Users/iceli/Desktop/project/git/select2/select2-3.4.5/select2.css', 'utf-8', function (err, data) {
    var r = data.match(/url\(([^\(\)]+)\)/ig);
    var body = '';

    r.forEach(function(item, index, a){
        var imgSrc = item.replace(/(url\(['"]?)|(['"]?\))/ig, '');
        body += index + ': ' + imgSrc + '<img src="file://localhost/Users/iceli/Desktop/project/git/select2/select2-3.4.5/'+ imgSrc +'"/><br/>';
    });
    //console.log(r, r.length);
    var header = '<!DOCTYPE html>'+
        '<html lang="zh-CN">'+
        '<head>'+
        '<title>readFile Demo</title>'+
        '<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.2/css/bootstrap.min.css">'+
        '</head><body>';

    var footer = '<script src="http://cdn.bootcss.com/jquery/1.11.2/jquery.min.js"></script>'+
        '<script src="http://cdn.bootcss.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>'+
        '</body></html>';
    server(header + body +footer);
});

function server(html){
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(html);
    }).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
}

///Users/iceli/Desktop/project/git/select2/select2-3.4.5/select2.css