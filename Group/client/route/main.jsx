

FlowRouter.route("/test", {
	action(p){
console.log(1234);
		App.routeHandler(p, {
			pageTilte : 'test',
			bodyTmpl : <p>1234</p>
		});
	}
});