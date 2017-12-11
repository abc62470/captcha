var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less'); //编译less
var babel = require('gulp-babel'); //ES6转换ES5
var uglify = require('gulp-uglify'); //压缩JS文件
var rename = require('gulp-rename'); //重命名文件
var cssnano = require('gulp-cssnano'); //压缩CSS文件
var concat = require('gulp-concat'); //合并文件
var source = require('vinyl-source-stream'); //将Browserify的bundle()的输出转换为Gulp可用的vinyl
var buffer = require('gulp-buffer'); //文件转为buffer兼容部分插件
var plumber = require('gulp-plumber');//阻止 gulp 插件发生错误导致进程退出
var notify = require('gulp-notify');//提示出现了错误
var browserify = require('browserify');
var util = require('gulp-util');
var babelify = require('babelify');//es6转为browserify可识别@import
var browserSync = require('browser-sync').create(); //热加载/同步测试
var path = {
    LESS: 'src/less/*.less',
    HTML: 'src/template/index.html',
//    JS: 'src/js/main.js',
    IMG: 'src/images/*',
    ES6: 'src/js/es6/*.js',
    ES5: 'src/js/es5/*.js'
}

gulp.task('default', ['serve']);

gulp.task('less', function() {
    gulp.src(path.LESS)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    	.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
})

gulp.task('img', function() {
    gulp.src(path.IMG)
        .pipe(gulp.dest('dist/images'));
})

/*
gulp.task('build', function() {//生成JS压缩文件
    var b = browserify({
      entries: './src/js/es6/captcha.js',
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
      .pipe(source('captcha.js'))
      .pipe(buffer())
      //.pipe(uglify())
      .pipe(gulp.dest('./src/js/es5'));
})
*/


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

/*


gulp.task('babel2', function(){
//    return gulp.src('src/js/es6/captcha.js')
	return gulp.src(path.JS)
        .pipe(plumber())
        .pipe(sourcemaps.init())
	    .pipe(babel({
            presets: ['env']
    }))
        .pipe(sourcemaps.write())
	    .pipe(gulp.dest("src/js/es5"))
	    .pipe(browserSync.stream());
	})

gulp.task('concat', ['babel'], function(){
    return gulp.src(path.ES5)
        .pipe(concat('bundle.js'))//合并文件名
        .pipe(gulp.dest('dist/js'));
    })
/*
gulp.task('js', function() {
    var b = browserify({
//        entries: path.JS
        entries: 'src/js/es5/main.js'
    });

    return b.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
})
*/

gulp.task('browserify', function() {
/*
    var b = browserify({
        entries: "src/js/es6/main.js",
        debug: true 
    });
    
    return b.transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            // 在这里将转换任务加入管道
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
*/

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
        // Add other gulp transformations (eg. uglify) to the pipeline here.
        //.pipe(uglify())
        //.on('error', util.log)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
})


gulp.task('serve', ['less', 'html', 'img', 'browserify'], function() {
    browserSync.init({
        server: './dist'
    });

    gulp.watch(path.LESS, ['less']);
    gulp.watch(path.HTML, ['html']);
    gulp.watch(path.HTML, ['img']);
    gulp.watch(path.JS, ['browserify']);
    gulp.watch(path.ES6, ['browserify']);
})
