module.exports = function( grunt ) {

	grunt.initConfig({

		// Compile CSS
		sass: {
			dist: {
				files: {
					'css/styles.css': 'scss/main.scss'
				}
			}
		},

		// Check JS syntax
		jscs: {
			src: [
				'Gruntfile.js',
				'js/*.js'
			],
			options: {
				config: '.jscsrc',
				verbose: true
			}
		},

		// Watch task (run with "grunt watch")
		watch: {
			css: {
				files: ['scss/*.scss'],
				tasks: ['sass']
			},
			scripts: {
				files: ['js/*.js', 'Gruntfile.js'],
				tasks: ['jscs']
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jscs' );

	grunt.registerTask( 'default', ['sass:dist'] );
	grunt.registerTask( 'dev', ['sass', 'jscs', 'watch'] );

};
