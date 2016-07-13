"use strict";

RC.Grid = class extends RC.Content {
  constructor(p) {
    super(p)
    this.watchProps = this.watchProps.concat(["flexDirection","flexWrap","justifyContent","alignContent","alignItems"])
  }
  baseStyles(np,ns) {
    let BASE = super.baseStyles(np,ns)

    let size = typeof np.size==="undefined" ? 100 : np.size
    let flexDirection = ["row","row-reverse","column","column-reverse"].indexOf(np.flexDirection) >= 0
      ? np.flexDirection : "row"
    let flexWrap = ["wrap","nowrap","wrap-reverse"].indexOf(np.flexWrap) >= 0
      ? np.flexWrap : "wrap"
    let justifyContent = ["flex-start","flex-end","center","space-between","space-around"].indexOf(np.justifyContent) >= 0
      ? np.justifyContent : "flex-start"
    let alignContent = ["flex-start","flex-end","center","space-between","space-around"].indexOf(np.alignContent) >= 0
      ? np.alignContent : "flex-start"
    let alignItems = ["flex-start","flex-end","center","stretch","baseline"].indexOf(np.alignItems) >= 0
      ? np.alignItems : "flex-start"

    Object.assign( BASE.title, {
      width: "100%"
    })

    BASE.area = {
      position: "relative", zIndex: 1,
      display: "flex", width: "100%",
      flexFlow: `${flexDirection} ${flexWrap}`,
      justifyContent: justifyContent,
      alignItems: alignItems,
      alignContent: alignContent,
      backgroundColor: this.color.get("realHex"), color: this.color.get("textColor"),
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
    }

    return BASE
  }
}

RC.Grid.displayName = "RC.Grid"
RC.Grid.propTypes = Object.assign({}, RC.Grid.propTypes, {
  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  flexDirection: React.PropTypes.string,
  flexWrap: React.PropTypes.string,
  justifyContent: React.PropTypes.string,
  alignContent: React.PropTypes.string,
  alignItems: React.PropTypes.string,
  xAlign: React.PropTypes.string,
  yAlign: React.PropTypes.string,
  order: React.PropTypes.number,
})


RC.GridItem = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.watchProps = ["xAlign","yAlign","flexGrow","flexShrink","flexBasis","order","fixedWidth","width","height"]
  }

  render() {
    let styles = this.css.get("styles")
    return <div style={styles.area}>
      {this.props.children}
    </div>
  }

  baseStyles(np,ns) {
    let flexGrow = typeof np.flexGrow!=="undefined"
      ? np.flexGrow : 0
    let flexShrink = typeof np.flexShrink!=="undefined"
      ? np.flexShrink : 1
    let flexBasis = typeof np.flexBasis!=="undefined"
      ? np.flexBasis : "auto"

    let flexAttr = { flex: `${flexGrow} ${flexShrink} ${flexBasis}`, }
    if (typeof np.order!=="undefined")
      flexAttr.order = np.order
    if (typeof np.xAlign!=="undefined")
      flexAttr.xAlign = np.xAlign

    // Y Align
    if (typeof np.yAlign!=="undefined") {
      if (_.contains(["auto","flex-start","flex-end","center","baseline","stretch"],np.yAlign))
        flexAttr.alignSelf = np.yAlign
      else if (np.yAlign=="top")
        flexAttr.alignSelf = "flex-start"
      else if (np.yAlign=="bottom")
        flexAttr.alignSelf = "flex-end"
    }

    // X Align
    if (typeof np.xAlign!=="undefined") {
      if (np.xAlign=="right")
        flexAttr.marginLeft = "auto"
      else if (np.xAlign=="center") {
        flexAttr.marginLeft = "auto"
        flexAttr.marginRight = "auto"
      }
    }

    if (typeof np.width!=="undefined" || typeof np.fixedWidth!=="undefined")
      flexAttr.width = typeof np.fixedWidth==="undefined" ? np.width : np.fixedWidth
    if (typeof np.fixedWidth!=="undefined")
      flexAttr.minWidth = np.fixedWidth
    if (typeof np.height!=="undefined")
      flexAttr.height = np.height

    return {
      area: Object.assign({},flexAttr, {
        backgroundColor: this.color.get("realHex"), color: this.color.get("textColor"),
        paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
      })
    }
  }
  themeStyles(){
    return RC.ThemeHelpers.core()
  }
}

RC.GridItem.displayName = "RC.GridItem"
RC.GridItem.propTypes = Object.assign({}, RC.GridItem.propTypes, {
  flexGrow: React.PropTypes.number,
  flexShrink: React.PropTypes.number,
  flexBasis: React.PropTypes.number,
})
