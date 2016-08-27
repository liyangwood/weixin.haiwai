UI.Comp_UploadFileInput = class extends KUI.Page{
	constructor(p){
		super(p);

		let value = null;
		if('value' in p){
			value = p.value;
		}
		else if('defaultValue' in p){
			value = p.defaultValue;
		}

		this.state = {
			loading : false,
			value : value
		};

	}

	getMeteorData(){
		return {
			ready : true
		};
	}

	render(){
		let sy = {
			img : {
				width : '36px',
				height : '36px',
				marginLeft : '20px'
			}
		};

		return (
			<div>
				<input type="file" onChange={this.fileChange.bind(this)} ref="file" className="hw-file" />
				<ND.Button icon="upload" loading={this.state.loading} onClick={this.clickFile.bind(this)} type="ghost">
					点击上传
				</ND.Button>

				{this.state.value && <img style={sy.img} src={this.state.value} />}
			</div>
		);
	}

	clickFile(){
		util.getReactJQueryObject(this.refs.file).trigger('click');
	}
	fileChange(e){
		let self = this;
		this.setState({loading : true});

		let file = e.target.files[0];
		var fr = new FileReader();
		fr.onload = function(e){
			var binary = e.target.result;

			util.ajax.uploadImage({
				image : binary
			}, function(flag, rs){
				if(flag){

					let url = 'http://www.haiwai.com'+rs.files[0];
					console.log(url);
					self.setState({
						loading : false,
						value : url
					});

					self.props.onChange && self.props.onChange(url);
				}
			});
		};

		fr.readAsDataURL(file);


	}

	getValue(){
		return this.state.value;
	}
	setValue(url){
		this.setState({value : url});
	}
};