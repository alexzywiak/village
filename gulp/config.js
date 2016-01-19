
var path = {
	client: 'client/app',
	server: 'server',
	templates: this.client + '/templates/**/*.*',
	js: ['server/**/*.js', 'test/**/*.js', 'client/**/*.js'],
	dist: 'dist'
};

module.exports = {
	base: path.dist,
	clean: ['dist/'],
	component: {
		src: 'client/app/components',
		templates: 'client/app/templates/component/*.**'
	},
	copy: {
		toCopy: ['client/index.html','client/app/**/*.html', '!client/app/templates/**/*.*'],
		base: 'client',
		dest: path.dist
	},
	js: path.js,
	jshint: {
		src: path.js.concat(['!server/config/schema.js', '!client/app/templates/**/*.*'])
	},
	mocha: {
		src: ['test/**/*.js']
	},
	todo: {
		src: path.js
	},
	webpack: {
		entry: 'client/app/app.js',
		dest: path.dist
	}
};