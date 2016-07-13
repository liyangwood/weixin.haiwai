/* Information about this package */
Package.describe({
	// Short two-sentence summary.
	summary: "KUI Package",
	// Version number.
	version: "1.0.0",
	// Optional.  Default is package directory name.
	name: "kg:kui"
	// Optional github URL to your source repository.
	//git: "https://github.com/something/something.git",
});



/* This defines your actual package */
Package.onUse(function (api) {
	api.versionsFrom("1.3");


	var packages = [
		'kg:base'

	];
	api.use(packages, ["client","server"]);

	api.addAssets([

	], 'client');

	api.mainModule('out.jsx');
});
