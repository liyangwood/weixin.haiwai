"use strict";

RC.Loading = class extends RC.CSS {
  constructor(props) {
    super(props)
    this.doNotAutoprefix = true

    this.state = {
      obj: Immutable.Map({
        isReady: props.isReady
      })
    }
  }
  // @@@@
  // @@@@
  // Prep
  // @@@@
  // @@@@
  componentWillReceiveProps(np,ns) {
    if ((!np.loadOnce && this.state.obj.get("isReady")!==np.isReady) || (np.loadOnce && np.isReady && !this.state.obj.get("isReady")))
      this.setStateObj({isReady: np.isReady})
  }
  // @@@@
  // @@@@
  // Render
  // @@@@
  // @@@@
  doLoading() {
    const styles = this.css.get("styles")
    // return <div style={styles.loading} ref={this.props.ref}> // Not sure if this is needed, but I removed the ref, I'm not sure why it was there.
    return <div>
      <span style={styles.progress} />
      {this.props.loadingText ? <span style={styles.loadingText}>{this.props.loadingText}</span> : null}
    </div>
  }
  render() {
    const styles = this.css.get("styles")
    const props = _.omit(this.props,["isReady","children", "style"])
    const isReady = this.state.obj.get("isReady") || (_.isUndefined(this.props.isReady) && this.props.children)
    /**
     * Important Note
     * There's a strange React bug that alters the inline style and autoprefixer's behaviour.
     * this.props.children MUST be wrapped in a <div />
     * If it's not, certain autoprefixer behavious will not work and lead to bugs.
     */
    return <div {... props} style={isReady ? styles.area : styles.loading}>
      {
      isReady
      // ? (React.isValidElement(this.props.children) ? this.props.children : <div>{this.props.children}</div>)
      ? this.renderChildren()
      : this.doLoading()
      }
    </div>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {
    const loadColor = np.color ? this.color.get("textColor") : (this.color.get("isDark") ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)")
    return {
      area: {},
      loading: {
        width: "100%", minHeight: 100, position: "relative", zIndex: 10,
      },
      progress: Object.assign({}, RC.cssMixins.absCenter(50), {
        width: 50, margin: "-25px 0 0 -25px", left: "50%",
        borderRadius: "50%",
        border: `solid 2px ${loadColor}`,
        borderLeftColor: np.disableKnockout ? this.color.get("hex") : "transparent",
        WebkitAnimation: "spin-inifinite-animate .58s linear infinite"
      }),
      loadingText: {
        position: "absolute", width: 150, margin: "35px 0 0 -75px", top: "50%", left: "50%",
        textAlign: "center", fontSize: RC.Theme.font.size-2,
        opacity: .55,
      }
    }
  }

  themeStyles(np,ns) {
    return {
      inline: {
        progress: {
          position: "static", left: "auto", right: "auto", top: "auto", bottom: "auto",
          display: "block", margin: "0 auto"
        }
      },
      tiny: {
        area: {
          minHeight: 24
        },
        loading: {
          minHeight: 24
        },
        progress: Object.assign({}, RC.cssMixins.absCenter(24,true), {
          border: `solid 1px ${this.color.get("textColor")}`
        })
      },
      absFull: {
        loading: RC.cssMixins.absFull
      },
      noWheel: {
        progress: { display: "none" },
        loadingText: { margin: "-10px 0 0 -75px" }
      }
    }
  }
}
RC.Loading.displayName = "RC.Loading";
RC.Loading.propTypes = {
  disableKnockout: React.PropTypes.bool
}

RC.URL = class extends RC.CSS {
  constructor(props) {
    super(props);
    this.watchProps = ["colorHover"]

    this.state = {
      obj: Immutable.Map({
        isHover: false
      })
    }
  }
  _hoverStart(func) {
    this.setStateObj({ "isHover": true });
    if (_.isFunction(this.props.onMouseEnter))
      this.props.onMouseEnter()
  }
  _hoverEnd(func) {
    this.setStateObj({ "isHover": false });
    if (_.isFunction(this.props.onMouseLeave))
      this.props.onMouseLeave()
  }
  render() {
    const children = this.renderChildren()
    const props = Object.assign({}, this.props, {
      style: h.assignPseudos( this.css.get("styles").area, null, null, this.state.obj.get("isHover") ? ":hover" : null),
      onMouseEnter: this._hoverStart.bind(this),
      onMouseLeave: this._hoverEnd.bind(this)
    })
    let uiIcon = null
    let uiProps = _.pick(this.props, RC.uiKeys)
    let tagName = this.props.tagName

    if (uiProps.uiClass) {
      if (!uiProps.uiColor)
        uiProps.uiColor = uiProps.uiBgColor ? this.uiColor.textColor : this.color.get("textColor")
      if (this.props.uiItemStyle)
        uiProps.itemStyle = this.props.uiItemStyle
      if (this.props.uiStyle)
        uiProps.style = this.props.uiStyle
      uiIcon = <RC.uiIcon {... uiProps} theme={this.props.uiTheme || "inlineBlockLeft"} />
    }

    if (props.href)
      return <a {... props}>{uiIcon}{children}</a>
    else if (tagName)
      return React.createElement(tagName, props, [uiIcon, children])
    else
      return <span {... props}>{uiIcon}{children}</span>
  }
  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {
    const isURL = np.href || np.onClick
    const textColor = np.color || np.bgColor ? this.color.get("textColor") : "inherit"

    if (np.noHover)
      this.colorHover = undefined
    else if (isURL && (typeof this.colorHover === "undefined" || np.colorHover!=this.props.colorHover))
      this.colorHover = np.colorHover
        ? h.getRealColor(np.colorHover, "linkHover", null, true)
        : RC.Theme.color.linkHover

    if (np.uiClass && (typeof this.uiColor==="undefined" || np.uiBgColor!=this.props.uiBgColor)) {
      const uiBg = h.getBasicColor(np.uiBgColor, np.uiColor, null)
      this.uiColor = uiBg
    }

    let areaStyle = {
      backgroundColor: this.color.get("realHex"), color: textColor,
      textDecoration: "none"
    }

    if (isURL) {
      Object.assign( areaStyle, {
        cursor: "pointer",
        transition: "all ease .15s"
      })
      if (this.colorHover)
        Object.assign( areaStyle, {
          ":hover": { color: this.colorHover }
        })
    }

    return {
      area: areaStyle
    }
  }
}

RC.URL.displayName = "RC.URL"
RC.URL.propTypes = Object.assign({}, RC.URL.propTypes, {
  href: React.PropTypes.string,
  tagName: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ]),
  onClick: React.PropTypes.func
})

RC.URLBadge = class extends RC.URL {
  renderChildren() {
    if (isNaN(this.props.badge)) return this.props.children
    return [<span style={this.css.get("styles").badge} key={0}>{this.props.badge}</span>,this.props.children]
  }
  baseStyles(np,ns) {
    let BASE = super.baseStyles(np,ns)
    if (!this.uiColor) this.uiColor = {}
    BASE.badge = {
      position: "absolute", top: -3, right: -3,
      borderRadius: "50%",
      width: 20, height: 20,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: this.uiColor.hex, color: this.uiColor.textColor,
      fontSize: RC.Theme.font.size-5,
    }
    return BASE
  }
}

RC.URLBadge.propTypes = Object.assign({}, RC.URLBadge.propTypes, {
  badge: React.PropTypes.number
})
