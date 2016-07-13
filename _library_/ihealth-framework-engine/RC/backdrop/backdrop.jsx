"use strict";

RC.BackDropArea = class extends RC.CSS {

  constructor(props) {
    super(props);

    this.defBgColor = "backdrop"
    this.watchProps = ["absolute"]
  }

  _stopPropagation(e) {
    e.stopPropagation();
    if (_.isFunction(this.props.onClickInner)){
      this.props.onClickInner(e)
    }
  }

  renderContent() {
    let styles = this.css.get("styles");
    return !!this.props.children
      ?
      <div {... this.props} style={styles.area} key="backdrop-animation">
        <div onClick={this._stopPropagation.bind(this)} style={styles.areaInner}>
          { this.renderChildren() }
        </div>
      </div>
      :
      null
  }

  render() {
    return <RC.Animate transitionName={this.props.transitionName || "fade"}
                       transitionEnterTimeout={this.props.transitionEnterTimeout || 250}
                       transitionLeaveTimeout={this.props.transitionLeaveTimeout || 250}>

      { this.renderContent() }

    </RC.Animate>
  }

  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@

  baseStyles(np,ns) {

    return {
      area: Object.assign({}, np.absolute ? RC.cssMixins.absFull : RC.cssMixins.fixedFull, {
        display: "flex", alignItems: "center",
        padding: "3%",
        backgroundColor: this.color.get("hex"), color: this.color.get("textColor"),
        overflow: "hidden", zIndex: 5000,
      }),
      areaInner: {
        minWidth: 250, maxWidth: 700, margin: "0 auto", padding: "4%"
      }
    }
  }
}

RC.BackDropArea.displayName = "RC.BackDropArea"

RC.BackDropArea.propTypes = {
  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,

  absolute: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  transitionEnterTimeout: React.PropTypes.number,
  transitionLeaveTimeout: React.PropTypes.number,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ])
}
