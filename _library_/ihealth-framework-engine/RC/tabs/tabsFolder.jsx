"use strict";

RC.TabsFolder = class extends RC.Tabs {
  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    Object.assign(base.area, {
      position: "absolute", top: -32, left: 0,
      width: "auto", height: 32,
      paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
      borderRadius: "2px 2px 0 0", overflow: "hidden"
    })
    Object.assign(base.item, {
      border: "none",
      overflow: "hidden", textOverflow: "clip", whiteSpace: "normal",
      padding: "0 10px",
      flex: "0 1 auto",
      backgroundColor: this.clickedBgColor || tinycolor(this.color.get("hex")).darken(10).toHexString(),
      ":clicked": {
        borderColor: this.clickedBorderColor,
        backgroundColor: this.color.get("hex"),
        color: this.color.get("textColor")
      },
      ":held": {
        backgroundColor: tinycolor(this.color.get("hex")).darken(17).toHexString(),
      }
    })
    return base
  }
}
