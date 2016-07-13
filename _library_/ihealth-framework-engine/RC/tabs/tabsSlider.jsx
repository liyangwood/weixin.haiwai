"use strict";

RC.TabsSlider = class extends RC.Tabs {
  constructor(p) {
    super(p)
    this.watchProps = this.watchProps.concat("cursorColor")
  }
  renderExtra(){
    const selected = !isNaN(this.state.active) && this.state.active>=0 ? this.state.active : this.props.forceClicked
    return <div style={h.assignPseudos( this.css.get("styles").tabActive, selected, this.children.length)}>
      <span style={this.css.get("styles").tabCursor}/>
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
    const noLines = this.getNoLines()
    const childrenLength = this.children ? this.children.length : (this.props.children || []).length
    const single = 100/childrenLength

    let BASE = super.baseStyles(np,ns)

    Object.assign(BASE.area, {
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0
    })
    Object.assign(BASE.item, noLines)

    if (!this.cursorColor || (np.cursorColor && np.cursorColor!=this.props.cursorColor))
      this.cursorColor = h.getRealColor(np.cursorColor, this.color.get("textColor"), null, true)

    BASE.tabActive = {
      transition: "all .4s ease",
      position: "absolute", top: "auto", bottom: 0,
      width: `${single}%`, height: 3,
    }

    for (var i=1; i < 10; i++) {
      BASE.tabActive[`:nth-child(${i})`] = { left: `${single*(i-1)}%` }
    }

    BASE.tabCursor = {
      position: "absolute", top: 0, bottom: 0, left: 10, right: 10,
      backgroundColor: this.cursorColor
    }

    return BASE
  }
}
