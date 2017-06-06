/*
 * myTest
 * https://github.com/yjx3097890/jsTest
 *
 * Copyright (c) 2014 yanjixian
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    yan: 'yanjixian',

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    myTest: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    log: {
        foo: [ 1, 2,3],
        bar: 'yanjixian',
        fal: false
    }

  });

// Actually load this plugin's task(s).
grunt.loadTasks('tasks');

// These plugins provide necessary tasks.
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-nodeunit');

// Whenever the "test" task is run, first clean the "tmp" dir, then run this
// plugin's task(s), then test the result.
grunt.registerTask('test', ['clean', 'myTest', 'nodeunit']);

// By default, lint and run all tests.
grunt.registerTask('default', ['jshint', 'test']);


  grunt.registerMultiTask('log', 'log something', function () {
      grunt.log.writeln(this.target + ' : ' + this.data);
  });

  grunt.registerTask('yjx', 'yanjixian\'s test', function (arg1, arg2) {

     //  if (true) { return false; }  //失败

    // grunt.task.requires('log');  //需要先运行log


      grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
      grunt.log.writeln(grunt.config('log.foo'));
     //  grunt.task.run(['log:foo', 'log:bar']);   //运行任务
  });

  grunt.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
    //将任务转变为异步模式并交给done函数处理
    var done = this.async();
    //同步任务
    grunt.log.writeln('Processing task...');
    //异步任务
    setTimeout(function() {
        grunt.log.writeln('All done!');
        done();   //done(false); 失败
    }, 1000);
});




};
