UI.Comp_Select = class extends KUI.RC.CSS{
	constructor(p){
		super(p);

		this.value = null;
	}

	change(v){
		this.value = v;
	}

	render(){
		let option = this.props.option;
		delete this.props.option;


console.log(option)
		return (
			<ND.Select onChange={this.change.bind(this)} {... this.props}>
				{
					_.map(option, (item, index)=>{
						return <ND.Select.Option key={index} value={item.value}>{item.key}</ND.Select.Option>
					})
				}
			</ND.Select>
		);
	}

	componentDidMount(){
		this.value = this.props.defaultValue;
	}

	getValue(){
		return this.value;
	}
};