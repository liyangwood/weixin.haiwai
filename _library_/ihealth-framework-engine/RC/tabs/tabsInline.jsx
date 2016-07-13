"use strict";

RC.TabsInline = class extends RC.Tabs {
  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    Object.assign(base.area, {
      display: "block", width: "100%", backgroundColor: "none",
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0
    })
    Object.assign(base.areaInner, {
      display: "block"
    })
    Object.assign(base.item, {
      margin: "8px 2px 8px 0",
      backgroundColor: this.color.get("hex"), color: this.color.get("textColor"),
      border: "none",
    })
    return base
  }
}
