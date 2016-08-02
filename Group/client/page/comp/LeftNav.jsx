
let Icon = ND.Icon,
	Menu = ND.Menu,
	SubMenu = Menu.SubMenu,
	MenuItemGroup = Menu.ItemGroup;

UI.LeftNav = class extends KUI.RC.CSS{

	constructor(p){
		super(p);

		this.state = {
			current : '1'
		};
	}

	getRenderList(){
		let rs = [
			{
				id : 'qun',
				title : '微信群设置',
				children : [
					{
						id : 'list',
						title : '列表'
					},
					{
						id : 'add',
						title : '添加'
					}
				]
			},
			{
				id : 'autoreply',
				title : '问答设置',
				children : [
					{
						id : 'wendaku',
						title : '问答库'
					}
				]
			},
			{
				id : 'event',
				title : '群事件设置',
				children : [
					{
						id : 'list',
						title : '事件列表'
					},
					{
						id : 'add',
						title : '增加事件'
					}
				]
			},
			{
				id : 'publish',
				title : '发布内容',
				children : [
					{
						id : 'timer',
						title : '定时发布'
					}
				]
			},
			{
				id : 'other',
				title : '其他设置'
			}
		];

		return rs;
	}


	handleClick(e){
		let path = e.keyPath.reverse().join('/');
		this.setState({
			current : e.key
		});
		util.goPath('/'+path);
	}

	renderSubMenu(data){
		let click = (e, de)=>{};

		return (
			<SubMenu key={data.id} onTitleClick={click.bind(this)} title={<h4>{data.title}</h4>}>
				{
					_.map(data.children, (item)=>{
						return <Menu.Item key={item.id}>{item.title}</Menu.Item>
					})
				}
			</SubMenu>
		);
	}

	render(){

		let list = this.getRenderList();

		let path = FlowRouter.current().path;
		//_.each(list, function(item, i){
		//	var reg = new RegExp('^'+item.href);
		//	if(reg.test(path)){
		//		item.active = true;
		//
		//		return false;
		//	}
		//});

		let openKeys = _.map(list, (item)=>{
			return item.id;
		});


		return (
			<Menu onClick={this.handleClick.bind(this)}
			        ref="nav"
			        mode="inline"
			        defaultOpenKeys={openKeys}
			        selectedKeys={[this.state.current]}
			        style={{minHeight:500}}>
				{
					_.map(list, (item)=>{
						return this.renderSubMenu(item);
					})
				}
			</Menu>
		);


	}




};