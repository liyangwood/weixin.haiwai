"use strict";

const labelWidth = 100
const PAD = 8

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Button
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

RC.Button = class extends RC.CSS {

  constructor(props) {
    super(props)

    this.defBgColor = "fog"
    this.watchProps = ["bgColorHover", "colorHover"]
    this.watchStates = ["isHover", "isActive"]

    this.state = {
      isHover: false,
      isActive: true,
    }
  }

  _onHoverStart(e) {
    this.setState({isHover: true})
    if (_.isFunction(this.props.onMouseOver))
      this.props.onMouseOver(e)
    if (_.isFunction(this.props.onTouchStart))
      this.props.onTouchStart(e)
  }

  _onHoverStop(e) {
    this.setState({isHover: false})
    if (_.isFunction(this.props.onMouseOut))
      this.props.onMouseOut(e)
    if (_.isFunction(this.props.onTouchEnd))
      this.props.onTouchEnd(e)
  }

  renderIcon() {
    if (!this.props.uiClass) return null
    return <RC.uiIcon
      {... _.pick(this.props, _.without(RC.uiKeys, "uiBgColor"))}
      uiColor={this.props.uiColor || (this.state.isHover ? this.colorHover : this.color.get("textColor"))}
      itemStyle={{margin: "3px 5px 0 0", verticalAlign: "top"}}
      theme="inlineBlockLeft" uiSize={14}/>
  }

  render() {
    let styles = this.css.get("styles")

    return <button
      {... _.omit(this.props, RC.uiKeys)} style={styles.area}
        onMouseOver={this._onHoverStart.bind(this)}
        onTouchStart={this._onHoverStart.bind(this)}
        onMouseOut={this._onHoverStop.bind(this)}
        onTouchEnd={this._onHoverStop.bind(this)}
      >
      {this.renderIcon()}
      {this.renderChildren()}
    </button>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {

    if (typeof this.bgColorHover === "undefined" || np.bgColorHover!=this.props.bgColorHover)
      this.bgColorHover = np.bgColorHover
        ? h.getRealColor(np.bgColorHover, "brand1", null, true)
        : RC.Theme.color.brand1

    if (typeof this.colorHover === "undefined" || np.colorHover!=this.props.colorHover)
      this.colorHover = np.colorHover
        ? h.getRealColor(np.colorHover, "onBrand1", null, true)
        : RC.Theme.color.onBrand1

    let buttonColor = ns.isHover && ns.isActive ? this.bgColorHover : this.color.get("hex")
    let textColor = ns.isHover && ns.isActive ? this.colorHover : this.color.get("textColor")
    let buttonPAD = 10

    return {
      area: Object.assign({}, RC.cssMixins.clean(), {
        position: "relative", width: "100%", minHeight: 36,
        zIndex: ns.isHover && ns.isActive ? 2 : 1,
        transition: "all .2s ease",
        padding: `${(buttonPAD-2)}px ${buttonPAD}px ${buttonPAD-1}px`,
        margin: `${RC.Theme.size.paddingPx}px 0`,
        color: textColor,
        cursor: ns.isActive ? "pointer" : "auto",
        backgroundColor: buttonColor,
        // border: "solid 1px "+RC.Theme.color.edgesLighter,
      }),
    }
  }

  themeStyles(np,ns) {
    let cPAD = RC.Theme.size.paddingPx - PAD // This must be here to allow dynamic changes
    return {
      inline: {
        area: {
          display: "inline-block", width: "auto", margin: "10px 5px 10px 0"
        },
      },
      circle: {
        area: {
          borderRadius: "50%",
          width: 74, height: 74, margin: "12px auto 0"
        }
      },
      big: {
        area: {
          padding: 15, minWidth: 240,
          fontSize: RC.Theme.font.size*1.2
        }
      }
    }
  }
};

RC.Button.displayName = "RC.Button";
RC.Button.propTypes = {
  id: React.PropTypes.string,
  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  type: React.PropTypes.string,
  value: React.PropTypes.string,
  name: React.PropTypes.string,

  form: React.PropTypes.string,

  className: React.PropTypes.string,
  style: React.PropTypes.object,
};
