
var path = {
	client: 'client/app',
	server: 'app',
	js: ['app/**/*.js', 'test/**/*.js', this.client + '**/*.js']
};

module.exports = {
	jshint: {
		src: path.js.concat(['!app/config/schema.js', '!client/app/templates/**/*.*'])
	},
	mocha: {
		src: ['test/**/*.js']
	},
	component: {
		src: path.client + '/components',
		templates: path.client + '/templates/component/*.**'
	},
	todo: {
		src: path.js
	},
	webpack: {
		entry: path.client + '/app.js',
		dest: 'dist'
	}
};