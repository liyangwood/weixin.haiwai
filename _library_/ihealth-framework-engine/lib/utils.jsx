"use strict"

if (!h) h = {}

h.getDateFromProps = (date, format, defaultFormat) => {
  if (!_.isDate(date)) return date
  let dateFormat = format || defaultFormat || "MM/DD/YY"
  if (_.isDate(date)) {
    date = moment(date)
    date = dateFormat=="ago" ? date.fromNow(true) : date.format(dateFormat)
  }
  return date
}

h.getChildrenLength = (children) => {
  if (!_.isArray(children)) return children ? 1 : 0
  return children.length
}

h.renderWithFunction = (children, func) => {
  if (_.isArray(children))
    return children.map( (group,n) => {
      return func(group,n)
    })
  else if (children)
    return func(children,0)
  return null
}

h.cloneElement = (elements, props) => {
  if (typeof props!=="object") props = {}
  if (React.isValidElement(elements))
    return React.cloneElement(elements, props)
  else if (_.isArray(elements))
    return elements.map( (c,n) => {
      if (React.isValidElement(c)) {
        props.key = n
        return React.cloneElement(c, _.omit(props, _.keys(c.props)))
      } else
        return c
    })
  else
    return elements
}

h.uniformChildren = function(unfilteredChildren, filter) {
  if (!unfilteredChildren) return []
  let children = !unfilteredChildren.map ? [unfilteredChildren] : unfilteredChildren

  children = children.map( function(c) {
    if (_.isString(c))
      return <div>{c}</div>
    return c
  })

  return _.filter(children.map( function(c,n){
    if (_.isObject(c)) {
      if (_.isString(c.type)) {
        if (filter && filter!=c.type) {
          console.warn(`<${c.type} /> DOM Element was rejected because it did not pass the name filter (${filter}).`)
          return undefined
        }
        return c
      } else if (c.type.displayName) {
        if (filter && filter!=c.type.displayName) {
          console.warn(`${c.type.displayName} was rejected because it did not pass the name filter (${filter}).`)
          return undefined
        }
      }
      return c
    }
  }), function(c){
    return !_.isUndefined(c)
  })
}

/**
 * Take the necessary props and split it into an array
 */
h.splitProps = function(props, allowedKeys, requiredKey, maxLen) {
  var pickedProps = _.pick(props, allowedKeys)
  if (!pickedProps.uiClass) return []

  let propKeys = _.keys(pickedProps)

  // Map the classes
  _.map( propKeys, function(ui){
    pickedProps[ui] = _.filter( _.map( String(pickedProps[ui]).split(","), function(u){
      return u.trim()
    }), function(u){
      return u.length
    }).slice(0,maxLen)
  })

  let loopLength = pickedProps[requiredKey].length

  var uiMap = []
  for (var i=0 ; i < loopLength ; i++) {
    uiMap.push(_.object(_.map(propKeys, function(key){
      return [key, (pickedProps[key][i] || _.last(pickedProps[key]))]
    })))
  }

  return uiMap
}
/**
 * Check if the children prop is a String
 */
h.checkIfString = function(children) {
  if (_.isString(children)) return true
  return _.every(children, function(c){
    return _.isString(c) || (_.isObject(c) &&
      (
      _.contains(["span","i","em","strong","b"], c.type)
      || _.contains(["uiIcon"], h.nk(c, "type.displayName"))
      ))
  })
}

h.timeAgo = function(date, showSeconds) {

  let seconds = Math.floor((new Date() - date) / 1000)
  let interval = Math.floor(seconds / 31536000)

  let pluralize = function(num, word){
    if (num===1)
      return word
    else
      return `${word}s`
  }

  if (interval >= 1)
    return interval + ` ${pluralize(interval, "year")} ago`
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1)
    return interval + ` ${pluralize(interval, "month")} ago`
  interval = Math.floor(seconds / 86400)
  if (interval >= 1)
    return interval + ` ${pluralize(interval, "day")} ago`
  interval = Math.floor(seconds / 3600)
  if (interval >= 1)
    return interval + ` ${pluralize(interval, "hour")} ago`
  interval = Math.floor(seconds / 60)
  if (interval >= 1)
    return interval + ` ${pluralize(interval, "minute")} ago`
  if (showSeconds)
    return Math.floor(seconds) + " seconds ago"
  return "less than 1 minute ago"
}


/**
 * Get Basic attributes from Color
 */
h.getBasicColor = function(val, def, textVal) {
  let bg = h.getRealColor(val, def, RC.Theme.color.light)
  let isDark = bg.color.darken(5).isDark()
  let text = h.getRealColor(textVal, "on"+h.capitalize(String(bg.valid ? val : def)), isDark ? RC.Theme.color.textOnLight : RC.Theme.color.text, false)
  let realHex = val ? bg.hex : "transparent"

  return {
    hex: bg.hex,
    realHex: realHex,
    isDark: isDark,
    textColor: text.hex,
    realText: realHex=="transparent" ? "inherit" : text.hex,
  }
}
h.getRealColor = function(cVal, dVal, fVal, returnHexOnly) {
  var color, hex, dColor
  var wasValid = true
  if (!RC.Theme.color[cVal]) {
    color = new tinycolor(cVal)

    if (!color.isValid()) {
      wasValid = false
      // hex = dVal ? (RC.Theme.color[dVal] || fVal) : fVal
      if (RC.Theme.color[dVal])
        hex = RC.Theme.color[dVal]
      else {
        if (typeof dVal==="string" && dVal.substr(0,6).toLowerCase()==="onrgba") {
          hex = fVal
        } else {
          dColor = new tinycolor(dVal)
          hex = dColor.isValid() ? dVal : fVal
        }
      }

      if (!returnHexOnly) color = dColor && dColor.isValid() ? dColor : new tinycolor(hex)
    } else
      hex = cVal
  } else {
    hex = RC.Theme.color[cVal]
    if (!returnHexOnly){ color = new tinycolor(hex) }
  }

  if (!hex)
    hex = ""

  return returnHexOnly ? hex: { hex: hex, color: color, valid: wasValid }
}
h.assignPseudos = function(css, n, length, state) {
  if (typeof state=="undefined" && (_.isArray(n) || typeof n=="string" || n===true)) state = n

  const pseudos = _.filter( Object.keys(css), (v) => {
    return v.charAt(0)===":"
  })

  let find = (state===true)
    ? [":on"]
    : _.filter((_.isArray(state) ? state : [state]), (val) => {
      return _.contains(pseudos, val)
    })

  if (!isNaN(n) && n!==null) {
    if (n++===0)
      find.push(":firstChild")
    if (n===length)
      find.push(":lastChild")
    find.push(`:nth-child(${n})`)
  }

  const pseudoStyles = _.pick(css, find)
  let style = _.omit(css, pseudos)

  Object.keys(pseudoStyles).map( (key) => {
    Object.assign( style, pseudoStyles[key])
  })

  return style
}
