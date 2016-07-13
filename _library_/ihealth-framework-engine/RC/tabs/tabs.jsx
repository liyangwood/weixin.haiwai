"use strict";

RC.Tabs = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.watchProps = ["children","clickedBgColor","clickedColor"]
    this.clickedBorderColor = null
    this.defaultBorderColor = null

    this.state = {
      hold: null,
      active: !isNaN(this.props.forceClicked) ? this.props.forceClicked : (_.isNumber(this.props.initialTab) ? this.props.initialTab : -1)
    }
  }
  // @@@@
  // @@@@
  // Prep
  // @@@@
  // @@@@
  componentWillMount(){
    super.componentWillMount()
    this.children = h.uniformChildren(this.props.children, "RC.URL")
  }
  componentWillUpdate(np,ns){
    super.componentWillUpdate(np,ns)
    this.children = h.uniformChildren(np.children, "RC.URL")
  }
  componentWillReceiveProps(np){
    if (typeof np.forceClicked!=="undefined" && np.forceClicked!=this.props.forceClicked)
      this.setState({ active: np.forceClicked })
  }
  startHold(num, func){
    this.setState({ hold: num })
    // Putting handlers here makes it a lot more intuitive
    if (_.isFunction(func))
      func()
  }
  stopHold(func){
    this.setState({ hold: null })
    // Putting handlers here makes it a lot more intuitive
    if (_.isFunction(func))
      func()
  }
  setActive(num, func){
    this.setState({ active: num })
    // Putting handlers here makes it a lot more intuitive
    if (_.isFunction(func))
      func()
    if (_.isFunction(this.props.onChange))
      this.props.onChange(num)
  }
  getTabButtonState(c, n) {
    const selected = !isNaN(this.state.active) ? this.state.active : this.props.forceClicked
    let buttonState = []

    if (this.state.hold==n) buttonState.push(":held")
    else if (this.state.hover==n) buttonState.push(":hover")

    if (selected==n) buttonState.push(":clicked")
    else if (selected>=0 && selected==(n-1)) buttonState.push(":afterClicked")

    if (selected>=n) buttonState.push(":active")

    // [(this.state.hold==n || selected==n) ?
    //       ":clicked" : (this.state.hold==(n-1) || (this.state.active>=0 && this.state.active==(n-1)) || this.props.forceClicked==(n-1)) ?
    //       ":afterClicked" : (this.state.hover==n) ?
    //       ":hover" : null]

    return buttonState
  }

  getTabProps(c, n) {
    let self = this
    let styles = this.css.get("styles")
    let allowHold = _.isUndefined(this.props.forceClicked) && (_.isUndefined(this.props.activateOnHold) || this.props.activateOnHold)
    let allowClick = _.isUndefined(this.props.forceClicked) && (_.isUndefined(this.props.activateOnClick) || this.props.activateOnClick)
    let buttonState = this.getTabButtonState(c, n)
    let propsHandle = class {
      constructor(props) {
        this.props = props
      }
      handleNoHover() {
        if (self.props.bgColor && !_.contains(["white","light"],self.props.bgColor))
          this.props.noHover = typeof c.noHover==="undefined" ? true : c.noHover
        return new propsHandle(this.props)
      }
      handleHold() {
        let props = this.props;
        if (allowHold) {
          props.onMouseDown = self.startHold.bind(self,n,c.props.onMouseDown)
          props.onTouchStart = self.startHold.bind(self,n,c.props.onTouchStart)
          props.onMouseUp = self.stopHold.bind(self,n,c.props.onMouseUp)
          props.onMouseLeave = self.stopHold.bind(self,n,c.props.onMouseLeave)
          props.onTouchEnd = self.stopHold.bind(self,n,c.props.onTouchEnd)
        }
        return new propsHandle(props)
      }
      handleClick() {
        if (allowClick)
          this.props.onClick = self.setActive.bind(self,n,c.props.onClick)
        return new propsHandle(this.props)
      }
      hanleClicked() {
        if ( buttonState.indexOf(":clicked")>=0 && c.props.uiClassCur && c.props.uiClass)
          this.props.uiClass = c.props.uiClassCur
        return new propsHandle(this.props)
      }
    }

    let props = {
      key: n,
      color: c.props.color || this.color.get("textColor"),
      colorHover: c.props.colorHover || c.props.color || this.color.get("textColor"),
      uiSize: styles.item.fontSize,
      style: h.assignPseudos(styles.item, n, self.children.length, buttonState)
    }
    props = (new propsHandle(props)).handleNoHover().handleHold().handleClick().hanleClicked().props;
    return props;
  }

  getTabUrlChildren(c, n) {
    var urlChildren
    if (_.isArray(c.props.children)) {
      urlChildren = c.props.children
      urlChildren.unshift(ui)
    } else
      urlChildren = [<span key={"c"+n}>{c.props.children}</span>]
    return urlChildren;
  }

  renderSingleTab(c, n) {
    let props = this.getTabProps(c, n)
    let urlChildren = this.getTabUrlChildren(c, n)
    return React.cloneElement(c, props, urlChildren)
  }

  renderChildren() {
    let self = this
    let styles = this.css.get("styles")

    return (
      <nav style={styles.areaInner}>
      {
      this.children.map(function(c, n) {
        return self.renderSingleTab(c, n)
      })
      }
      </nav>
    )
  }

  render() {
    return <div {... this.props} style={this.css.get("styles").area}>
      {this.renderChildren()}
    </div>
  }

  // @@@@
  // @@@@
  // Styles Start
  // @@@@
  // @@@@

  noBorders(np,ns) {
    return _.contains(
        (this.css && this.css.get("themeNames"))
        || (_.isArray(np.theme) ? np.theme : [np.theme])
    , "no-borders")
  }

  defBgColor(np,ns) {
    return this.noBorders(np,ns) ? "white" : "light"
  }

  baseStyles(np,ns) {
    this.clickedColor = this.color.get("textColor")
    let differentColor = this.color.get("hex")!=(this.css && this.css.get("hex"))

    if (!this.clickedBorderColor || differentColor)
      this.clickedBorderColor = tinycolor(this.color.get("hex")).darken(this.color.get("isDark") ? 18 : 35).toHexString()

    if (!this.defaultBorderColor || differentColor)
      this.defaultBorderColor = this.color.get("isDark") ? RC.Theme.color.edgesDarker : RC.Theme.color.edges

    if (np.clickedBgColor && np.clickedBgColor!=this.props.clickedBgColor)
      this.clickedBgColor = h.getRealColor(np.clickedBgColor, null, null, true)

    let clickedBgColor = this.clickedBgColor || tinycolor(this.color.get("hex")).darken(10).toHexString()

    if (np.clickedColor && np.clickedColor!=this.props.clickedColor)
      this.clickedColor = h.getRealColor(np.clickedColor, null, null, true)

    return {
      // Canvas Outer
      area: {
        position: "relative", zIndex: 1, overflow: "hidden",
        display: "flex", width: "100%",
        paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
        backgroundColor: this.color.get("hex"),
        WebkitUserSelect: "none",
      },
      // Canvas Inner
      areaInner: {
        display: "flex", flex: 1, width: "100%",
        backgroundColor: this.color.get("hex"),
      },
      // Links
      item: Object.assign({}, RC.cssMixins.button, {
        display: "block", width: "auto", float: "left", flex: 1,
        fontSize: RC.Theme.font.size-2, lineHeight: "32px", textAlign: "center",
        minWidth: "initial", minHeight: 31,
        borderWidth: "1px 0 1px 1px", borderRadius: 0, borderColor: this.defaultBorderColor,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        ":clicked": {
          boxShadow: "inset 0 1px 4px rgba(0,0,0,.1)",
          borderColor: this.clickedBorderColor,
          backgroundColor: clickedBgColor,
          color: this.clickedColor
        },
        ":firstChild": {
          borderRadius: "2px 0 0 2px",
        },
        ":lastChild": {
          borderRadius: "0 2px 2px 0", borderWidth: "1px",
        },
        ":afterClicked": {
          borderColor: this.defaultBorderColor+" "+this.defaultBorderColor+" "+this.defaultBorderColor+" "+this.clickedBorderColor
        }
      })
    }
  }

  getNoLines() {
    let noLines = {
      borderWidth: 0, padding: "2px 0",
      ":clicked": { boxShadow: "none", backgroundColor: this.color.get("hex") },
      ":firstChild": { borderRadius: 0 },
      ":lastChild": { borderRadius: 0, borderWidth: 0, },
    }
    return noLines
  }

  themeStyles(np,ns) {
    let noLines = this.getNoLines()
    let clickedBgColor = this.clickedBgColor || tinycolor(this.color.get("hex")).darken(10).toHexString()

    return {
      // Small
      small: {
        area: {
          backgroundColor: "none",
          paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
        },
        item: {
          minHeight: 24, lineHeight: "25px",
        }
      },
      // Big
      big: {
        area: {
          paddingTop: "10px", paddingBottom: "10px", paddingLeft: "10px", paddingRight: "10px",
          backgroundColor: "transparent"
        },
        areaInner: {},
        item: {
          fontSize: RC.cssMixins.button.fontSize, lineHeight: RC.cssMixins.button.lineHeight,
          minHeight: RC.cssMixins.button.minHeight
        },
      },
      // Reverse
      reverse: {
        item: {
          borderColor: clickedBgColor,
          ":clicked": {
            borderColor: "transparent", backgroundColor: clickedBgColor, color: this.clickedColor
          },
          ":afterClicked": {
            borderColor: clickedBgColor
          },

        }
      },
      // No Lines
      "no-borders": {
        area: {
          paddingTop: 2, paddingBottom: 2, paddingLeft: 0, paddingRight: 0,
        },
        areaInner: {},
        item: noLines,
      }
    }
  }
}

RC.Tabs.displayName = "RC.Tabs"

RC.Tabs.propTypes = {
  initialTab: React.PropTypes.number,
  forceClicked: React.PropTypes.number,
  activateOnHold: React.PropTypes.bool,
  activateOnClick: React.PropTypes.bool,

  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  id: React.PropTypes.string,
  style: React.PropTypes.object,
}
