"use strict";

RC.Card = class extends RC.CSS {

  constructor(props) {
    super(props);

    this.state = {
      obj: Immutable.Map({ isActive: false })
    }
  }
  /**
   * @@@
   * State Control
   * @@@
   */

  /**
   * @@@
   * Render
   * @@@
   */
  renderAuto(){
    let themes = this.css.get("themes")
    if (!_.isArray(themes)) themes = [ themes ]

    if (!_.intersection(themes,["double-from-right","double-from-left"]).length) {
      let keys = ["title","subtitle","src"].concat(RC.uiKeys)
      if (_.intersection( _.keys(this.props), keys).length)
        return <RC.ItemAvatar {... _.pick(this.props, keys)} />
    }
  }

  render(){

    let styles = this.css.get("styles")

    return <div style={styles.area}>
      {this.renderAuto()}
      {this.renderChildren()}
    </div>
  }

  // @@@@
  // @@@@
  // Styles Start
  // @@@@
  // @@@@
  baseStyles() {
    return {
      // Canvas Outer
      area: {
        position: "relative", overflow: "hidden",
        margin: 10, padding: 0,
        boxShadow: "0 0 3px rgba(0,0,0,.15)",
        backgroundColor: this.color.get("hex"), color: this.color.get("textColor"),
      },
    }
  }

  themeStyles() {
    return {
      "no-shadow": {
        area: {
          boxShadow: 0
        }
      }
    }
  }
}

RC.Card.displayName = "RC.Card"

RC.Card.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  avatar: React.PropTypes.string,
  uiClass: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),

  id: React.PropTypes.string,
  className: React.PropTypes.string,
  style: React.PropTypes.object,
}
