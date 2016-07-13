"use strict";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Checkbox
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.CheckboxBase = class extends RC.FormElementPrimary {
  constructor(props) {
    super(props)
    this.state = {
      obj: Immutable.Map({
        checked: typeof this.props.checked==="undefined" ? false : this.props.checked // Must be Boolean
      })
    }
  }
  reset(){
    this.setStateObj({
      checked: this.props.checked || false
    })
  }
  turnOn(){
    this.setStateObj({
      checked: true
    })
  }
  turnOff(){
    this.setStateObj({
      checked: false
    })
  }
  getValue(){
    return this.state.obj.get("checked")
  }
  getChecked(){
    const isChecked = this.state.obj.get("checked")
    return typeof isChecked==="boolean" ? isChecked : this.props.checked
  }
  _changeHandler() {
    // do nothing
  }
  _clickHandler(e) {
    const value = !this.state.obj.get("checked")
    this.setStateObj({
      checked: value
    })
    if (_.isFunction(this.props.onClick))
      this.props.onClick(e,value)
  }
  renderInput(){
    let props = _.omit(this.props, ["checked","type"])
    props.onChange = this._changeHandler.bind(this)
    props.checked = this.getChecked()
    props.style = this.css.get("styles").form
    props.type = "checkbox"
    if (!props.value && props.label) props.value = props.label

    return <input {... props} />
  }
  renderLabel(){
    return this.props.label
  }
  render() {
    let styles = this.css.get("styles")
    /**
     * NOTE
     * <div> is used instead of <label> to overcome Web/Mobile issues
     */
    return <div style={styles.area} onClick={this._clickHandler.bind(this)}>
      {this.renderCheckbox()}
      {this.renderLabel()}
    </div>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  themeStyles(np,ns) {
    let THEMES = super.themeStyles(np,ns)
    THEMES.right = {
      area: {
        textAlign: "right",
        paddingRight: 10, paddingLeft: 38,
      },
      form: { left: 10 }
    }
    return THEMES
  }
}

RC.CheckboxBase.displayName = "RC.CheckboxBase"
RC.CheckboxBase.propTypes = Object.assign({}, RC.CheckboxBase.propTypes, {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  checked: React.PropTypes.bool,
  name: React.PropTypes.string,
  className: React.PropTypes.string,

  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Radio
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.RadioGroup = class extends RC.FormElementPrimary {

  constructor(props) {
    super(props)

    let list = _.isArray(props.list) ? props.list : []
    this.state = {
      checked: list.map( function(c){
        return (c.value || typeof c.value==="number") && c.value==props.value
      })
    }
  }

  reset(){
    let list = _.isArray(this.props.list) ? this.props.list : []
    let self = this
    let checked = list.map( function(c){
      return c.value && c.value==self.props.value ? true : false
    })
    this.setState({ checked: checked })
  }

  getChecked(n){
    if (typeof n!=="undefined")
      return this.state.checked[n]
    else
      return false
  }

  getValue(n){
    if (typeof n==="undefined") {
      let realVal = null
      let self = this
      _.every(this.state.checked, function(c,nn){
        if (c)
          realVal = self.props.list[nn].value
        return !c
      })
      return realVal
    } else
      return this.props.list[n].value
  }

  _changeHandler(n) {
    let checked = this.state.checked
    this.setState({checked: checked.map(function(c,nn){
      return nn==n
    })})
    if (_.isFunction(this.props.onChange))
      this.props.onChange(this.getValue(n))
  }

  makeRadio(radio,n){
    let styles = this.css.get("styles")
    let isChecked = this.getChecked(n)
    let uiProps = {
      style: styles.form,
      uiClass: this.props.uiClass || "check",
      uiBgColor: isChecked ? (this.props.uiBgColor || "brand1") : "transparent",
      uiColor: isChecked ? (this.props.uiColor || "white") : "transparent",
    }
    /**
     * NOTE
     * <div> is used instead of <label> to overcome Web/Mobile issues
     */
    return <div style={styles.area} key={n} onClick={this._changeHandler.bind(this,n)}>
      <input {... _.omit(radio, ["checked","label"])} style={styles.input} type="radio"
                                                      checked={isChecked} onChange={function(){ /* Leave this alone to avoid React Warning */ }}
        />
      {radio.label}
      <RC.uiIcon {... uiProps}/>
    </div>
  }
  render() {
    let self = this
    if (!this.props.name && !this.radioGroup)
      this.radioGroupName = h.uniqueKey()
    let radioGroup = this.props.name || this.radioGroupName

    return <div>
      { /* this.renderChildren() */}
      {(this.props.list || []).map(function(g,n){
        g.name = radioGroup
        return self.makeRadio(g,n)
      })}
    </div>
  }
  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {
    return {
      area: Object.assign({}, RC.cssMixins.item(), {
        paddingLeft: 48,
        textAlign: "left",
        backgroundColor: this.color.get("realHex"), color: this.color.get("realText"),
        borderWidth: "1px 0", borderColor: RC.Theme.color.edges,
      }),
      form: {
        width: 28, height: 28,
        top: 10, left: 10,
        border: `solid 1px ${RC.Theme.color.edges}`
      },
      input: {
        visibility: "hidden"
      }
    }
  }

  themeStyles(np,ns) {
    let THEMES = super.themeStyles(np, ns)
    Object.assign( THEMES, {
      right: {
        area: {
          textAlign: "right",
          paddingRight: 15, paddingLeft: 38,
        },
        form: { left: 10 }
      },
      overlay: {
        area: Object.assign({}, RC.cssMixins.font("light"), {
          borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0,
          fontSize: RC.Theme.font.size+8
        }),
        form: { top: 17 }
      }
    })
    return THEMES
  }
}
RC.RadioGroup.displayName = "RC.RadioGroup"
RC.RadioGroup.propTypes = Object.assign({}, RC.RadioGroup.propTypes, {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  name: React.PropTypes.string,
  className: React.PropTypes.string,

  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Form Range Sliders
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.Range = class extends RC.FormElementPrimary {

  constructor(props) {
    super(props)

    this.watchProps = ["max","min"]
    this.watchStates = ["value"]

    this.state = {
      obj: Immutable.Map({
        value: false
      })
    }
  }

  // @@@@
  // Utility
  // @@@@
  reset(){
    this.setStateObj({ value: this.props.value || false })
  }

  getValue(np,ns){
    if (typeof np==="undefined") np = this.props || {}
    if (typeof ns==="undefined") ns = this.state || {}

    const nsValue = ns.obj && ns.obj.get("value");

    return (nsValue!==false ? nsValue : np.value) || null
  }

  getPerCent(np,ns){
    if (typeof np==="undefined") np = this.props
    if (typeof ns==="undefined") ns = this.state

    this.min = _.isNumber(np.min) ? np.min : 0
    this.max = _.isNumber(np.max) ? np.max : 100

    const value = (this.getValue(np,ns) || 0) - this.min
    return value / (this.max-this.min) * 100
  }

  onChange(e) {
    this.setStateObj({value: e.target.value})
    if (_.isFunction(this.props.onChange))
      this.props.onChange(e)
  }

  renderRangeInput() {
    const styles = this.css.get("styles")
    return <input
      style={styles.rangeHidden}
      type="range" onChange={this.onChange.bind(this)}
      value={this.getValue()}
      min={this.min}
      max={this.max}
      disabled={this.props.disabled}
      />
  }

  renderMinMark() {
    const styles = this.css.get("styles")
    return this.uiProps[0] ? <RC.uiIcon {... this.uiProps[0]} itemStyle={styles.uiIcon1} /> : null
  }

  renderMaxMark() {
    const styles = this.css.get("styles")
    return this.uiProps[1] ? <RC.uiIcon {... this.uiProps[1]} itemStyle={styles.uiIcon2} /> : null
  }

  renderRangeBar() {
    const styles = this.css.get("styles")
    return <div style={styles.range}><div style={styles.progress}><span style={styles.ball} /></div></div>
  }

  // @@@@
  // Render
  // @@@@
  render() {
    const styles = this.css.get("styles")

    return <div {... _.omit(this.props,["onChange","value","type","min","max"])} style={styles.area}>
      {this.renderMinMark()}
      {this.renderRangeInput()}
      {this.renderRangeBar()}
      {this.renderMaxMark()}
    </div>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@

  baseStyles(np,ns) {

    if (typeof this.uiProps==="undefined" || np.uiProps!=this.props.uiProps)
      this.uiProps = h.splitProps(np, RC.uiKeys, "uiClass", 2)

    return {
      area: Object.assign({}, RC.cssMixins.item(), {
        display: "flex", alignItems: "center",
        padding: "20px"+(this.uiProps[1] ? " 28px " : " 10px " )+"20px"+(this.uiProps[0] ? " 28px" : " 10px"),
        background: this.color.get("realHex")
      }),
      range: {
        display: "inline-block", position: "relative",
        background: RC.Theme.color.edgesLighter,
        width: "100%", height: 2,
        margin: "5px 10px", padding: "0 2px 0",
      },
      progress: {
        position: "absolute", top: 0, bottom: 0, left: 0, right: Math.max( Math.min(100-this.getPerCent(np,ns), 100), 0)+"%",
        background: this.color.get("textColor")
      },
      rangeHidden: Object.assign({}, RC.cssMixins.absFull, {
        opacity: 0, zIndex: 2, width: "100%"
      }),
      ball: {
        background: RC.Theme.color.white, borderRadius: "50%",
        position: "absolute", right: 0, top: "50%",
        width: 20, height: 20, margin: "-10px -10px 0 0",
        boxShadow: "0 0 3px rgba(0,0,0,.3)"
      },
      uiIcon1: {
        top: 20, left: 4,
      },
      uiIcon2: {
        top: 20, left: "auto", right: 4,
      }
    }
  }
}

RC.Range.displayName = "RC.FormRange"

RC.Range.propTypes = Object.assign({}, RC.Range.propTypes, {
  name: React.PropTypes.string,
  className: React.PropTypes.string,

  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,

  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
})


//this component uses jQuery ui, need improvement
RC.DoubleRange = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.state = {
      min: this.props.initialMin || 15,
      max: this.props.initialMax || 80
    }
  }

  componentDidMount() {
    let self = this
    $("head").append("<link rel='stylesheet' id='extracss' href='http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css' type='text/css' />")
    $.getScript("http://code.jquery.com/ui/1.11.4/jquery-ui.js", function() {
       $("#slider-range").slider({
        range: true,
        min: self.props.min || 0,
        max: self.props.max || 99,
        values: [ self.state.min, self.state.max ],
        slide: function( event, ui ) {
          self.setState({'min': ui.values[0]})
          self.setState({'max': ui.values[1]})
          self.props.onChange(event, ui.values[0], ui.values[1])
        }
      });
    })
  }

  render() {
    let label = this.props.label ? (this.props.label + ':') : ''
    return (
      <div>
        <RC.Item>{label + ' ' + this.state.min + '-' + this.state.max}</RC.Item>
        <div id="slider-range"></div>
      </div>
    )
  }
}

RC.DoubleRange.displayName = "RC.DoubleRange"
