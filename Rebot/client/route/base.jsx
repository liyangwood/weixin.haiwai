
App.routeHandler = function (p, args) {
	let defs = {
		// Meta
		metaTitle: Meteor.settings.public.appName,
		metaDesc: Meteor.settings.public.appDesc,

		// Route
		layout: UI.Layout,
		pageTitle: "Unknown",
		bodyTmpl: null
	};
	if (_.isObject(args)) _.defaults(args, defs); else args = defs;

	document.title = args.pageTitle;
	document.description = args.metaDesc;
console.log(args);
	KUI.ReactMounter(args.layout, {
		title: args.pageTitle,

		body: args.bodyTmpl
	})
};


FlowRouter.route("/test", {
	action(p){

		App.routeHandler(p, {
			pageTilte : 'test',
			bodyTmpl : <UI.Home_Login />
		});
	}
});


