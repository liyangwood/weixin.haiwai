
"use strict";

const PAD = 6

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Input
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.Input = class extends RC.FormElementSecondaryEnter {
  render() {
    const styles = this.css.get("styles")
    return <label style={styles.area} htmlFor={this.props.name}>
      {this.props.disableFocus ? <span style={styles.disableFocus} /> : null}
      {this.props.label ? <span style={styles.label}>{this.props.label.replace(/ /g, String.fromCharCode(160))}</span> : null}
      <input
        {... _.omit(this.props, ["onChange","onFocus","onBlur"])}
        style={styles.form}
        type={this.props.type || "text"}
        value={this.getValue()}
        onFocus={this._focusHandler.bind(this)} onBlur={this._blurHandler.bind(this)}
        onChange={this._changeHandler.bind(this)}
        />
    </label>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@

  baseStyles(np,ns) {

    let BASE = super.baseStyles(np, ns);
    const fontSize = RC.Theme.font.size;

    Object.assign( BASE.label, {
      textAlign: "left",
      lineHeight: `${fontSize+2}px`,
      paddingTop: PAD, paddingRight: PAD*2, paddingBottom: PAD, paddingLeft: 0,
    })

    BASE.form = Object.assign({},RC.cssMixins.clean(), {
      flex: 1,
      width: "100%",
      paddingTop: PAD, paddingRight: 0, paddingBottom: PAD, paddingLeft: 0,
      fontSize: fontSize, lineHeight: `${fontSize+2}px`,
      color: ns.isError ? RC.Theme.color.red : this.color.get("textColor"),
      backgroundColor: this.color.get("realHex"),
    })

    BASE.disableFocus = RC.cssMixins.absFull

    return BASE
  }


  themeStyles(np, ns) {
    let THEMES = super.themeStyles(np,ns)
    let cPAD = RC.Theme.size.paddingPx - PAD // This must be here to allow dynamic changes
    const fontSize = RC.Theme.font.size

    THEMES.big = {
      form: Object.assign({}, RC.cssMixins.font("light"), {
        textAlign: "center",
        fontSize: fontSize+(RC.MQ.device>=4 ? 20 : 6), lineHeight: `${fontSize+(RC.MQ.device>=4 ? 22 : 8)}px`
      })
    }

    return THEMES
  }
};

RC.Input.displayName = "RC.Input";
RC.Input.propTypes = Object.assign({}, RC.FormElementSecondaryEnter.propTypes, {
  type: React.PropTypes.string,

  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  placeholder: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  className: React.PropTypes.string,

  errorColor: React.PropTypes.string,
  labelColor: React.PropTypes.string,
  labelColorFocus: React.PropTypes.string,

  disabled: React.PropTypes.bool,
})


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Textarea
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.Textarea = class extends RC.FormElementSecondaryEnter {

  render() {
    const styles = this.css.get("styles");

    return <label style={styles.area} htmlFor={this.props.name}>
      {this.props.label ? <span style={styles.label}>{this.props.label}</span> : null}
    <textarea
      {... _.omit(this.props, ["children","type","labelColor","labelColorFocus"])}
      style={styles.form}
      value={this.getValue()}
      onFocus={this._focusHandler.bind(this)} onBlur={this._blurHandler.bind(this)}
      onChange={this._changeHandler.bind(this)} />
    </label>
  }
  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@

  baseStyles(np,ns) {
    let base = super.baseStyles(np, ns);
    const fontSize = RC.Theme.font.size;

    Object.assign(base.label, {
      paddingTop: PAD, paddingRight: PAD, paddingBottom: 0, paddingLeft: 0
    })

    base.form = Object.assign({}, RC.cssMixins.clean(), {
      flex: 1, minHeight: 52,
      backgroundColor: this.color.get("hex"),
      borderTop: `solid ${PAD}px ${this.color.get("hex")}`,
      borderBottom: `solid ${PAD}px ${this.color.get("hex")}`,
      color: ns.obj.get("isError") ? RC.Theme.color.red : this.color.get("textColor")
    })

    return base
  }
};

RC.Textarea.displayName = "RC.Textarea";
RC.Textarea.propTypes = Object.assign({}, RC.FormElementSecondaryEnter.propTypes, {

  value: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  className: React.PropTypes.string,

  errorColor: React.PropTypes.string,
  labelColor: React.PropTypes.string,
  labelColorFocus: React.PropTypes.string,

  disabled: React.PropTypes.bool,
});


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Select
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.Select = class extends RC.FormElementSecondaryEnter {

  constructor(props) {
    super(props);

    let val = props.value
    if (!val && _.isArray(props.options)) {
      if (typeof props.options[0]==="object")
        val = props.options[0].value
      else if (typeof props.options[0]==="string"/* || typeof props.options[0]*/)
        val = props.options[0]
    }
    const isError = _.isFunction(props.validations) && val
      ? props.validations(val)
      : false

    this.state = {
      obj: Immutable.Map({
        value: false,
        isFocused: false,
        isError: isError
      })
    };
  }

  render() {

    const styles = this.css.get("styles")
    const themes = Array.isArray(this.css.get("themes")) ? this.css.get("themes") : [this.css.get("themes")]

    return <label style={styles.area} htmlFor={this.props.name}>
      {this.props.label ? <span style={styles.label}>{this.props.label}</span> : null}

      <span style={styles.arrow}/>
      <select
        dir={_.contains(themes,"right") ? "rtl" : "auto"}
        {... _.omit(this.props, ["value","type","labelColor"])}
        style={styles.form}
        onChange={this._changeHandler.bind(this)}
        onFocus={this._focusHandler.bind(this)} onBlur={this._blurHandler.bind(this)}
        value={this.getValue()}
        >
        {
          this.props.options.map(function(o,n){
            if (_.isString(o)) o = { value: o }
            return <option value={o.value} key={n}>{o.label || o.text || o.value}</option>
          })
        }
      </select>
    </label>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@

  baseStyles(np, ns) {
    let base = super.baseStyles(np, ns);

    Object.assign(base.area, {
      position: "relative"
    });

    Object.assign(base.label, {
      textAlign: "left",
      paddingTop: PAD, paddingRight: PAD, paddingBottom: 0, paddingLeft: PAD,
    });

    base.form = Object.assign({}, RC.cssMixins.clean(), {
      flex: 1,
      width: "100%",
      paddingTop: PAD, paddingRight: 0, paddingBottom: PAD, paddingLeft: 0,
      backgroundColor: this.color.get("realHex"), borderRight: `solid 30px ${this.color.get("realHex")}`,
      color: ns.isError ? RC.Theme.color.red : this.color.get("textColor")
    });

    base.arrow = {
      position: "absolute", bottom: 15, right: 10, zIndex: 10,
      width: 0, height: 0,
      borderTop: `5px solid ${this.color.get("textColor")}`, borderRight: "5px solid transparent", borderLeft: "5px solid transparent",
    }

    return base
  }
}

RC.Select.displayName = "RC.Select";

RC.Select.propTypes = Object.assign({}, RC.FormElementSecondaryEnter.propTypes, {

  options: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.object,
  ])),
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),

  errorColor: React.PropTypes.string,
  labelColor: React.PropTypes.string,
  labelColorFocus: React.PropTypes.string,

  disabled: React.PropTypes.bool,
});
