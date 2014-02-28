module.exports = function(grunt) {
    'use strict';

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-htmlcompressor');
    grunt.loadNpmTasks('grunt-html-smoosher');
    grunt.loadNpmTasks('grunt-inline-css');

    // Project configuration
    grunt.initConfig({
        watch: {
            template: {
                files: '**/template.html',
                tasks: ['inlinecss', 'smoosher', 'htmlcompressor']
            },
            options: {
                spawn: false
            }
        },
        cssjoin: {
            join: {
                files: [{
                    src: 'notinlined.css',
                    dest: 'notinlined.joined.css'
                }]
            }
        },
        htmlcompressor: {
            compile: {
                files: [{
                    src: 'template.html',
                    dest: 'email.html'
                }],
                options: {
                    type: 'html',
                    compressCss: true,
                    preserveComments: true,
                    removeSurroundingSpaces: 'max'
                }
            }
        },
        smoosher: {
            main: {
                files: [{
                    src: 'template.html',
                    dest: 'email.html'
                }]
            }
        },
        inlinecss: {
            main: {
                options: {
                    addDoctype: '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
                    removeStyleTags: true,
                    applyLinkTags: false,
                    removeLinkTags: false
                },
                files: [{
                    src: 'email.html',
                    dest: 'email.html'
                }]
            }
        }
    });

    grunt.event.on('watch', function(action, filepath) {
        // Current working directory
        var cwd = filepath.replace(filepath.substr(filepath.lastIndexOf('/') + 1), '');

        // Destination is path/to/directory/email.html
        var dest = cwd + 'email.html';

        // Change file mapping to match directory of changed file
        grunt.config('watch.template.files', filepath);

        if(grunt.file.isMatch(grunt.config('watch.template.files'), filepath)) {
            grunt.config('inlinecss.main.files.0.src', [filepath]);
            grunt.config('inlinecss.main.files.0.dest', dest);
            grunt.config('smoosher.main.files.0.src', dest);
            grunt.config('smoosher.main.files.0.dest', dest);
            grunt.config('htmlcompressor.compile.files.0.src', dest);
            grunt.config('htmlcompressor.compile.files.0.dest', dest);
        }
    });

    // Default Task(s)
    grunt.registerTask('default', 'watch');
};
