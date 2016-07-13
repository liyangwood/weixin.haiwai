
const head = ["S","M","T","W","T","F","S"]
const colCount = head.length // 7, Because there are 7 days in a week
const tn = "all .2s ease"
const tnOpacity = "opacity .2s ease"

RC.DatePicker = class extends RC.CSS {
  constructor(p) {
    super(p)

    this.watchProps = ["lineColor","maxWidth"]

    const selDate = moment(this.props.date)
    const firstPage = moment(this.props.firstPage)
    this.state = {
      obj: Immutable.Map({
        cur: firstPage.isValid() ? firstPage : (selDate.isValid() ? selDate : moment()),
        sel: selDate.isValid() ? selDate : null,
        mmyy: 0 // 0 for off, 1 for month, 2 for year
      })
    }
  }
  // @@
  // @@
  // Prep
  // @@
  // @@
  shouldComponentUpdate() {
    return true // Because of moment() states, it will never update otherwise.
  }
  _prevMonth() {
    if (!this.state.obj.get("mmyy")) {
      const m = this.state.obj.get("cur")
      this.setStateObj({
        cur: m.subtract(1,"month")
      })
    }
  }
  _nextMonth() {
    if (!this.state.obj.get("mmyy")) {
      const m = this.state.obj.get("cur")
      this.setStateObj({
        cur: m.add(1,"month")
      })
    }
  }
  calendarize(year, month) {
    const date = new Date(year, month-1, 1)
    let range = _.range(new Date(year, month, 0).getDate()).map( function(day){
      return day+1
    })
    let fill = _.range( date.getDay() ).map( function(){ return null })
    calendar = fill.concat(range)

    return _.values( _.groupBy( calendar, function(day,n){
      return Math.floor(n/7)
    }))
  }
  openMMYY(type) {
    if (!this.state.obj.get("mmyy")) {
      this.setStateObj({
        mmyy: type
      })
    }
  }
  chooseMMYY(date) {
    let m = moment(date)
    // if (m.isValid()) { // Just assume that it's valid
    let range = this.getMinMax()

    if (m.isBefore(range.min))
      m = range.min
    if (m.isAfter(range.max))
      m = range.max

    this.setStateObj({
      cur: m,
      mmyy: 0
    })
    // }
  }
  chooseDate(year,month,day) {
    if (_.isFunction(this.props.onChange))
      this.props.onChange(year,month,day)
    if (!this.props.disableClickState)
      this.setStateObj({
        sel: moment(`${year}-${month}-${day}`)
      })
  }
  getMinMax() {
    let min = moment(this.props.minDate)
    let max = moment(this.props.maxDate)

    if (max.isBefore(min))
      max = min
    if (min.isAfter(max))
      min = max

    return { min: min, max: max }
  }
  // @@
  // @@
  // Render
  // @@
  // @@
  render() {
    const state = this.state.obj
    const styles = this.css.get("styles")
    const sel = state.get("sel")
    const mmyyIsOn = !!state.get("mmyy")

    let m = mComp = state.get("cur")

    let yrRange = this.getMinMax()
    let minDate = yrRange.min
    let maxDate = yrRange.max

    let year = m.format("YYYY")
    let month = m.format("MM")
    let curDay = m.format("DD")

    let today = moment().format("YYYYMMDD")
    let selDate = sel ? sel.format("YYYYMMDD") : null

    let isCurYear = year==moment().format("YYYY")
    let calendar = this.calendarize(year, month)

    // Arrows
    let leftArrow, rightArrow, minDay, maxDay
    if (!minDate.isValid() || mComp.startOf("month").isAfter(minDate))
      leftArrow = <a style={h.assignPseudos(styles.left,mmyyIsOn)} onClick={this._prevMonth.bind(this)}><span style={styles.leftArrow} /></a>
    else
      minDay = minDate.format("DD")

    if (!maxDate.isValid() || mComp.endOf("month").isBefore(maxDate))
      rightArrow = <a style={h.assignPseudos(styles.right,mmyyIsOn)} onClick={this._nextMonth.bind(this)}><span style={styles.rightArrow} /></a>
    else
      maxDay = maxDate.format("DD")

    return <div style={styles.area}>
      <div style={styles.month}>
        {leftArrow}
        <span onClick={this.openMMYY.bind(this,1)} style={{display: "inline-block", padding: "0 2px 0 10px"}}>{m.format("MMM ")}</span>
        <span onClick={this.openMMYY.bind(this,2)} style={{display: "inline-block", padding: "0 10px 0 2px"}}>{m.format(" YYYY")}</span>
        {rightArrow}
      </div>

      <DatePickerMMYYList date={state.get("cur")} mmyy={state.get("mmyy")} color={this.props.color} trigger={1} handler={this.chooseMMYY.bind(this)} minDate={minDate} maxDate={maxDate} theme={this.props.theme} />
      <DatePickerMMYYList date={state.get("cur")} mmyy={state.get("mmyy")} color={this.props.color} trigger={2} handler={this.chooseMMYY.bind(this)} minDate={minDate} maxDate={maxDate} theme={this.props.theme} />

      <div style={h.assignPseudos(styles.table,mmyyIsOn)}>
        <div style={styles.thRow}>
          {
          head.map( (day,n) => {
            return <p style={styles.th} key={n}><span style={styles.day}>{day}</span></p>
          })
          }
        </div>
        {
        calendar.map( (week,n) => {
          let lastNull
          if (!n)
            _.every(week, (ld,ln) => {
              let test = ld===null
              if (test)
                lastNull = ln
              return test
            })

          return <div style={h.assignPseudos(styles.tdRow, n)} key={n}>
            {
            week.map( (day,nn) => {
              let cssState = lastNull===nn ? ":lastOfType" : ""
              let dayStyle = h.assignPseudos(day!==null ? styles.td : styles.fill, nn, colCount, cssState)
              let dayInnerStyle = styles.day

              let thisDay = year+month+h.leftPad(day,"00")
              let handler = this.chooseDate.bind(this, year, month, h.leftPad(day,"00"))

              // Set State
              if (selDate==thisDay)
                dayInnerStyle = Object.assign({},dayInnerStyle, styles.selected)
              else if (today==thisDay)
                dayInnerStyle = Object.assign({},dayInnerStyle, styles.today)

              // Set Disabled
              if (typeof maxDay!=="undefined" && Number(maxDay) < Number(day)) {
                dayInnerStyle = Object.assign({},dayInnerStyle, styles.disabled)
                handler = null
              }

              if (typeof minDay!=="undefined" && Number(minDay) > Number(day)) {
                dayInnerStyle = Object.assign({},dayInnerStyle, styles.disabled)
                handler = null
              }

              return <p onClick={handler} style={dayStyle} key={nn}><span style={dayInnerStyle}>{day}</span></p>
            })
            }
          </div>
        })
        }
      </div>
    </div>
  }
  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {

    /**
     * NOTE: Using <div> instead of <table> in render.
     * so that table will behave normally even inside FlexBox.
     */

    let fontSize = RC.Theme.font.size-3

    if (typeof this.lineColor === "undefined" || np.lineColor!=this.props.lineColor)
      this.lineColor = np.lineColor
        ? h.getRealColor(np.lineColor, "edgesDarker", null, true)
        : RC.Theme.color.edgesDarker

    if (typeof this.selectedBgColor === "undefined" || np.selectedBgColor!=this.props.selectedBgColor)
      this.selectedBgColor = np.selectedBgColor
        ? h.getRealColor(np.selectedBgColor, "yellow", null, true)
        : "#FF5"

    if (typeof this.selectedColor === "undefined" || np.selectedColor!=this.props.selectedColor)
      this.selectedColor = np.selectedColor
        ? h.getRealColor(np.selectedColor, "yellow", null, true)
        : RC.Theme.color.text

    // Table
    let row = { display: "flex", width: "100%" }
    let col = {
      width: `${100/7}%`, minWidth: 37, // Equates to 273px minimum
      fontSize: fontSize, lineHeight: 1,
      padding: 0
    }

    // Arrows
    let arrowContainer = {
      cursor: "pointer",
      width: 24, height: 24, padding: 0, margin: 0,
      position: "absolute", top: 7,
      borderRadius: 12,
      background: "rgba(0,0,0,.1)",
      transition: tn, opacity: 1,
      transform: "translate(0,0)"
    }
    let arrow = {
      width: 0, height: 0,
      position: "absolute", top: "50%", left: "50%",
      borderTop: "4px solid transparent", borderBottom: "4px solid transparent"
    }

    return {
      area: Object.assign({}, RC.cssMixins.font("light"), {
        position: "relative",
        maxWidth: np.maxWidth || "none", margin: "0 auto",
        color: this.color.get("textColor")
      }),
      // General
      table: {
        padding: 0, margin: 0, border: "none",
        background: this.color.get("hex"),
        opacity: 1,
        zIndex: 10,
        transition: tn,
        ":on": {
          opacity: .4,
          zIndex: 1
        }
      },
      // Month Nav
      month: {
        position: "relative", padding: 8,
        fontSize: fontSize+3, textAlign: "center",
        opacity: ns.mmyy ? .25 : 1,
        zIndex: ns.mmyy ? 1 : 10,
      },
      left: Object.assign({},arrowContainer,{
        left: `${100/48}%`,
        ":on": {
          opacity: 0, transform: "translate(-10px,0)"
        }
      }),
      right: Object.assign({},arrowContainer,{
        right: `${100/48}%`,
        ":on": {
          opacity: 0, transform: "translate(10px,0)"
        }
      }),
      leftArrow: Object.assign({},arrow,{
        margin: "-4px 0 0 -3px",
        borderRight: `solid 5px ${this.color.get("textColor")}`
      }),
      rightArrow: Object.assign({},arrow,{
        margin: "-4px 0 0 -2px",
        borderLeft: `solid 5px ${this.color.get("textColor")}`
      }),

      // THead
      thRow: Object.assign({}, RC.cssMixins.font("bold"), row, {
        background: "rgba(0,0,0,.2)",
        textAlign: "center"
      }),
      th: col,

      // TBody
      tdRow: Object.assign({}, row,{
        borderTop: `solid 1px ${this.lineColor}`,
        ":firstChild": {
          borderTop: "none"
        }
      }),
      td: Object.assign({}, col, {
        cursor: "pointer",
        borderRight: `solid 1px ${this.lineColor}`,
        ":lastChild": {
          borderRight: "none"
        },
        textAlign: "center",
      }),
      fill: Object.assign({}, col, {
        ":lastOfType": {
          borderRight: `solid 1px ${this.lineColor}`
        },
      }),

      // States
      day: {
        display: "block", padding: "8px 4px",
        transition: tn
      },
      selected: {
        background: this.selectedBgColor, color: this.selectedColor
      },
      today: {
        background: "rgba(0,0,0,.2)"
      },
      disabled: {
        opacity: .4, cursor: "default"
      },
    }
  }
  themeStyles() {
    const fontSize = RC.Theme.font.size-3
    let themes = {
      inline: {
        area: {
          display: "inline-block", margin: "20px 10px"
        }
      }
    }

    if (RC.MQ.device >= 1)
      themes.full = {
        table: {
          width: 300
        },
        th: { fontSize: fontSize+2 },
        td: { fontSize: fontSize+2 },
        month: { fontSize: fontSize+5 },
        day: { padding: "10px 4px" }
      }
    return themes
  }
}

RC.DatePicker.propTypes = Object.assign({}, RC.DatePicker.propTypes, {
  date: React.PropTypes.object,
  minDate: React.PropTypes.object,
  maxDate: React.PropTypes.object,
  onChange: React.PropTypes.func,
})



/**
 * MMYY List
 * Private React element, not meant to be used outside the DatePicker.
 */

const DatePickerMMYYList = class extends RC.CSS {
  constructor(p) {
    super(p)
    this.defBgColor = "edgesLighter"
    this.state = {
      obj: Immutable.Map({
        isFinishedAnimating: false
      })
    }
  }
  shouldComponentUpdate() {
    console.log("test")
    return true
  }
  componentWillUpdate(np,ns){
    super.componentWillUpdate(np,ns)
    if (np.trigger===np.mmyy && !this.state.obj.get("isFinishedAnimating"))
      this.setStateObj({
        isFinishedAnimating: true
      })
  }
  handler(val) {
    if (this.props.mmyy) {
      let isYear = this.props.trigger===2
      let m = this.props.date
      let newDate = isYear
        ? `${val}-${m.format("MM")}-15`
        : `${m.format("YYYY")}-${h.leftPad(val+1,"00")}-15`

      this.props.handler(newDate)
      Meteor.setTimeout( () => {
        this.setStateObj({
          isFinishedAnimating: false
        })
      },250)
    }
  }
  render() {
    const state = this.state.obj
    const styles = this.css.get("styles")
    const isYear = this.props.trigger===2

    // Months in words, so I don't have to do a moment().format() 12 times
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    let list, cur, min, max

    let minYear = this.props.minDate.format("YYYY")
    let maxYear = this.props.maxDate.format("YYYY")
    let curYear = this.props.date.format("YYYY")

    if (isYear) {
      list = _.range(Number(minYear), Number(maxYear)+1)
      cur = curYear
    } else {
      let mStart = curYear==minYear
      ? this.props.minDate.format("M")-1
      : 0
      let mEnd = curYear==maxYear
      ? this.props.maxDate.format("M")
      : 12

      list = _.range(mStart, mEnd)
      cur = this.props.date.format("M")-1
    }

    let cssStates = []
    if (this.props.trigger===this.props.mmyy) {
      cssStates.push(":on")
      if (state.get("isFinishedAnimating")) cssStates.push(":visible")
    }
    return <div style={h.assignPseudos(styles.mmyy, cssStates)}>
      {
      list.map( (d,n) => {
        let choice = isYear ? d : months[d]
        let cssState = cur==d ? ":clicked" : null
        return <p style={h.assignPseudos(styles.mmyyItem, n, list.length, cssState)} onClick={this.handler.bind(this,d)} key={n}>{choice}</p>
      })
      }
    </div>
  }
  // @@@@
  // @@@@
  // Styles
  // @@@@
  // @@@@
  baseStyles(np,ns) {
    return {
      mmyy: {
        width: 120, height: 219, margin: "0 0 0 1000px",
        position: "absolute", left: "50%", top: 4,
        border: `solid 1px ${this.color.get("textColor")}`, background: "rgba(0,0,0,.35)",
        textAlign: "center",
        transition: tnOpacity,
        opacity: 0, zIndex: 1,
        visibility: "hidden",
        overflowY: "auto", overflowX: "hidden",
        ":on": {
          opacity: 1, zIndex: 10
        },
        ":visible": {
          visibility: "visible",
          margin: "0 0 0 -60px"
        }
      },
      mmyyItem: {
        padding: "3px 0 5px",
        borderTop: `solid 1px ${this.color.get("textColor")}`,
        ":firstChild": {
          borderTop: "none",
        },
        ":clicked": {
          background: this.color.get("textColor"), color: this.color.get("isDark") ? "#222" : "#FFF"
        }
      }
    }
  }
  themeStyles() {
    let themes = {}
    let fontSize = RC.Theme.font.size
    if (RC.MQ.device >= 1)
      themes.full = {
        mmyy: { height: 249 },
        mmyyItem: { fontSize: fontSize+2 },
      }
    return themes
  }
}
