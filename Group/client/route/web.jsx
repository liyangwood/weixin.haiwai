
let WebRoute = FlowRouter.group({
	prefix : '/web'
});

WebRoute.route('/zhibo/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '直播间',
			layout : UI.Web_ZhiBo_Layout,
			bodyTmpl : <UI.Web_ZhiBo_Room />
		});
	}
});