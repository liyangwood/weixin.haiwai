import {KUI} from 'meteor/kg:kui';

let sy = {
	main : {
		maxWidth : util.style.MAIN_WIDTH
	},
	body : {
		padding : '0 25px'
	}
};
UI.Layout = class extends KUI.RC.CSS{

	constructor(p){
		super(p);

		this.state = {
			errorMessage : false,
			alertMessage : false,

			showLeftNav : true
		};

		this._tm = null;
		this._tm1 = null;


		let self = this;
		//util.message.register('KG:show-error-message', function(param){
		//
		//	self.setState({
		//		errorMessage : param.error
		//	});
		//});
		//
		//util.message.register('KG:show-toast-message', function(param){
		//	try{
		//		self.hideErrorMsg();
		//	}catch(e){}
		//	self.setState({
		//		alertMessage : param.toast
		//	});
		//});
	}

	baseStyles(){
		return {
			left : {

			},
			right : {

			},
			con : {
				position : 'relative'
			}
		};
	}

	hideErrorMsg(){
		this.setState({
			errorMessage : false
		});
	}

	hideToastMsg(){
		this.setState({
			alertMessage : false
		});
	}

	renderErrorMsg(){
		if(this._tm1){
			window.clearTimeout(this._tm1);
			this._tm1 = null;
		}
		//let error = Session.get('KG:show-error-message');
		let error = this.state.errorMessage;
		if(!error){
			return '';
		}

		const trans = {
			transitionName: "zoom",
			transitionAppear: true,
			transitionAppearTimeout: 300,
			transitionEnterTimeout: 300,
			transitionLeaveTimeout: 300
		};

		this._tm1 = window.setTimeout(this.hideErrorMsg.bind(this), 3000);

		return (
			<div {... trans}>
				<div className="kg-toast-msg alert alert-danger alert-dismissable">
					<button aria-hidden="true" data-dismiss="alert" onClick={this.hideErrorMsg.bind(this)} className="close" type="button">×</button>
					{error}
				</div>
			</div>

		);
	}

	renderToastMsg(){
		if(this._tm){
			window.clearTimeout(this._tm);
			this._tm = null;
		}

		let msg = this.state.alertMessage;
		if(!msg){
			return '';
		}

		const trans = {
			transitionName: "zoom",
			transitionAppear: true,
			transitionAppearTimeout: 300,
			transitionEnterTimeout: 300,
			transitionLeaveTimeout: 300
		};

		this._tm = window.setTimeout(this.hideToastMsg.bind(this), 2000);

		return (
			<div {... trans}>
				<div className="kg-toast-msg alert alert-success alert-dismissable">
					<button aria-hidden="true" data-dismiss="alert" onClick={this.hideToastMsg.bind(this)} className="close" type="button">×</button>
					{msg}
				</div>
			</div>

		);
	}

	toggleLeftNav(){
		this.setState({
			showLeftNav:!this.state.showLeftNav
		})
	}


	render(){
		let style = this.baseStyles();


		return (
			<div id="ui-layout">
				{/* header */}
				<UI.Header />
				<div className="main-wrapper" style={sy.main}>
					<ND.Row>

						<ND.Col span={20} style={sy.body}>
							{/* body */}
							<UI.Body tmpl={this.props.body} />
						</ND.Col>
					</ND.Row>
				</div>
				<div className="footer"></div>



			</div>
		);
	}
};