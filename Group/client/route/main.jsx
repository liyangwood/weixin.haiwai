

FlowRouter.route("/test", {
	action(p){

		App.routeHandler(p, {
			pageTilte : 'test',
			bodyTmpl : <p>1234</p>
		});
	}
});

//qun
let QunRoute = FlowRouter.group({
	prefix : '/qun'
});

QunRoute.route('/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群设置',
			bodyTmpl : <UI.Qun_List />
		});
	}
});
QunRoute.route('/add', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群设置',
			bodyTmpl : <UI.Qun_Add />
		});
	}
});
QunRoute.route('/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群设置',
			bodyTmpl : <UI.Qun_Edit />
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