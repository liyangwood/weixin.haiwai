"use strict";

/**
 * Single row item with option to add RC.uiIcon to the left, right or both.
 */
RC.ItemIcons = class extends RC.Item {
  constructor(props) {
    super(props)
  }

  renderExtra() {
    let self = this
    let styles = this.css.get("styles")

    if (this.props.uiClass) {
      let iconProps = h.splitProps(this.props, _.without(RC.uiKeys,"uiBgColor"), "uiClass", 2)
      let media = iconProps.map( function(p,n){
        return <RC.uiIcon {... p} theme={n>=1 ? "right" : null} uiSize={Number(p.uiSize) || 24} key={n} />
      })
      if (media.length===1 && this.props.note)
        media.push(<span style={styles.note} key={1}>{this.props.note}</span>)
      return media
    }
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    let PAD = RC.Theme.size.paddingPx

    Object.assign( base.area, {
      paddingLeft: 46
    })
    Object.assign( base.areaInner, {
      padding: 0
    })
    base.note = Object.assign({},RC.cssMixins.ellipsis,{
      position: "absolute", top: "50%", right: PAD,
      maxWidth: 150, height: RC.Theme.font.size-2, marginTop: (RC.Theme.font.size-2)/-2,
      fontSize: RC.Theme.font.size-2, lineHeight: `${RC.Theme.font.size-2}px`,
      opacity: .35
    })

    return base
  }
}

/**
 * Single row item with avatar, title and subtitle.
 */
RC.ItemAvatar = class extends RC.Item {
  constructor(props) {
    super(props)
    this.watchProps = ["src"]
  }

  renderExtra() {
    let self = this
    let styles = this.css.get("styles")

    if (this.props.src || this.props.uiClass || this.props.title || this.props.subtitle) {
      var media = []
      if (this.props.src)
        media.push(<RC.Avatar {... _.pick(this.props, _.without(RC.uiKeys, "uiBgColor"))} src={this.props.src} style={styles.avatar} key={0} />)
      if (this.props.uiClass) {
        let iconProps = h.splitProps(this.props, RC.uiKeys, "uiClass", 2-media.length)
        var realLen = media.length
        media = media.concat( _.map(iconProps, function(p,n){
          let isRight = (realLen+n)>=1
          if (!p.uiBgColor && !isRight)
            p.uiBgColor = "fog"
          let itemSize = p.uiSize || (self.props.uiBgColor ? 18 : 26)

          return <RC.uiIcon {... p} theme={isRight ? "right" : null} uiSize={itemSize} key={n+1} />
        }))
      }

      return <div style={styles.areaInner}>
        {media[0]}
        {this.props.title ? <h3 style={styles.title}>{this.props.title}</h3> : null}
        {this.props.subtitle ? <p style={styles.subtitle}>{this.props.subtitle}</p> : null}
        {media[1]}
      </div>
    }
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    let PAD = RC.Theme.size.paddingPx

    Object.assign( base.area, {
      minHeight: 70, zIndex: 3
    })
    Object.assign( base.areaInner, {
      padding: "0 0 0 52px"
    })
    base.avatar = {
      position: "absolute", top: 13, left: PAD,
    }

    return base
  }
}

/**
 * Single row item with square thumbnail.
 */
RC.ItemThumbnail = class extends RC.Item {
  constructor(props) {
    super(props)
    this.watchProps = ["src"]
  }

  renderExtra() {
    let self = this
    let styles = this.css.get("styles")

    if (this.props.src || this.props.uiClass || this.props.title || this.props.subtitle) {
      var media = []
      if (this.props.src)
        media.push(<figure src={this.props.src} style={styles.thumbnail} key={0} />)
      if (this.props.uiClass) {
        let iconProps = h.splitProps(this.props, RC.uiKeys, "uiClass", 2-media.length)
        var realLen = media.length
        media = media.concat( _.map(iconProps, function(p,n){
          let isRight = (realLen+n)>=1
          if (!p.uiBgColor && !isRight)
            p.uiBgColor = "fog"
          let itemSize = p.uiSize || (self.props.uiBgColor ? 18 : 26)

          return <RC.uiIcon {... p} theme={isRight ? "right" : null} uiSize={itemSize} key={n+1} />
        }))
      }

      return <div style={styles.areaInner}>
        {media[0]}
        {this.props.title ? <h3 style={styles.title}>{this.props.title}</h3> : null}
        {this.props.subtitle ? <p style={styles.subtitle}>{this.props.subtitle}</p> : null}
        {media[1]}
      </div>
    }
  }

  baseStyles(np,ns) {
    let base = super.baseStyles(np,ns)
    let PAD = RC.Theme.size.paddingPx

    Object.assign( base.area, {
      zIndex: 3
    })
    Object.assign( base.areaInner, {
      minHeight: 88, padding: "0 0 0 104px"
    })
    Object.assign( base.title, {
      padding: "15px 15px 0 0"
    })
    base.thumbnail = {
      position: "absolute", top: 13, left: PAD,
      width: 92, height: 92,
      backgroundImage: `url(${np.src})`, backgroundSize: "cover", backgroundPosition: "50%",
      backgroundColor: RC.Theme.color.fog
    }

    return base
  }
}
