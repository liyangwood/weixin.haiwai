UI.Comp_Select = class extends KUI.RC.CSS{
	constructor(p){
		super(p);

		this.state = {value : null};
	}

	change(v){
		this.setValue(v);
	}

	render(){
		let option = this.props.option;
		delete this.props.option;


		return (
			<ND.Select value={this.state.value} onChange={this.change.bind(this)} {... this.props}>
				{
					_.map(option, (item, index)=>{
						return <ND.Select.Option key={index} value={item.value}>{item.key}</ND.Select.Option>
					})
				}
			</ND.Select>
		);
	}

	componentDidMount(){
		this.setValue(this.props.defaultValue);
	}

	componentDidUpdate(){

	}

	getValue(){
		return this.state.value;
	}
	setValue(v){
		this.setState({value : v});
	}
};