
UI.YesButton = class extends KUI.RC.CSS{

	constructor(p){
		super(p);

		this.state = {
			loading : false
		};
	}

	initStyle(){
		return this.props.style || {};
	}

	click(e){
		e.preventDefault();

		if(this.props.href){
			FlowRouter.go(this.props.href);
			return false;
		}

		this.props.onClick.apply(this, arguments);
	}

	render(){
		let style = this.initStyle();

		let loading = this.state.loading;

		return (
			<button disabled={loading} onClick={this.click} type="button" style={style} className="btn btn-w-m btn-primary">
				{loading?this.renderLoadingState():null}
				{this.props.label}
			</button>
		);
	}

	loading(f){
		f = f || false;
		this.setState({
			loading : f
		});
	}

	renderLoadingState(){



		let sy = {
			display:'inline-block',
			width : '14px',
			height : '14px',
			position : 'relative',
			//marginRight : '5px',
			top : '2px',
			left : '-8px'
		};
		let sy1 = {
			background : '#eee'
		};
		return (
			<div style={sy} className="sk-spinner sk-spinner-cube-grid">
				{
					_.map(_.range(9), (i)=>{
						return <div key={i} style={sy1} className="sk-cube"></div>;
					})
				}

			</div>
		);
	}

};

UI.NoButton = class extends UI.YesButton{

	render(){
		let style = this.initStyle();
		return (
			<button onClick={this.click} type="button" style={style} className="btn btn-outline btn-primary">{this.props.label}</button>
		);
	}

};