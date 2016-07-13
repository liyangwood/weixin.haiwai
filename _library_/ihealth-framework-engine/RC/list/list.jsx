"use strict";

RC.List = class extends RC.CSS {

  constructor(p) {
    super(p)
    this.themeStyles = {
      inset: {
        area: {
          marginTop: 13, marginBottom: 0, marginLeft: 13, marginRight: 13,
          boxShadow: "0 0 3px rgba(0,0,0,.15)",
        }
      }
    }
  }
  
  render() {
    let self = this
    return <ul {... this.props} style={this.css.get('styles').area}>
      {this.props.children}
    </ul>
  }

  baseStyles() {
    return {
      area: {
        position: "relative", overflow: "hidden",
        backgroundColor: this.color.get("hex"), textColor: this.color.get("textColor"),
        paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
        marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      },
    }
  }
}


RC.List.displayName = "RC.List"

RC.List.propTypes = {
  list: React.PropTypes.array,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  id: React.PropTypes.string,
  className: React.PropTypes.string,
  style: React.PropTypes.object,
}
