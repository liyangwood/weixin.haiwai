let h = KUI.h;
UI.Body = class extends KUI.RC.CSS{

    render(){
        return <div className="transition" id="app-body">
            <div className="wrapper-wide">
                {h.returnComponent(this.props.tmpl)}
            </div>
        </div>
    }
};