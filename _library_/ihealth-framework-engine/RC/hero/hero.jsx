
"use strict";

RC.Hero = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.defBgColor = "dark"
    this.watchProps = ["avatar","backgroundImage"]
  }
  /**
   * @@@
   * Render
   * @@@
   */
  renderHero(){
    let styles = this.css.get("styles")
    let actionUrl = typeof this.props.action==="string" ? this.props.action : null
    let actionFunc = _.isFunction(this.props.action) ? this.props.action : null

    return <div style={styles.item}>
      {
      !this.props.avatar && !this.props.uiClass ? null :
      <div style={styles.avatarContainer} href={actionUrl} onClick={actionFunc}>
        {this.props.avatar ? <figure style={styles.avatar}/> : null}
        {this.props.uiClass ? <RC.uiIcon uiSize={24} uiClass={this.props.uiClass} uiColor={this.props.uiColor || "white"} uiBgColor={this.props.uiBgColor || "dark"} style={styles.avatarIconArea} itemStyle={styles.avatarIcon}/> : null}
      </div>
      }
      {this.props.title ? <strong style={styles.title}>{this.props.title}</strong> : null}
      {this.props.subtitle ? <div style={styles.subtitle}>{this.props.subtitle}</div> : null}
    </div>
  }
  render(){
    let styles = this.css.get("styles")
    return <div {... _.omit(this.props,RC.uiKeys.concat(["backgroundImage","action","avatar","title","subtitle"]))} style={styles.area}>
      {this.props.backgroundImage ? <div style={styles.areaInner}/> : null}
      {this.renderHero()}
      {this.props.children}
    </div>
  }
  // @@@@
  // @@@@
  // Styles Start
  // @@@@
  // @@@@
  baseStyles(np,ns) {

    const hasAction = !!np.uiClass
    const avatarSize = 58

    // Start Styles
    return {
      // Canvas
      area: {
        position: "relative", zIndex: 2,
        backgroundColor: this.color.get("hex"), backgroundImage: "url("+np.backgroundImage+")", backgroundSize: "cover", backgroundPosition: "center",
        margin: 0, padding: 0, overflow: "hidden",
        color: this.color.get("textColor"),
      },
      // Canvas Inner
      areaInner: Object.assign({}, RC.cssMixins.absFull, {
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,.5)",
      }),
      // Item
      item: {
        position: "relative", zIndex: 3,
        textAlign: "center",
        maxWidth: 580, minHeight: 70, padding: "10% 0 7%", margin: "0 auto"
      },
      // Avatar Container
      avatarContainer: {
        position: "relative",
        width: avatarSize*1.7, height: avatarSize, margin: "0 auto 10px"
      },
      // Avatar
      avatar: Object.assign({}, RC.cssMixins.avatar, {
        position: "absolute", top: 0, left: hasAction ? 0 : "50%", right: "auto", zIndex: 2,
        backgroundImage: "url("+np.avatar+")",
        width: avatarSize, height: avatarSize, margin: "0 0 0 "+(hasAction ? 0 : avatarSize/-2)+"px"
      }),
      // Avatar Icon Canvas
      avatarIconArea: Object.assign({}, RC.cssMixins.avatar, {
        position: "absolute", top: 0, left: np.avatar ? "auto" : "50%", right: np.avatar ? 0 : "auto", zIndex: 1,
        width: avatarSize, height: avatarSize, margin: "0 0 0 "+(np.avatar ? 0 : avatarSize/-2)+"px"
      }),
      // Avatar Icon
      avatarIcon: {
        marginLeft: 7,
      },
      // Title
      title: Object.assign(RC.cssMixins.font("light"), {
        display: "block",
        fontSize: RC.Theme.font.size+5, color: this.color.get("textColor"),
      }),
      // Subtitle
      subtitle: Object.assign(RC.cssMixins.font("light"), {
        padding: 5, margin: 0,
        fontSize: RC.Theme.font.size-1,
        opacity: .58
      })
    }
  }
  themeStyles(np,ns) {
    const PAD = RC.Theme.size.paddingPx
    const avatarSize = 58
    const testMQ = RC.MQ.device >= 1
    // window.matchMedia(`(min-width: ${RC.Theme.resolution.medium})`).matches

    return {
      big: {
        area: {
          padding: `${testMQ ? "55%" : "290px"} 0 0`
        },
        item: Object.assign({}, RC.cssMixins.absFull, {
          display: "flex", alignContent: "center", flexWrap: "wrap"

          // minHeight: 0, maxWidth: "100%", padding: 0,
          // textAlign: "left"
        }),
        avatarContainer: {
          margin: "0 0 10px",
          width: !!np.uiClass ? avatarSize*1.7 : avatarSize
        },
        title: {
          width: "100%", margin: "auto"
        },
        subtitle: {
          width: "100%", margin: "auto", padding: "5px 1px 0"
        }
      }
    }
  }
}

RC.Hero.displayName = "RC.Hero"
RC.Hero.propTypes = Object.assign({}, RC.Hero.propTypes, {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  backgroundImage: React.PropTypes.string,
  avatar: React.PropTypes.string,
  uiClass: React.PropTypes.string,

  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,
})
