

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
QunRoute.route('/article/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '导出列表',
			bodyTmpl : <UI.Qun_ExportList />
		});
	}
});
QunRoute.route('/tmp/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群设置',
			bodyTmpl : <UI.Qun_Tmp_List />
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
QunRoute.route('/message/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群消息',
			bodyTmpl : <UI.Qun_MessageList />
		});
	}
});
QunRoute.route('/message/selectandexport', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群消息',
			bodyTmpl : <UI.Qun_SelectAndExport />
		});
	}
});
QunRoute.route('/message/export/edit', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群消息',
			bodyTmpl : <UI.Qun_EditExport />
		});
	}
});
QunRoute.route('/article/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群消息',
			bodyTmpl : <UI.Qun_EditExport />
		});
	}
});

// zhibo
let ZhiBoRoute = FlowRouter.group({
	prefix: '/zhibo'
});
ZhiBoRoute.route('/add', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群直播',
			bodyTmpl : <UI.ZhiBoGroup_Add />
		});
	}
});
ZhiBoRoute.route('/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群直播',
			bodyTmpl : <UI.ZhiBoGroup_Edit />
		});
	}
});
ZhiBoRoute.route('/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群直播',
			bodyTmpl : <UI.ZhiBoGroup_List />
		});
	}
});

ZhiBoRoute.route('/room/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群直播',
			bodyTmpl : <UI.ZhiBo_Room />
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
PublishRoute.route('/common', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '立即发布',
			bodyTmpl : <UI.Publish_Common_Add />
		});
	}
});

//event
let EventRoute = FlowRouter.group({
	prefix: '/event'
});
EventRoute.route('/add', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群事件',
			bodyTmpl : <UI.Event_Add />
		});
	}
});
EventRoute.route('/list', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群事件',
			bodyTmpl : <UI.Event_List />
		});
	}
});
EventRoute.route('/edit/:id', {
	action(p){
		App.routeHandler(p, {
			pageTitle : '群事件',
			bodyTmpl : <UI.Event_Edit />
		});
	}
});