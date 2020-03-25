// src: 指定输入文件目录
// dest: 输出文件目录
// series: 串联几个 tasks
// watch: 文件监听
const { src, dest, series, watch } = require('gulp')
// plugins 可以让 plugins => require('gulp-plugins')
const plugins = require('gulp-load-plugins')()
// 删除文件夹
const del = require('del')
// 可以提供一个本地服务器
const browserSync = require('browser-sync').create()
// 可以刷新文件的改动，使之生效到页面
const reload = browserSync.reload

// 压缩混淆js
function js(cb) {
  src('js/*.js')
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))
    .pipe(reload({ stream: true }))
  cb()
}

// 编译scss，压缩
function css(cb) {
  src('scss/*.scss')
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer({
      cascade: false,
      remove: false
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({ stream: true })) // 有变化时 reload 刷新
  cb()
}

// 监听文件变化
function watcher(cb) {
  watch('js/*.js', js)
  watch('scss/*.scss', css)
  cb()
}

// 启动一个服务
function serve(cb) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  cb()
}

// 清除构建产物
function clean(cb) {
  del('./dist')
  cb()
}

exports.js = js
exports.css = css
exports.clean = clean
exports.default = series([
  clean,
  js,
  css,
  serve,
  watcher
])