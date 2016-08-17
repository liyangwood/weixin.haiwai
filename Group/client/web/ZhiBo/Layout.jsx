import {KUI} from 'meteor/kg:kui';

UI.Web_ZhiBo_Layout = class extends KUI.RC.CSS{
	render(){

		let sy = {
			main : {
				maxWidth : util.style.MAIN_WIDTH
			},
			body : {
				padding : '0 25px'
			}
		};


		return (
			<div id="ui-layout">
				<UI.Header />
				<div className="main-wrapper" style={sy.main}>
					<ND.Row>

						<ND.Col span={24} style={sy.body}>
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