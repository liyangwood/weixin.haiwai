
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


App.checkLogin = function(callback){





};

let cacheUrl = '';
FlowRouter.triggers.enter([function(param){
	//App.checkLogin(function(flag){
	//	if(!flag){
	//		if(param.path !== '/home/login')
	//			Session.set(KG.const.CACHELOGINPATH, param.path);
	//
	//		FlowRouter.go('/home/login');
	//	}
	//	else{
	//		_.delay(function(){
	//			$(window).scrollTop(0);
	//		}, 16);
	//
	//	}
	//
	//});
}]);
FlowRouter.triggers.exit([function(){

}]);


