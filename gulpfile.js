/*
TODO:
1. Fix bug because of angular-material.min.js
2. Add watch to files
*/

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	uglifycss = require('gulp-uglifycss'),
	plumber = require('gulp-plumber');


function errorLog(error)
{
	console.error.bind(console);
	this.emit('end');
}

gulp.task('client-scripts',function(){

	gulp.src(['client/scripts/yetience-client.js',
			  'client/scripts/configuration/*.js'])
		.pipe(plumber())
		//.pipe(uglify())
		.on('error', errorLog)
		.pipe(concat('client.min.js'))
		.on('error', errorLog)
		.pipe(gulp.dest('client/dist'));
});

gulp.task('client-styles',function(){
	//nothing here for now
});

gulp.task('admin-interface-scripts',function(){

	gulp.src(['admin-interface/vendor/scripts/angular.min.js',
		'admin-interface/vendor/scripts/angular-animate.min',
		'admin-interface/vendor/scripts/angular-aria.min',
		'admin-interface/vendor/scripts/angular-ui-router.min',
		'admin-interface/vendor/scripts/api-check.min',
		'admin-interface/vendor/scripts/formly.min',
		'admin-interface/vendor/scripts/angular-formly-templates-bootstrap.min',
		'admin-interface/vendor/scripts/angular-messages.min',
		'admin-interface/vendor/scripts/json-formatter.min',
		'admin-interface/src/scripts/app.js',
		'admin-interface/src/scripts/constants/*.js',
		'admin-interface/src/scripts/controllers/*.js',
		'admin-interface/src/scripts/directives/*.js',
		'admin-interface/src/scripts/services/*.js'])
		.pipe(plumber())
		/*.pipe(uglify().on('error', function(e){
			console.log(e);
		}))*/
		.on('error', errorLog)
		.pipe(concat('admin.min.js').on('error', function(e){
			console.log(e);
		}))
		.on('error', errorLog)
		.pipe(gulp.dest('admin-interface/dist'));


});

gulp.task('admin-interface-styles',function(){

	gulp.src(['admin-interface/src/styles/*.css',
			  'admin-interface/vendor/styles/json-formatter.min.css',
			  'admin-interface/vendor/styles/bootstrap.min.css'])
		.pipe(plumber())
		//.pipe(uglifycss())
		.on('error', errorLog)
		.pipe(concat('admin.min.css'))
		.on('error', errorLog)
		.pipe(gulp.dest('admin-interface/dist'));

});



gulp.task('watch', function(){


	gulp.watch('client/scripts/yetience-client.js',['client-scripts']);
	gulp.watch('client/scripts/configuration/*.js',['client-scripts']);

	gulp.watch('admin-interface/src/scripts/*.js',['admin-interface-scripts']);
	gulp.watch('admin-interface/vendor/scripts/*.js',['admin-interface-scripts']);

	gulp.watch('admin-interface/src/styles/*.css',['admin-interface-styles']);
	gulp.watch('admin-interface/vendor/styles/json-formatter.min.css',['admin-interface-styles']);
	gulp.watch('admin-interface/vendor/styles/bootstrap.min.css',['admin-interface-styles']);

});




//default gulp which runs all the tasks after
//running the default tasks
gulp.task('default', ['client-scripts',
					  'admin-interface-scripts',
					  'admin-interface-styles',
					  'watch']);