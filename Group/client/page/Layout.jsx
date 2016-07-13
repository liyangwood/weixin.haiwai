import {KUI} from 'meteor/kg:kui';

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

		let pageWraperStyle ={
			paddingRight:0,
			marginLeft:this.state.showLeftNav?220:0
		}

		return (<div id="ui-layout">




			<div className="container" style={style.con}>


				<UI.LeftNav showLeftNav={this.state.showLeftNav} />
				<div id="page-wrapper" style={pageWraperStyle}>

					<div style={{paddingTop : 0}} className="wrapper wrapper-content animated fadeInRight">
						<div className="ibox">
							<div className="ibox-content">
								<UI.Body tmpl={this.props.body} />
							</div>
						</div>

					</div>

					<div className="footer"></div>
				</div>
			</div>





		</div>)
	}
};