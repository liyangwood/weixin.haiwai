"use strict";

RC.Item = class extends RC.CSS {
  constructor(p) {
    super(p)

    // For performance reasons, state is only used if hoverBgColor is passed
    if (this.props.hoverBgColor)
      this.state = {
        obj: Immutable.Map({
          isHover: false
        })
      }
  }
  _hoverStart(e) {
    this.setStateObj({
      isHover: true
    })
    if (_.isFunction(this.props.onMouseEnter))
      this.props.onMouseEnter(e)
  }
  _hoverEnd(e) {
    this.setStateObj({
      isHover: false
    })
    if (_.isFunction(this.props.onMouseLeave))
      this.props.onMouseLeave(e)
  }
  renderExtra() {
    let self = this
    let styles = this.css.get("styles")

    if (this.props.title || this.props.subtitle)
      return <div>
        {this.props.title ? <h3 style={styles.title}>{this.props.title}</h3> : null}
        {this.props.subtitle ? <p style={styles.subtitle}>{this.props.subtitle}</p> : null}
      </div>
  }
  renderChildren() {
    let styles = this.css.get("styles").areaInner
    if (!this.props.children) return null

    if (h.checkIfString(this.props.children))
      return <p style={styles}>{this.props.children}</p>

    return h.renderWithFunction(this.props.children, (child,n) => {
      if (_.isString(child)) return <p styles={styles} key={n}>{child}</p>
      return child
    })
  }
  render() {
    const hoverState = this.props.hoverBgColor && this.state && this.state.obj.get("isHover") ? ":hover" : null
    let props = _.omit(this.props, ["href"])

    if (this.props.hoverBgColor) {
      props.onMouseEnter = this._hoverStart.bind(this)
      props.onMouseLeave = this._hoverEnd.bind(this)
    }

    let item = <div {... props} style={h.assignPseudos( this.css.get("styles").area, null, null, hoverState )}>
      {this.renderExtra()}
      {this.renderChildren()}
    </div>

    return this.props.href
      ? <a href={this.props.href} style={{display:"block"}}>{item}</a>
      : item
  }
  // @@@@
  // @@@@
  // Styles Start
  // @@@@
  // @@@@
  baseStyles(np,ns) {
    if (np.hoverBgColor && (typeof this.hoverBgColor==="undefined" || np.hoverBgColor!=this.props.hoverBgColor))
      this.hoverBgColor = h.getRealColor(np.hoverBgColor, this.color.get("hex"), null, true)

    let PAD = RC.Theme.size.paddingPx
    return {
      // Canvas Outer
      area: Object.assign({}, RC.cssMixins.item(), {
        margin: 0,
        backgroundColor: this.color.get("realHex"),
        color: this.color.get("textColor"),
        borderColor: RC.Theme.color.edges,
        ":hover": {
          backgroundColor: this.hoverBgColor || this.color.get("realHex")
        }
      }),
      areaInner: Object.assign({}, RC.cssMixins.ellipsis, {
        fontSize: RC.Theme.font.size+1,
      }),
      title: Object.assign({}, RC.cssMixins.font("bold"), RC.cssMixins.ellipsis, {
        fontSize: RC.Theme.font.size+1, color: this.color.get("textColor"),
        padding: "0 "+PAD+"px 0 0", margin: 0
      }),
      subtitle: Object.assign({}, RC.cssMixins.ellipsis, {
        fontSize: RC.Theme.font.size-1, opacity: .5,
        padding: "0 "+PAD+"px 0 0", margin: 0,
      }),
    }
  }

  themeStyles(np,ns) {
    let PAD = RC.Theme.size.paddingPx

    return {
      // Short Theme
      short: {
        area: { paddingTop: PAD-10, paddingBottom: PAD-9, paddingLeft: PAD-3, paddingRight: PAD-3, },
        areaInner: { fontSize: RC.Theme.font.size-1 },
        title: { fontSize: RC.Theme.font.size-1 }
      },
      // No Borders Theme
      "no-borders": {
        area: {
          borderWidth: 0, margin: 0,
        }
      }
    }
  }
}

RC.Item.displayName = "RC.Item"
RC.Item.propTypes = {
  uiClass: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  uiColor: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  uiBgColor: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  uiSize: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.array,
  ]),

  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,
  borderColor: React.PropTypes.string,

  avatar: React.PropTypes.string,
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  note: React.PropTypes.string,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  id: React.PropTypes.string,
  style: React.PropTypes.object,
}
