
const defaultDiameter = 42

RC.Avatar = class extends RC.CSS {
  constructor(p){
    super(p)
    this.defBgColor = "light"
    this.watchProps = ["src"]
  }
  getDiameter(np) {
    // This function is here to make extending easier. Don't remove it.
    return np.diameter || defaultDiameter
  }
  renderChildren() {
    let uiProps = _.pick(this.props, _.without(RC.uiKeys, "uiBgColor"))
    uiProps.uiColor = this.props.uiColor || this.props.color || this.color.get("textColor")
    return !this.props.src && this.props.uiClass ? <RC.uiIcon {... uiProps} theme="absCenter" key={0} /> : null // Add key here. It makes extending easier.
  }
  render() {
    return <figure {... _.omit(this.props, "src")} style={this.css.get("styles").area}>
      {this.renderChildren()}
    </figure>
  }
  baseStyles(np,ns) {
    const diameter = this.getDiameter(np)
    return {
      area: {
        width: diameter, height: diameter, borderRadius: "50%", position: "relative",
        backgroundImage: `url(${np.src})`,
        backgroundColor: this.color.get("hex"), backgroundSize: "cover", backgroundPosition: "50%"
      }
    }
  }
  themeStyles(np,ns) {
    const diameter = this.getDiameter(np)
    return {
      absLeft: {
        area: {
          position: "absolute", top: "50%", left: 10,
          margin: `${diameter/-2}px 0 0`
        }
      }
    }
  }
}

RC.Avatar.displayName = "RC.Avatar"
RC.Avatar.propTypes = Object.assign({}, RC.Avatar.propTypes, {
  diameter: React.PropTypes.number
})

RC.AvatarBadge = class extends RC.Avatar {
  constructor(p) {
    super(p)
    this.watchProps = this.watchProps.concat(["badgeBgColor","badgeColor","badgeOnLeft"])
  }
  renderChildren() {
    let children = [super.renderChildren()]

    if (this.props.badge && !isNaN(this.props.badge)) {
      let badgeStyle = this.css.get("styles").badge
      if (this.props.badge >= 100)
        Object.assign( badgeStyle, { fontSize: RC.Theme.font.size-7, padding: "5px 0" })
      children.push(<span style={badgeStyle} key={1}>{this.props.badge}</span>)
    } else
      console.warn("Badge (prop) must be a number.")

    return children
  }
  baseStyles(np,ns) {
    const BASE = super.baseStyles(np,ns)

    if (typeof this.bColor==="undefined" || np.badgeBgColor!=this.props.badgeBgColor || np.badgeColor!=this.props.badgeColor)
      this.bColor = h.getBasicColor( np.badgeBgColor, "white", np.badgeColor )

    BASE.badge = Object.assign({}, RC.cssMixins.font("regular"), {
      backgroundColor: this.bColor.hex, color: this.bColor.textColor,
      position: "absolute", top: 0,
      left: np.badgeOnLeft ? -7 : "auto",
      right: np.badgeOnLeft ? "auto" : -7,
      width: 20, height: 20, padding: 2,
      fontSize: RC.Theme.font.size-4, lineHeight: 1.4, textAlign: "center",
      borderRadius: "50%"
    })

    return BASE
  }
}

RC.AvatarBadge.displayName = "RC.AvatarBadge"
RC.AvatarBadge.propTypes = Object.assign({}, RC.AvatarBadge.propTypes, {
  badge: React.PropTypes.number,
  badgeOnLeft: React.PropTypes.bool
})

RC.AvatarOutline = class extends RC.Avatar {
  constructor(p) {
    super(p)
    this.watchProps = this.watchProps.concat("outlineColor")
  }
  getDiameter(np) {
    return super.getDiameter(np)-6
  }
  renderChildren() {
    const child = super.renderChildren()
    return [child, <span style={this.css.get("styles").outline} key={1} />]
  }
  baseStyles(np,ns) {
    let BASE = super.baseStyles(np,ns)

    if (typeof this.outlineColor==="undefined" || np.outlineColor!=this.props.outlineColor)
      this.outlineColor = h.getRealColor(np.outlineColor, this.color.get("textColor"), null, true)

    Object.assign( BASE.area, {
      margin: "3px 0 0 3px"
    })

    BASE.outline = {
      position: "absolute", top: -3, left: -3, right: -3, bottom: -3,
      border: `solid 1px ${this.outlineColor}`, borderRadius: "50%"
    }

    return BASE
  }
  themeStyles(np,ns) {
    let THEMES = super.themeStyles(np,ns)
    const diameter = this.getDiameter(np)

    Object.assign( THEMES.absLeft.area, {
      margin: `${(diameter/-2)}px 0 0 3px`
    })

    return THEMES
  }
}

RC.AvatarOutline.displayName = "RC.AvatarOutline"
RC.AvatarOutline.propTypes = Object.assign({}, RC.AvatarOutline.propTypes, {
  outlineColor: React.PropTypes.string
})
