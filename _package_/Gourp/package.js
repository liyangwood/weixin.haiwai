
Package.describe({
	// Short two-sentence summary.
	summary: "Group Module",
	// Version number.
	version: "1.0.0",
	// Optional.  Default is package directory name.
	name: "kg:group"

});



/* This defines your actual package */
Package.onUse(function (api) {
	api.versionsFrom("1.3");

	//api.use("modules");

	var packages = [

		'kg:base'
	];
	api.use(packages, ["client","server"]);


	api.mainModule('out.jsx');
});
