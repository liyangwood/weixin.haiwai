"use strict";

RC.TabsSteps = class extends RC.Tabs {
  constructor(p) {
    super(p)
    this.watchProps = _.without( this.watchProps.concat("cursorColor"), "forceClicked")
    this.watchStates = []
  }
  renderExtra() {
    const selected = !isNaN(this.state.active) && this.state.active>=0 ? this.state.active : this.props.forceClicked
    return <div style={h.assignPseudos( this.css.get("styles").tabActive, selected, this.children.length)}>
      <span style={this.css.get("styles").tabCursor} />
    </div>
  }
  render() {
    let styles = this.css.get("styles")
    return <div {... this.props} style={styles.area}>
      {this.renderChildren()}
      {this.renderExtra()}
    </div>
  }
  baseStyles(np,ns) {
    const noLines = super.getNoLines()
    const childrenLength = this.children ? this.children.length : (this.props.children || []).length
    const single = 100/childrenLength

    let BASE = super.baseStyles(np,ns)

    if (!this.cursorColor || (np.cursorColor && np.cursorColor!=this.props.cursorColor))
      this.cursorColor = h.getBasicColor(np.cursorColor, this.color.get("textColor"))

    Object.assign(BASE.area, {
      border: `solid 1px ${RC.Theme.color.text}`,
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0
    })
    Object.assign(BASE.item, noLines, {
      zIndex: 5,
      transition: "all ease .75s",
      backgroundColor: "rgba(0,0,0,.05)",
      ":clicked": {
        backgroundColor: "transparent"
      },
      ":active": {
        color: this.cursorColor.textColor
      }
    })

    BASE.tabActive = {
      transition: "all .4s ease",
      position: "absolute", top: 0, bottom: 0, left: 0, zIndex: 1,
      backgroundColor: this.cursorColor.hex
    }

    for (var i=1; i < 10; i++) {
      BASE.tabActive[`:nth-child(${i})`] = { width: `${single*i}%` }
    }

    BASE.tabCursor = {
      position: "absolute", top: "50%", bottom: "auto", left: "auto", right: 0,
      width: 0, height: 0, margin: "-20px",
      borderTop: "20px solid transparent", borderBottom: "20px solid transparent",
    	borderLeft: `20px solid ${this.cursorColor.hex}`
    }

    return BASE
  }
}
