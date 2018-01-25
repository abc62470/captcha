var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less'); //编译less
var babel = require('gulp-babel'); //ES6转换ES5
var uglify = require('gulp-uglify'); //压缩JS文件
var rename = require('gulp-rename'); //重命名文件
var cssnano = require('gulp-cssnano'); //压缩CSS文件
var imagemin = require('gulp-imagemin'); //压缩图片文件
var pngquant = require('imagemin-pngquant'); //压缩图片文件
var concat = require('gulp-concat'); //合并文件
var source = require('vinyl-source-stream'); //将Browserify的bundle()的输出转换为Gulp可用的vinyl
var buffer = require('gulp-buffer'); //文件转为buffer兼容部分插件
var plumber = require('gulp-plumber');//阻止 gulp 插件发生错误导致进程退出
var notify = require('gulp-notify');//提示出现了错误
var autoprefixer = require('gulp-autoprefixer');//自动处理浏览器CSS前缀
var browserify = require('browserify');
var util = require('gulp-util');
var babelify = require('babelify');//es6转为browserify可识别@import
var browserSync = require('browser-sync').create(); //热加载/同步测试
var path = {
    LESS: 'src/less/*.less',
    HTML: 'src/index.html',
    IMG: 'src/images/**/*',
    ES6: 'src/js/es6/*.js'
}
var env = {
  production: false
}

gulp.task('default', ['dev']);

gulp.task('set-production', function() {
  env.production = true;
      console.log("production-" + env.production);
})

gulp.task('less', function() {
    if(env.production) {
      console.log("less");
      return gulp.src(path.LESS)
          .pipe(less())
          .pipe(autoprefixer({
              browsers: ['last 2 versions'],
              cascade: false,
          }))
          .pipe(cssnano())
          .pipe(gulp.dest('dist/css'));
          } else{
            return gulp.src(path.LESS)
                .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false,
                }))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('dev/css'))
                .pipe(browserSync.stream());
          }


});

gulp.task('html', function() {
    if(env.production) {
      console.log("html");
      return gulp.src(path.HTML)
          .pipe(gulp.dest('dist'))
    } else{
      return gulp.src(path.HTML)
          .pipe(gulp.dest('dev'))
          .pipe(browserSync.stream());
    }
})

gulp.task('img', function() {
    if(env.production) {
      console.log("img");
      return gulp.src(path.IMG)
          .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
            }))
          .pipe(gulp.dest('dist/images'));
    } else{
      return gulp.src(path.IMG)
          .pipe(gulp.dest('dev/images'));
    }
})


//生成指定JS S
/*
gulp.task('babel', function() {
    return gulp.src('./src/js/es6/captcha.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(gulp.dest('D:/TFSPROJECT/JD/JDSystem/JD/JD/js'));
        .pipe(gulp.dest('./src/js/es5'));
});

gulp.task('watch',function(){
    gulp.watch('./src/js/es6/captcha.js',['babel']);
})
*/
//生成指定JS E


gulp.task('browserify', function() {
    if(env.production) {
      console.log("bw");
      var b = browserify({
        entries: './src/js/es6/main.js',
        transform: [babelify.configure({
          presets: ['es2015']
        })]
      });

      return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))

    } else{
        var b = browserify({
          entries: './src/js/es6/main.js',
          debug: true,
          transform: [babelify.configure({
            presets: ['es2015']
          })]
        });

        return b.bundle()
            .on('error', function(err){//报出错误信息，不导致整个任务中断
              console.log(err.message);
              this.emit('end');
            })
          .pipe(source('bundle.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('./dev/js'))
          .pipe(browserSync.stream());
    }

})


gulp.task('dev', ['less', 'html', 'img', 'browserify'], function() {
    browserSync.init({
        server: './dev'
    });

    gulp.watch(path.LESS, ['less']);
    gulp.watch(path.HTML, ['html']);
    gulp.watch(path.HTML, ['img']);
    gulp.watch(path.JS, ['browserify']);
    gulp.watch(path.ES6, ['browserify']);
})

gulp.task('build', ['set-production', 'less', 'html', 'img', 'browserify'], function() {
})
