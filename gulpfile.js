var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var electron = require('electron-connect').server.create();

var srcDir = 'src';
var libDir = 'build';

gulp.task('compile', function(){
  return gulp.src(srcDir + '/**/*.{js,jsx}')
    .pipe($.babel())
    .pipe(gulp.dest(libDir));
});

// Make HTML and concats CSS files.
gulp.task('html', function () {
  return gulp.src(srcDir + '/renderer/**/*.html')
    .pipe(gulp.dest(libDir + '/renderer'))
  ;
});

// コンパイルしてElectron起動
gulp.task('start', ['compile', 'html'], function(){
  // electron開始
  electron.start();
  // ファイルが変更されたら再コンパイル
  gulp.watch(srcDir + '/**/*.{js,jsx}', ['compile']);
  // BrowserProcessが読み込むファイルが変更されたらRestart。
  gulp.watch(['main.js'], electron.restart);
  // RendererProcessが読み込むファイルが変更されたらReload。
  gulp.watch(['index.html', libDir + '/**/*.{html,js,css}'], electron.reload);
});
