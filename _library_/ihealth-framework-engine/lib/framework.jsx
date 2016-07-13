
"use strict";

// TODO
// Add a if web/mobile option

RC = {
  uiKeys: ["uiClass","uiSize","uiBgColor","uiColor"],
  Animate: React.addons.CSSTransitionGroup,
  Mixins: {
    PureRender: React.addons.PureRenderMixin,
    LinkedState: React.addons.LinkedStateMixin,
    CSS: {
      /**
       * ####
       * This Mixin requires the following properties to be available:
       * this.color
       * this.css
       * ####
       * This Mixin relies on the following properties:
       * @ this.baseStyles
       * @ this.themeStyles
       * @ this.defBgColor
       * @ this.watchProps
       * @ this.watchStates
       * @ this.useUIKeys
       */
      componentWillMount(){
        this.css = this.style()
      },
      componentWillUpdate(np,ns){
        if (this.css.shouldCSSUpdate(np,ns))
          this.style(np,ns)
      },
      style(props,states) {
        if (typeof props==="undefined") props = this.props
        if (typeof states==="undefined") states = this.state

        let defBgColor = _.isFunction(this.defBgColor) ? this.defBgColor(props,states) : (this.defBgColor || "white")
        let colorKeys = this.useUIKeys ? ["uiBgColor","uiColor"] : ["bgColor","color"]

        this.color =
          (this.css && this.css.getBasicColor( props[colorKeys[0]], defBgColor, props[colorKeys[1]]))
          || h.getBasicColor( props[colorKeys[0]], defBgColor, props[colorKeys[1]])

        let args = {
          styles: _.isFunction(this.baseStyles) ? this.baseStyles(props,states) : (typeof this.baseStyles==="object" ? this.baseStyles : {}),
          themeStyles: _.isFunction(this.themeStyles) ? this.themeStyles(props,states) : (typeof this.themeStyles==="object" ? this.themeStyles : {}),
          css: this.color,
          doNotAutoprefix: this.doNotAutoprefix
        }

        if (!this.css) {
          if (this.watchProps) args.watchProps = this.watchProps
          if (this.watchStates) args.watchStates = this.watchStates
          return new oldCSSBuilder(props,args)
        } else
          this.css.update(props,args)
      },
    }
  },
  extendTheme( themeObj, mixinObj ) {

    let themeFunc = function(obj, extendObj){
      if (typeof extendObj === "object") {
        let keys = Object.keys(obj)

        _.intersection(keys,Object.keys(extendObj)).map(function(k){
          if ((_.isObject(extendObj[k]) && _.isObject(obj[k])) || (_.isFunction(extendObj[k]) && _.isFunction(obj[k])))
            Object.assign(obj[k], extendObj[k])
          else
            console.warn("extendTheme() failed for property "+k+" because the variable type did not match.")
        })

        let omittedObj = _.omit( extendObj, keys)
        Object.assign( obj, omittedObj )
      }
    }

    if (themeObj) themeFunc(RC.Theme, themeObj)
    if (mixinObj) themeFunc(RC.cssMixins, mixinObj)
  },
  ThemeHelpers: {
    core(target) {
      if (!target) target = "area"
      let core = {}

      // Size Control
      core.smaller={}; core.smaller[target] = { fontSize: RC.Theme.font.size-2 }

      // Padding
      core.paddingPx={}; core.paddingPx[target] = { paddingTop: RC.Theme.size.paddingPx, paddingRight: RC.Theme.size.paddingPx, paddingBottom: RC.Theme.size.paddingPx, paddingLeft: RC.Theme.size.paddingPx }
      core["paddingPx-t"]={}; core["paddingPx-t"][target] = { paddingTop: RC.Theme.size.paddingPx }
      core["paddingPx-b"]={}; core["paddingPx-b"][target] = { paddingBottom: RC.Theme.size.paddingPx }
      core["paddingPx-tb"]={}; core["paddingPx-tb"][target] = { paddingTop: RC.Theme.size.paddingPx, paddingBottom: RC.Theme.size.paddingPx }
      core["paddingPx-l"]={}; core["paddingPx-l"][target] = { paddingLeft: RC.Theme.size.paddingPx }
      core["paddingPx-r"]={}; core["paddingPx-r"][target] = { paddingRight: RC.Theme.size.paddingPx }
      core["paddingPx-lr"]={}; core["paddingPx-lr"][target] = { paddingLeft: RC.Theme.size.paddingPx, paddingRight: RC.Theme.size.paddingPx }

      core.padding={}; core.padding[target] = { paddingTop: RC.Theme.size.padding, paddingRight: RC.Theme.size.padding, paddingBottom: RC.Theme.size.padding, paddingLeft: RC.Theme.size.padding, }
      core["padding-t"]={}; core["padding-t"][target] = { paddingTop: RC.Theme.size.padding }
      core["padding-b"]={}; core["padding-b"][target] = { paddingBottom: RC.Theme.size.padding }
      core["padding-tb"]={}; core["padding-tb"][target] = { paddingTop: RC.Theme.size.padding, paddingBottom: RC.Theme.size.padding }
      core["padding-l"]={}; core["padding-l"][target] = { paddingLeft: RC.Theme.size.padding }
      core["padding-r"]={}; core["padding-r"][target] = { paddingRight: RC.Theme.size.padding }
      core["padding-lr"]={}; core["padding-lr"][target] = { paddingLeft: RC.Theme.size.padding, paddingRight: RC.Theme.size.padding }

      // Margin
      core.margin={}; core.margin[target] = { marginTop: RC.Theme.size.margin, marginRight: RC.Theme.size.margin, marginBottom: RC.Theme.size.margin, marginLeft: RC.Theme.size.margin }
      core["margin-t"]={}; core["margin-t"][target] = { marginTop: RC.Theme.size.margin }
      core["margin-b"]={}; core["margin-b"][target] = { marginBottom: RC.Theme.size.margin }
      core["margin-tb"]={}; core["margin-tb"][target] = { marginTop: RC.Theme.size.margin, marginBottom: RC.Theme.size.margin }
      core["margin-l"]={}; core["margin-l"][target] = { marginLeft: RC.Theme.size.margin }
      core["margin-r"]={}; core["margin-r"][target] = { marginRight: RC.Theme.size.margin }
      core["margin-lr"]={}; core["margin-lr"][target] = { marginLeft: RC.Theme.size.margin, marginRight: RC.Theme.size.margin }
      core.content={}; core.content[target] = { maxWidth: RC.Theme.size.contentArea }

      // Border
      core.border={}; core.border[target] = { border: `solid 1px ${RC.Theme.color.edges}` }
      core["border-l"]={}; core["border-l"][target] = { borderLeft: `solid 1px ${RC.Theme.color.edges}` }
      core["border-r"]={}; core["border-r"][target] = { borderRight: `solid 1px ${RC.Theme.color.edges}` }
      core["border-t"]={}; core["border-t"][target] = { borderTop: `solid 1px ${RC.Theme.color.edges}` }
      core["border-b"]={}; core["border-b"][target] = { borderBottom: `solid 1px ${RC.Theme.color.edges}` }
      core["border-tb"]={}; core["border-tb"][target] = { borderTop: `solid 1px ${RC.Theme.color.edges}`, borderBottom: `solid 1px ${RC.Theme.color.edges}` }
      core["border-lr"]={}; core["border-lr"][target] = { borderLeft: `solid 1px ${RC.Theme.color.edges}`, borderRight: `solid 1px ${RC.Theme.color.edges}` }

      return core
    }
  }
}

RC.Theme = {
  color: {
    brand1: "#0082ec",
    brand2: "#ff7928",
    brand3: "#36d317",
    onBrand1: "#fff",
    onBrand2: "#fff",
    onBrand3: "#fff",

    navPrimary: "#fff",
    navSecondary: "#fff",
    onNavPrimary: "#ed1c24",
    onNavSecondary: "#ed1c24",

    white: "#fff",
    light: "#f3f3f3",
    fog: "#e7e7e7",
    gray: "#aaa", onGray: "#fff",
    silver: "#999", onSilver: "#fff",
    metal: "#777", onMetal: "#fff",
    dark: "#404040", onDark: "#fff",

    green: "#2e9b3d",
    red: "#ed3c3c",
    blue: "#0077aa",
    cyan: "#00978e",
    yellow: "#fff247",

    bodyBg: "#fff",
    backdrop: "rgba(0,0,0,.64)",

    text: "rgba(0,0,0,.8)",
    textLight: "rgba(0,0,0,.25)",
    textDim: "rgba(255,255,255,.5)",
    textOnLight: "#fff",

    link: "rgba(0,0,0,.84)",
    linkHover: "#0082ec",

    edges: "rgba(0,0,0,.15)",
    edgesDarker: "rgba(0,0,0,.25)",
    edgesLighter: "rgba(0,0,0,.1)",
  },

  font: {
    size: 15, lineHeight: 1.4,
    heavy: "Helvetica Neue, Roboto, sans-serif",
    bold: "Helvetica Neue, Roboto, sans-serif",
    medium: "Helvetica Neue, Roboto, sans-serif",
    regular: "Helvetica Neue, Roboto, sans-serif",
    light: "HelveticaNeue-Light, Helvetica Neue, Roboto-Light, Roboto, sans-serif-light, sans-serif",
    heavyWeight: "700",
    boldWeight: "500",
    mediumWeight: "500",
    regularWeight: "400",
    lightWeight: "300",
  },

  fontAlt: {
    size: 15, lineHeight: 1.4,
    heavy: "Helvetica Neue, Roboto, sans-serif",
    bold: "Helvetica Neue, Roboto, sans-serif",
    medium: "Helvetica Neue, Roboto, sans-serif",
    regular: "Helvetica Neue, Roboto, sans-serif",
    light: "HelveticaNeue-Light, Helvetica Neue, Roboto-Light, Roboto, sans-serif-light, sans-serif",
    heavyWeight: "700",
    boldWeight: "500",
    mediumWeight: "500",
    regularWeight: "400",
    lightWeight: "300",
  },

  size: {
    padding: "3.25%",
    paddingPx: 14,
    margin: 14, // Margin does not have % value
  },

  resolution: {
    small: "335px", // Slightly bigger than the old iPhone
    medium: "375px", // iPhone Newer
    big: "414px", // iPhone 6 Plus
    tablet: "768px", // iPad Mini
    mini: "1024px", // Small Laptops
    desktop: "1280px", // Most desktop screensizes
    full: "1350px", // Typically, no designs should ever go beyond this size
  }
}

RC.Theme.color.heading = RC.Theme.color.brand1

RC.Theme.color.brand1Darker = tinycolor(RC.Theme.color.brand1).darken(7).toHexString()
RC.Theme.color.brand2Darker = tinycolor(RC.Theme.color.brand2).darken(7).toHexString()
RC.Theme.color.brand3Darker = tinycolor(RC.Theme.color.brand3).darken(7).toHexString()

RC.Theme.color.brand1Light = tinycolor(RC.Theme.color.brand1).lighten(47).toHexString()
RC.Theme.color.brand2Light = tinycolor(RC.Theme.color.brand2).lighten(47).toHexString()
RC.Theme.color.brand3Light = tinycolor(RC.Theme.color.brand3).lighten(47).toHexString()

/**
 * @@@@
 * Common CSS attributes (aka CSS classes)
 * @@@@
 */

RC.cssMixins = {
  main() {
    return {
      minHeight: "100vh", padding: 0, margin: 0,
      fontSize: RC.Theme.font.size, lineHeight: RC.Theme.font.lineHeight, color: RC.Theme.color.text,
      fontFamily: RC.Theme.font.regular,
      fontWeight: RC.Theme.font.regularWeight,
    }
  },
  // Item Template
  item(xOffset=0, yOffset){
    if (typeof yOffset !== "number") yOffset = xOffset
    let xPAD = RC.Theme.size.paddingPx+xOffset
    let yPAD = RC.Theme.size.paddingPx+yOffset
    return {
      fontSize: RC.Theme.font.size-1,
      display: "block", position: "relative", zIndex: 2,
      paddingTop: yPAD, paddingLeft: xPAD, paddingBottom: yPAD, paddingRight: xPAD,
      borderStyle: "solid", borderWidth: "0 0 1px 0", borderColor: RC.Theme.color.edges
    }
  },
  // Strip default webkit values -- useful for invisible form elements
  clean() {
    return {
      display: "block",
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
      marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      fontFamily: RC.Theme.font.regular, fontWeight: RC.Theme.font.regularWeight,
      fontSize: RC.Theme.font.size, color: RC.Theme.color.text,
      WebkitFontSmoothing: "antialiased", // This needs to be re-applied for form elements
      border: "none",
    }
  },
  // Vertical Align Template
  verticalAlignOuter: {
    display: "table", width: "100%", height: "100%", verticalAlign: "middle"
  },
  verticalAlignInner: {
    display: "table-cell", verticalAlign: "middle", overflowX: "hidden"
  },
  // Full Height Template
  fullHeight() {
    let ht = 0
    if (_.isFunction(RC.Theme.size.headerNavHeight))
      ht = RC.Theme.size.headerNavHeight()
    else if (RC.Theme.size.topNavHeight)
      ht = RC.Theme.size.topNavHeight

    return {
      minHeight: `calc(100vh - ${ht}px)`
    }
  },
  // Button Template
  button: {
    position: "relative", verticalAlign: "top",
    display: "inline-block", textOverflow: "ellipsis",
    fontSize: "16px", lineHeight: "42px",
    margin: 0, padding: "0 12px",
    minWidth: "52px", minHeight: "47px",
    borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(0,0,0,.15)",
    borderRadius: "2px",
  },
  // Avatar Template
  // DEPRECATED, use RC.AVATAR instead
  avatar: {
    width: 42, height: 42,
    backgroundSize: "cover", backgroundPosition: "50%",
    borderRadius: "50%"
  },
  // Headings Template
  font(weight) {
    let allowed = ["heavy","bold","medium","regular","light"]
    if (!_.contains(allowed,weight)) {
      console.warn("Font style \""+weight+"\" was not valid.")
      return {}
    } else if (!RC.Theme.font[weight] || !RC.Theme.font[weight+"Weight"]) {
      console.warn(`Undefined font variable: ${weight} (${RC.Theme.font[weight]}); ${weight+"Weight"} (${RC.Theme.font[weight+"Weight"]})`)
    }
    return {
      fontFamily: RC.Theme.font[weight], fontWeight: RC.Theme.font[weight+"Weight"]
    }
  },
  // Headings Template
  fontAlt(weight) {
    let allowed = ["heavy","bold","medium","regular","light"]
    if (!_.contains(allowed,weight)) {
      console.warn("Font style \""+weight+"\" was not valid.")
      return {}
    }
    return {
      fontFamily: RC.Theme.fontAlt[weight], fontWeight: RC.Theme.fontAlt[weight+"Weight"]
    }
  },
  // Subtitle
  subtitle( bg, text ) {
    const FONT = this.fontAlt("bold")
    const PAD = RC.Theme.size.paddingPx
    const SIZE = RC.Theme.font.size-4

    return Object.assign( FONT, {
      textTransform: "uppercase", letterSpacing: 3, textIndent: 1,
      fontSize: SIZE, lineHeight: `${SIZE}px`,
      paddingTop: 8, paddingBottom: 8, paddingLeft: PAD, paddingRight: PAD,
      backgroundColor: bg || "#FFF", color: text || "#444",
    })
  },
  // Ellipsis Template
  ellipsis: {
    display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap",
  },
  // Absolute Full
  absFull: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0
  },
  fixedFull: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0
  },
  absCenter(ht, isRound) {
    const style = {
      position: "absolute", left: 0, right: 0, top: "50%", bottom: "auto",
      height: ht, margin: `${ht/-2}px 0 0`
    }

    if (isRound)
      Object.assign( style, {
        left: "50%", right: "auto",
        width: ht, margin: `${ht/-2}px 0 0 ${ht/-2}px`
      })

    return style
  }
}
