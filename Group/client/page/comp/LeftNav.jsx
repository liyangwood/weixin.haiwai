
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

	initStyle(){

		return {
			bg : {
				background : '#2f4050'
			}
		};

	}
	handleClick(e){
		console.log('click ', e);
		this.setState({
			current : e.key
		});
	}
	render(){
		let style = this.initStyle();

		let list = [
			{
				name : '自动回复设置',
				href : '/autoreply'
			}
		];

		let path = FlowRouter.current().path;
		_.each(list, function(item, i){
			var reg = new RegExp('^'+item.href);
			if(reg.test(path)){
				item.active = true;

				return false;
			}
		});

		let navStyle={
			display:this.props.showLeftNav?'block':'none'
		};

		//return (
		//	<nav className="navbar-default navbar-static-side" role="navigation" style={navStyle}>
		//		<div className="sidebar-collapse">
		//			<ul className="nav metismenu" id="side-menu" style={style.bg}>
		//
		//
		//				{
		//					_.map(list, function(item, index){
		//						return (
		//							<li key={index} className={item.active?'active':''}>
		//								<a href={item.href}>
		//									<i className="fa fa-th-large"></i>
		//									<span className="nav-label">{item.name}</span>
		//								</a>
		//							</li>
		//						);
		//					})
		//				}
		//
		//			</ul>
		//
		//		</div>
		//	</nav>
		//
		//);

		return (
			<Menu onClick={this.handleClick.bind(this)}
			        ref="nav"
			        mode="inline"
			        defaultOpenKeys={['sub1']}
			        selectedKeys={[this.state.current]}
			        style={{width:200}}>
				<SubMenu key="sub1" title={<span><Icon type="mail" /><span>导航一</span></span>}>
					<MenuItemGroup title="分组1">
						<Menu.Item key="1">选项1</Menu.Item>
						<Menu.Item key="2">选项2</Menu.Item>
					</MenuItemGroup>
					<MenuItemGroup title="分组2">
						<Menu.Item key="3">选项3</Menu.Item>
						<Menu.Item key="4">选项4</Menu.Item>
					</MenuItemGroup>
				</SubMenu>

				<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>导航二</span></span>}>
					<Menu.Item key="5">选项5</Menu.Item>
					<Menu.Item key="6">选项6</Menu.Item>
					<SubMenu key="sub3" title="三级导航">
						<Menu.Item key="7">选项7</Menu.Item>
						<Menu.Item key="8">选项8</Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu key="sub4" title={<span><Icon type="setting" /><span>导航三</span></span>}>
					<Menu.Item key="9">选项9</Menu.Item>
					<Menu.Item key="10">选项10</Menu.Item>
					<Menu.Item key="11">选项11</Menu.Item>
					<Menu.Item key="12">选项12</Menu.Item>
				</SubMenu>
			</Menu>
		);


	}




};