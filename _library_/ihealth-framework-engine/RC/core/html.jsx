"use strict"

RC.Body = class extends RC.CSS {
  componentWillMount() {
    super.componentWillMount()
    if (!RC.cssMixins.hasOwnProperty("stylesheet")) return null

    const pureProps = ["line-height","font-weight"]
    const stylesheet = autoprefix(RC.cssMixins.stylesheet())
    const keys = Object.keys(stylesheet)

    const cssProperty = function(property){
      property = property.split(/(?=[A-Z])/).map(function(p){
        p = p.replace("Webkit","-webkit").replace("Moz","-moz")
        if (p=="ms") p = "-ms"
        if (p=="o") p = "-o"
        return p.toLowerCase()
      })
      return property.join("-")
    }

    const stylesComputed = keys.map(function(k){
      let css = stylesheet[k]
      let cssInner = Object.keys(css).map(function(ck){
        let cssProp = cssProperty(ck)
        let cssVal = _.isNumber(css[ck]) && !_.contains(pureProps, cssProp) ? css[ck]+"px" : css[ck]
        return [cssProp+":", cssVal+";"].join("")
      }).join("")

      return [k,`{${cssInner}}`].join("")
    }).join("")

    this.stylesheet = <style dangerouslySetInnerHTML={{__html: stylesComputed}} />
    this.mediaQuery()
  }

  mediaQuery() {
    const width = window.innerWidth
    const height = window.innerHeight
    let device = 0

    _.every( _.values(RC.Theme.resolution), function(r,n){
      const test = window.matchMedia(`(min-width: ${r})`).matches
      if (test) device = n
      return test
    })

    RC.MQ = {
      width: width,
      height: height,
      device: device,
    }
  }

  render() {
    let styles = this.css.get("styles")
    return <div {... this.props} style={styles.area}>
      {this.stylesheet}
      {this.props.children}
    </div>
  }

  baseStyles(){
    return {
      area: Object.assign({}, RC.cssMixins.main(), {
        backgroundColor: this.color.get("realHex"), color: this.color.get("textColor")
      })
    }
  }
}
RC.Body.displayName = "RC.Body"




RC.Div = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.watchProps = ["autoFix","relative","center","maxWidth"]
  }
  render() {
    // TODO
    // Deprecate this part
    if (this.props.createGlobalNavSpace)
      styles.area.paddingBottom = 50

    return <div {... this.props} style={this.css.get("styles").area}>
      {this.renderChildren()}
    </div>
  }
  baseStyles(np,ns) {
    let autoFix = typeof np.autoFix==="undefined" || np.autoFix
    let areaStyle = {
      backgroundColor: this.color.get("realHex"), color: this.color.get("realText"),
      overflowY: this.color.get("realHex")!="transparent" && autoFix ? "auto" : "visible"
    }
    if (np.maxWidth)
      Object.assign( areaStyle, {
        maxWidth: np.maxWidth, margin: "0 auto",
        transition: "max-width ease .4s"
      })
    if (np.relative) areaStyle.position = "relative"
    if (np.center) areaStyle.textAlign = "center"

    return {
      area: areaStyle
    }
  }

  themeStyles() {
    return Object.assign({}, RC.ThemeHelpers.core(), {
      // Center Background
      background: {
        area: {
          backgroundSize: "cover", backgroundPosition: "50%",
        }
      },
      // Abs Full
      absFull: { area: RC.cssMixins.absFull },
      // Full
      full: { area: RC.cssMixins.fullHeight() },
    })
  }
}
RC.Div.displayName = "RC.Div"



RC.Content = class extends RC.Div {
  renderTitle() {
    if (!this.props.title) return null
    return <div style={this.css.get("styles").title}>{this.props.title}</div>
  }
  render() {
    const cssState = this.props.title ? ":hasTitle" : null
    if (!this.props.title)
      return <div {... this.props} style={this.css.get("styles").area}>
        {this.renderChildren()}
      </div>
    return <div {... _.omit(this.props,["title","style"])}>
      {this.renderTitle()}
      <div style={this.css.get("styles").area}>
        {this.renderChildren()}
      </div>
    </div>

  }
  baseStyles(np,ns) {
    let PAD = 0
    let BASE = super.baseStyles(np,ns)

    if (np.theme.indexOf("padding")>=0 || np.theme.indexOf("padding-lr")>=0 || np.theme.indexOf("padding-l")>=0)
      PAD = RC.Theme.size.padding
    else if (np.theme.indexOf("paddingPx")>=0)
      PAD = RC.Theme.size.paddingPx+"px"

    if (typeof this.titleColor==="undefined" || np.titleBgColor!=this.props.titleBgColor || np.titleColor!=this.props.titleColor)
      this.titleColor = h.getBasicColor(np.titleBgColor,this.color.get("hex"), np.titleColor)

    BASE.title = Object.assign({}, RC.cssMixins.subtitle( this.titleColor.hex, this.titleColor.textColor ), {
      paddingLeft: PAD, paddingRight: PAD,
      top: 0, left: 0, right: 0,
    })

    return BASE
  }
  themeStyles(np,ns) {
    const fontSize = RC.Theme.font.size-4
    let THEMES = super.themeStyles(np,ns)
    let tabTitle = {
      display: "inline-block",
      textIndent: 3,
      width: "auto", height: "auto", padding: "5px 2px", margin: 0,
      backgroundColor: this.color.get("hex"),
      borderStyle: "solid", borderWidth: 1, borderColor: this.titleColor,
    }

    THEMES.tab = { title: tabTitle }
    return THEMES
  }
}

RC.Content.displayName = "RC.Content"
RC.Content.propTypes = Object.assign({}, RC.Content.propTypes, {
  title: React.PropTypes.string,
  titleColor: React.PropTypes.string,
  titleBgColor: React.PropTypes.string
})
