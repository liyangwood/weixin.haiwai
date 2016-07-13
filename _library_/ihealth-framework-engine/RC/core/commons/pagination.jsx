
RC.Pagination = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.watchProps = ["curColor"]
  }
  renderPrev() {
    if (this.props.cur <= 1) return null
    return this.renderSingle(String.fromCharCode(171),"prev",this.props.cur-1)
  }
  renderNext() {
    if (this.props.cur >= this.props.total) return null
    return this.renderSingle(String.fromCharCode(187),"next",this.props.cur+1)
  }
  renderSingle(page,n,url) {
    let val = page
    let cssStates = []
    let base = String(this.props.url || "")

    if (!isNaN(page)) {
      if (page===this.props.cur)
        cssStates.push(":cur")
      url = base+page
    } else if (typeof page==="undefined") {
      val = String.fromCharCode(8230)
      cssStates.push(":dots")
      url = undefined
    } else
      url = base+url

    let style = h.assignPseudos(this.css.get("styles").page, null, null, cssStates)
    if (!cssStates.length)
      style[":hover"] = {
        borderColor: this.color.get("textColor")
      }

    let props = {
      href: url,
      style: style,
      noHover: true,
      key: n
    }

    if (url && _.isFunction(this.props.onChange)) {
      props.href = undefined
      props.onClick = this.props.onChange.bind(null, url)
    }

    return <RC.URL {... props}>{val}</RC.URL>
  }
  renderPages() {
    let range = _.range(this.props.total).map( (n) => {
      const page = n+1
      const offsetLeft = this.props.cur-1
      const offsetRight = this.props.cur+1
      if (
        this.props.total < 9 // If there 9 or less pages
        || page <= 3 || page > this.props.total-3 // If pages are within the 3 from the either ends
        || this.props.cur==page || offsetLeft==page || offsetRight==page
      ) return page
      return undefined
    })
    range = _.filter( range, (nn,n) => {
      return typeof nn!="undefined" ||
        (nn-1!=range[n-1] && typeof range[n-1]!="undefined")
    })

    return range.map( this.renderSingle.bind(this) )
  }
  render() {
    const styles = this.css.get("styles")
    return <div style={styles.area}>
      {this.renderPrev()}
      {this.renderPages()}
      {this.renderNext()}
    </div>
  }
  baseStyles(np,ns) {
    if (typeof this.curColor==="undefined" || np.curColor!=this.props.curColor)
      this.curColor = h.getRealColor(np.curColor, "brand2", null, true)

    return {
      area: {
        fontSize: RC.Theme.font.size-1, textAlign: "right",
      },
      page: {
        display: "inline-block",
        textAlign: "center",
        backgroundColor: this.color.get("hex"),
        margin: "0 2px", padding: "3px 7px",
        borderWidth: 1, borderStyle: "solid", borderColor: "transparent",
        ":cur": Object.assign({}, RC.cssMixins.font("bold"),{
          borderColor: this.curColor, color: this.curColor
        }),
        ":dots": {
          padding: 3,
          backgroundColor: "transparent"
        }
      }
    }
  }
}
RC.Pagination.displayName = "RC.Pagination"
RC.Pagination.defaultProps = {
  total: 1,
  cur: 1
}
RC.Pagination.propTypes = Object.assign({}, RC.Pagination.propTypes, {
  url: React.PropTypes.string,
  cur: React.PropTypes.number,
  total: React.PropTypes.number,
  curColor: React.PropTypes.string,
})
