"use strict"

RC.NotFound = class extends RC.CSS {
  render() {
    return <div className="table bg-brand-light">
      <div className="inside center">
        <h4>Component Not Found</h4>
      </div>
    </div>
  }
}

RC.NotFound.displayName = "RC.NotFound"


RC.VerticalAlign = class extends RC.CSS {
  render() {
    if (!this.props.children) return null

    let styles = this.css.get("styles")

    return <div style={styles.area}>
      <div style={styles.areaInner}>
        {this.props.children}
      </div>
    </div>
  }

  baseStyles() {
    return {
      area: RC.cssMixins.verticalAlignOuter,
      areaInner: Object.assign({},RC.cssMixins.verticalAlignInner, {
        textAlign: "center"
      })
    }
  }
}

RC.VerticalAlign.displayName = "RC.VerticalAlign"


RC.Disconnected = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      connected: this.props.demoOnly ? false : Meteor.status().connected
    }
  },
  renderChildren() {
    return this.props.children ? this.props.children : "Connection to server lost. Reconnecting..."
  },
  render() {
    const styles = this.style();
    return this.data.connected ? null :
      <div style={styles.area}>
        { this.renderChildren() }
      </div>
  },
  style() {
    const defaultStyles = {
      area: {
        height: 50, padding: 14,
        textAlign: "center",
        backgroundColor: "rgba(20,20,20,.9)", color: "#fff",
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 4999,
      }
    };
    let styles = {};
    _.each(Object.keys(defaultStyles), k => styles[k] = Object.assign({}, defaultStyles[k], (this.props.style || {})[k]));
    return styles
  }
});


const uiDiameter = 42

RC.uiIcon = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.watchProps = RC.uiKeys
    this.useUIKeys = true
  }

  render() {
    if (!this.props.uiClass) {
      console.warn("You cannot use <RC.uiIcon /> without passing a uiClass prop.")
      return null
    }

    let styles = this.css.get("styles")
    let classList = [
      "fa",
      "fa-"+this.props.uiClass.trim(),
      (this.props.className || "")
    ]

    let ui = <i {... _.omit(this.props,RC.uiKeys)} className={classList.join(" ")} style={styles.item}>{this.props.children}</i>
    return this.props.uiBgColor ? <span style={styles.area}>{ui}</span> : ui
  }

  baseStyles(np,ns) {
    let size = np.uiSize || 16
    let itemStyle = np.uiBgColor ? RC.cssMixins.absCenter(size) :
    {
      position: "absolute", top: 15, bottom: "auto",
      //position: "static", top: 15, bottom: "auto",
      left: np.theme=="right" ? "auto" : 0,
      right: np.theme=="right" ? 0 : "auto",
      width: size*2, height: size, margin: "-3px 0 0"
    }

    // @@@@
    // Start Styles
    return {
      area: {
        position: "absolute", top: 13, left: 15,
        width: 42, height: 42,
        backgroundColor: this.color.get("hex"), backgroundSize: "cover", backgroundPosition: "50%",
        borderRadius: "50%"
      },
      item: Object.assign({}, itemStyle, {
        fontSize: size, lineHeight: 1, color: this.color.get("textColor"), textAlign: "center",
        transformOrigin: "50%"
      })
    }
  }

  themeStyles(np,ns) {
    const size = np.uiSize || 16
    const inlineBlock = {
      position: "relative", left: "auto", right: "auto", top: "auto",
      display: "inline-block"
    }
    const inlineBlockItem = Object.assign({}, inlineBlock, { width: size+3, height: size })
    const inlineBlockAreaLeft = Object.assign({}, inlineBlock, { margin: "0 3px 0 0" })
    const inlineBlockAreaRight = Object.assign({}, inlineBlock, { margin: "0 0 0 3px" })

    return {
      inlineBlock: {
        item: inlineBlockItem
      },
      inlineBlockLeft: {
        area: np.uiBgColor ? inlineBlockAreaLeft : {},
        item: np.uiBgColor ? {} : inlineBlockAreaLeft
      },
      inlineBlockRight: {
        area: np.uiBgColor ? inlineBlockAreaRight : {},
        item: np.uiBgColor ? {} : inlineBlockAreaRight
      },
      absCenter: {
        area: {
          top: "50%", left: "50%", margin: (uiDiameter/-2)+"px 0 0 "+(uiDiameter/-2)+"px"
        },
        item: {
          top: "50%", left: "50%",
          width: size, height: size, margin: (size/-2)+"px 0 0 "+(size/-2)+"px"
        }
      },
      right: {
        area: {
          left: "auto", right: 15,
        },
        item: np.uiBgColor ? {} : {
          top: "50%", margin: -size/2+"px 0 0"
        }
      }
    }
  }
}

RC.uiIcon.displayName = "RC.uiIcon"

RC.uiIcon.propTypes = {
  uiClass: React.PropTypes.string,
  uiSize: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  uiBgColor: React.PropTypes.string,
  uiColor: React.PropTypes.string,
}
