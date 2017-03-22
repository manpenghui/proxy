var gulp=require('gulp');
var url=require('url');
var sass=require('gulp-sass');
var concat=require('gulp-concat');
var connect=require('gulp-connect');
var uglify=require('gulp-uglify');
var webserver=require('gulp-webserver');
var rename=require('gulp-rename');
var del=require('del');
var amdOptimize = require("amd-optimize");
var minifyCss=require('gulp-minify-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var proxy = require('http-proxy-middleware');
var mockApi=require('./mockfile.js');


gulp.task('copy-req',function(){
  return gulp.src('js/lib/require.js')
  .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-tpls',function(){
  return gulp.src('tpls/**/*.html')
  .pipe(gulp.dest('dist/tpls'))
  .pipe(connect.reload());
});

gulp.task('copy-html',function(){
  return gulp.src('html/*.html')
  .pipe(gulp.dest('dist/html'))
  .pipe(connect.reload());
});
gulp.task('scripts',['copy-req'],function(){
  return gulp.src(['js/**/*.js','js/scripts/**/*.js','!js/lib/require.js'])
  .pipe(amdOptimize('app',{
    paths: {

          'angular':'lib/angular',
          'useApp':'scripts/modules/main',
          'mainCtrl':'scripts/controllers/mainCtrl',
          'messageCtrl':'scripts/controllers/messageCtrl',
          'courseListCtrl':'scripts/controllers/courseListCtrl',
          'ui.router':'lib/angular-ui-router',
          'studentDir':'scripts/directives/studentDir',
          'loadMessage':'scripts/services/loadMessage',
          'cookieSev':'scripts/services/cookieSev',
          'timeFilter':'scripts/filters/timeFilter',
          'scrollDir':'scripts/directives/scrollDir',
          'loginCtrl':'scripts/controllers/loginCtrl',
          'inputDir':'scripts/directives/inputDir'

    },
    shim: {


          'ui.router':{
              deps:['angular']
          }

    }


  }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/js'))

  .pipe(uglify())


  .pipe(rev())
  .pipe(gulp.dest('dist/js'))
  .pipe(rev.manifest({
    path: 'rev-manifest-js.json',
    merge: true
  }))
  .pipe(gulp.dest('dist/dev'))
  .pipe(connect.reload());
});




gulp.task('clean',function(){

  del(['dist']);
});
// gulp.task('js',function(){
//   return gulp.src(["dist/scripts/*.json",'dist/scripts/*.js'])
//   .pipe(revCollector())
//   .pipe(gulp.dest('dist/scripts'));
// });
gulp.task('copy-index',function(){
  return gulp.src('index.html')
  .pipe(rev())
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
});

gulp.task('serve',function(){
  connect.server({
    root:'dist',
    livereload:true,
    host:'192.168.2.3',
    middleware:function(req, res,next){
        return [
            proxy('/teacher/api/login', {
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://192.168.2.14:2016',
                  changeOrigin:true
            }),
            proxy('/notebook/api/getQuestionDetails', {
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://192.168.2.14:2016',
                  changeOrigin:true
            }),

            proxy('/teacher/api/teacherFinishCourse', {
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://192.168.2.14:2016',
                  changeOrigin:true
            }),



            proxy('/teacher/api/logout', {
                  target: 'http://webapi.91xuexibao.com',
                  changeOrigin:true
            }),
            proxy('/teacher/api/webcast/*',{
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://webapi.91xuexibao.com.com',
                  changeOrigin: true
            }),

            // proxy('/webcast/api/*',{
            //       target: 'http://webapi.91xuexibao.com.com',
            //       // target: 'http://webapi.91xuexibao.com.com',
            //       changeOrigin: true
            // }),
            proxy('/api/recommend/getKnowledgeList',{
                  // target: 'http://webapi.91xuexibao.com.com',
                  target: 'http://webapi.91xuexibao.com',
                  changeOrigin: true
            }),
            proxy('/question/pointName',{
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://webapi.91xuexibao.com.com',
                  changeOrigin: true
            }),
            proxy('/question/search',{
                  target: 'http://webapi.91xuexibao.com',
                  // target: 'http://webapi.91xuexibao.com.com',
                  changeOrigin: true
            })

         ];
    }
  });
});

gulp.task('images',function(){
  return gulp.src('images/**/*').pipe(gulp.dest('dist/images')).pipe(connect.reload());
});

gulp.task('data',function(){
  return gulp.src(['json/*']).pipe(gulp.dest('dist/data')).pipe(connect.reload());
});


gulp.task('build',['copy-index','images','data','scripts','styles','fonts','copy-tpls','copy-html'],function(){

});

gulp.task('fonts',function(){
  return gulp.src('fonts/*')
  .pipe(gulp.dest('dist/fonts'));
})
gulp.task('watch',function(){
  gulp.watch('index.html',['copy-index']);
  gulp.watch('images/**/*.{jpg,png}',['images']);
  gulp.watch(['json/*'],["data"]);
  gulp.watch(['js/**/*.js','js/scripts/**/*.js'],["scripts"]);
  gulp.watch(['css/app.scss','css/usage/**/*.scss'],["styles"]);
  gulp.watch('tpls/**/*.html',["copy-tpls"]);
  gulp.watch('html/*.html',["copy-html"]);
});

gulp.task('default',['serve','watch'],function(){

});


gulp.task('styles',function(){
  return gulp.src(['css/app.scss','css/lib/dist/*.css'])
  .pipe(sass())

  .pipe(minifyCss())

  .pipe(rev())
  .pipe(concat('app.css'))
  .pipe(gulp.dest('dist/css'))
  .pipe(rev.manifest({
    path: 'rev-manifest-css.json',
    merge: true
  }))
  .pipe(gulp.dest('dist/dev'))
  .pipe(connect.reload());
});
