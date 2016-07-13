"use strict";

/**
 * Basic divider element for item row
 */
RC.ItemDivider = class extends RC.Item {
  constructor(p) {
    super(p)
    this.defBgColor = "light"
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)

    base.area = Object.assign({}, RC.cssMixins.item(0, -4), {
      backgroundColor: this.color.get("hex"), color: this.color.get("textColor"),
      borderColor: this.defaultBorderColor,
      zIndex: 5
    })
    base.areaInner = Object.assign({},RC.cssMixins.font("bold"), {
      fontSize: RC.Theme.font.size+1,
      padding: 0
    })

    return base
  }
}

/**
 * Basic content body element for RC.Item
 */
RC.ItemBody = class extends RC.Item {
  constructor(props) {
    super(props)
    this.watchProps = ["src"]
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    let PAD = RC.Theme.size.paddingPx

    Object.assign( base.area, {
      paddingTop: PAD-1, paddingLeft: 0, paddingBottom: PAD+9, paddingRight: 0,
      margin: "0 12px"
    })

    return base
  }
}

/**
 * Item elements with no padding.
 * Created for full-width images.
 */
RC.ItemImage = class extends RC.Item {
  constructor(props) {
    super(props)
    this.watchProps = ["src"]
  }

  renderExtra() {
    if (this.props.src) return <img src={this.props.src} />
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)

    Object.assign( base.area, {
      paddingTop: 0, paddingLeft: 0, paddingBottom: 0, paddingRight: 0
    })

    return base
  }
}
