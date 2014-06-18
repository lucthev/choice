/* jshint node:true */
'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine: {
      test: {
        src: 'dist/<%= pkg.name %>.min.js',
        options: {
          specs: 'test/spec.js',
          display: 'short',
          summary: true,
          keepRunner: true
        }
      }
    },
  })

  grunt.loadNpmTasks('grunt-contrib-jasmine')

  grunt.registerTask('default', ['jasmine'])
}
