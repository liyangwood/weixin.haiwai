

FlowRouter.route("/test", {
	action(p){

		App.routeHandler(p, {
			pageTilte : 'test',
			bodyTmpl : <p>1234</p>
		});
	}
});

// autoreply
let AutoReplyRoute = FlowRouter.group({
	prefix: '/autoreply',
	triggersEnter: [function (context) {

	}],
	triggersExit: [function () {

	}]
});

AutoReplyRoute.route('/wendaku', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '问答库',
			bodyTmpl : <UI.Autoreply_Wendaku_index />
		});
	}
});