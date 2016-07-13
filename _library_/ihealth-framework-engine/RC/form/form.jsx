
"use strict";

RC.Form = class extends RC.CSS {

  componentWillMount() {
    super.componentWillMount()
    this.unique = h.uniqueKey()
  }

  getFormData() {
    let formEl = ReactDOM.findDOMNode(this.refs.rcForm)
    return h.serializeForm(formEl)
  }

  resetForm(e) {
    if (e) e.preventDefault()

    this.unique = h.uniqueKey()
    this.forceUpdate()

    if (_.isFunction(this.props.onReset))
      this.props.onReset(e)
  }

  renderChildren() {
    const children = _.isArray(this.props.children) ? this.props.children : [this.props.children]
    const unique = this.unique
    return children.map(function(c,n){
      // if (_.contains(allowedForm, h.nk(c, "type.displayName"))) {
      if (React.isValidElement(c))
        return React.cloneElement(c, {key: unique+n}, c.props.children)
      else
        return c
        // Use the below if cloneElement stops supporting key changes
        // let props = Object.assign({}, c.props, { key: unique+n })
        // return React.createElement(c.type, props, c.props.children)
      // }
      // return c
    })
  }

  render() {
    return <form {... this.props} onReset={this.resetForm.bind(this)} style={this.css.get("styles").area} ref="rcForm">
      { this.renderChildren() }
    </form>
  }

  baseStyles() {
    return {
      area: Object.assign({}, RC.cssMixins.ellipsis, {
        backgroundColor: this.color.get("realHex"), color: this.color.get("textColor"),
      })
    }
  }

  themeStyles() {
    return RC.ThemeHelpers.core()
  }

};

RC.Form.displayName = "RC.Form";
RC.Form.propTypes = {
  onReset: React.PropTypes.func
};
