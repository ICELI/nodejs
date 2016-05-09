# nodejs
learn nodejs

##nodejs-readFile
###readFile.js 读取远程css里面引用的图片
* 读取css文件保存到本地
* 匹配url(...)
* 解析图片相对路径获取远程完整url
* 获取图片保存到本地，相对css文件创建文件夹

###getAllFiles.js 遍历文件夹获取所有文件列表
* 遍历当前文件夹获取文件列表
	`getAllFiles(root)` `fs.readdirSync(root)`
* 若子文件不是文件夹，则返回目录
	`!stat.isDirectory()` `pathname`
* 若子文件是文件夹，则遍历文件夹
	`stat.isDirectory()` `getAllFiles(pathname)`