
var path = {
	client: 'client/app',
	server: 'app',
	templates: this.client + '/templates/**/*.*',
	js: ['app/**/*.js', 'test/**/*.js', this.client + '**/*.js'],
	dist: 'dist'
};

module.exports = {
	clean: ['dist/'],
	component: {
		src: path.client + '/components',
		templates: path.client + '/templates/component/*.**'
	},
	copy: {
		toCopy: ['client/index.html', path.client + '/**/*.html', '!client/app/templates/**/*.*'],
		base: 'client',
		dest: path.dist
	},
	jshint: {
		src: path.js.concat(['!app/config/schema.js', '!client/app/templates/**/*.*'])
	},
	mocha: {
		src: ['test/**/*.js']
	},
	todo: {
		src: path.js
	},
	webpack: {
		entry: path.client + '/app.js',
		dest: path.dist
	}
};