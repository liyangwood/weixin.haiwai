
Package.describe({
	// Short two-sentence summary.
	summary: "Rebot Module",
	// Version number.
	version: "1.0.0",
	// Optional.  Default is package directory name.
	name: "kg:rebot"

});



/* This defines your actual package */
Package.onUse(function (api) {
	api.versionsFrom("1.3");

	//api.use("modules");

	var packages = [
		'http',

		'kg:base',
		'kg:group'
	];
	api.use(packages, ["client","server"]);



	api.mainModule('out.jsx');
});
