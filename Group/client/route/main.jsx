

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
			bodyTmpl : <UI.Wenda_Index />
		});
	}
});
AutoReplyRoute.route('/wendaku/add', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '问答库',
			bodyTmpl : <UI.Wenda_Add />
		});
	}
});
AutoReplyRoute.route('/wendaku/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '问答库',
			bodyTmpl : <UI.Wenda_Edit />
		});
	}
});

//publish
let PublishRoute = FlowRouter.group({
	prefix: '/publish'
});
PublishRoute.route('/timer', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '定时发布',
			bodyTmpl : <UI.Publish_Timer_List />
		});
	}
});
PublishRoute.route('/timer/add', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '定时发布',
			bodyTmpl : <UI.Publish_Timer_Add />
		});
	}
});
PublishRoute.route('/timer/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '定时发布',
			bodyTmpl : <UI.Publish_Timer_Edit />
		});
	}
});