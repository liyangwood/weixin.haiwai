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

	api.use("modules");

	var packages = [
		'summernote:summernote',
		'react-meteor-data',

		'kg:base'

	];
	api.use(packages, ["client","server"]);

	api.addFiles([
		'node_modules/antd/dist/antd.min.css'
	], 'client');
	api.addAssets([
		'node_modules/antd/dist/antd.min.js.map'
	], 'client');

	api.mainModule('out.jsx', 'client');
});
