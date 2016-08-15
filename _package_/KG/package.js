Package.describe({
	name: 'kg:base',
	version: '1.0.0',
	summary: 'kg'
});

Package.onUse(function(api) {
	api.versionsFrom("1.3");

	var packages = [
		'ecmascript',


		"aldeed:simple-schema",
		"aldeed:collection2",

		'meteorhacks:aggregate@=1.3.0',
		"kadira:flow-router",
		'meteorhacks:picker'
	];
	api.use(packages, ["client","server"]);
	api.imply(packages, ["client","server"]);




	api.mainModule('out.jsx');

});