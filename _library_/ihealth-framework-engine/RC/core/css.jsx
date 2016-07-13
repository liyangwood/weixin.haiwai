"use strict"

/**
 * CSS in JS - React Class
 * @author iHealth Labs
 * @author Jason Lee
 * @desc allows easy way to define inline styles, provides SCU for CSS and theme support.
 *
 * This class provides two Immutable variables.
 * 1. this.css (this.css.styles), computed CSS and necessary variables that's reused in every SCU.
 * 2. this.color, helpful information on the colors (bgColor/color props) passed to this React component.
 */
RC.CSS = class extends React.Component {
  // @@@@
  // @@@@
  // React Lifecycle
  // @@@@
  // @@@@
  componentWillMount() {
    // NOTE: The code inside here cannot be in constructor. Leave it here.
    // Define Immutable Color -- *think getInitialStates()
    this.color = Immutable.Map({
      scuProps: _.pick(this.props, (this.useUIKeys ? ["uiBgColor","uiColor"] : ["bgColor","color"])), // SCU uses this object to compare props
      hex: "#FFF", // Real color hex code provided by the "bgColor" prop (If no prop was passed, it will default to this.defBgColor)
      realHex: "transparent", // Real color hex code provided by the "bgColor" prop (If no prop was passed, it will default to "transparent")
      textColor: RC.Theme.color.textColor, // Text color that's meant to go together with bgColor (Will default to the result of isDark if none is set)
      realText: RC.Theme.color.textColor,
      isDark: false, // Is background color dark?
    })

    // Define watched props
    let baseStyles = this.getBaseStyles(this.props, this.state, true)
    let propKeys = Object.keys(baseStyles).map( (k) => { return k+"Style" })
    propKeys = propKeys.concat(["style","theme","color","bgColor","uiClass","uiColor","uiBgColor","uiSize"])
    if (this.watchProps) propKeys = propKeys.concat(this.watchProps)

    // Define watched states
    let stateKeys = this.watchStates || []

    // Define Immutable CSS -- *think getInitialStates()
    let css = Immutable.Map({
      watchProps: propKeys, // This is the "real" watched props
      watchStates: stateKeys, // This is the "real" watched states
      scuProps: _.pick(this.props, propKeys), // SCU uses this object to compare props
      scuStates: this.pickSCUStates(this.state,stateKeys),
      themes: _.isArray(this.props.theme) ? this.props.theme : (this.props.theme ? [this.props.theme] : []), // Array of themes passed by prop
      styles: {}, // Final computed styles
    })

    this.color = this.getColor(this.color)
    this.css = this.getCSS(css)
  }
  componentWillUpdate(np,ns) {
    if (this.shouldColorUpdate(np,ns))
      this.color = this.getColor(this.color,np,ns)
    if (this.shouldCSSUpdate(np,ns))
      this.css = this.getCSS(this.css,np,ns)
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  // @@@@
  // @@@@
  // Re-Used Basic Utility
  // @@@@
  // @@@@
  getBaseStyles( props, states, doNotAutoprefix ) {
    let baseStyles = _.isFunction(this.baseStyles) ? this.baseStyles(props,states) : (typeof this.baseStyles==="object" ? this.baseStyles : {})
    if (!doNotAutoprefix && !this.doNotAutoprefix) baseStyles = autoprefix(baseStyles, true)
    return baseStyles
  }
  getThemeStyles( props, states, doNotAutoprefix ) {
    let themeStyles = _.isFunction(this.themeStyles) ? this.themeStyles(props,states) : (typeof this.themeStyles==="object" ? this.themeStyles : {})
    if (!doNotAutoprefix && !this.doNotAutoprefix) themeStyles = autoprefix(themeStyles, true)
    return themeStyles
  }
  // @@@@
  // @@@@
  // SCU
  // @@@@
  // @@@@
  shouldComponentUpdate(np,ns) {
    // By default, we use a deep comparison of props and a shallow for state (immutable)
    return !_.isEqual(this.props, np) || !shallowEqual(this.state, ns);

    // React PureRender, not in use
    //return shallowCompare(this, np, ns);
  }
  shouldColorUpdate(np,ns) {
    let scuProps = _.pick(np, (this.useUIKeys ? ["uiBgColor","uiColor"] : ["bgColor","color"]))
    let propsTest = !_.isEqual( scuProps, this.color.get("scuProps") )

    if (propsTest) this.color = this.color.set("scuProps", scuProps)

    return propsTest
  }
  shouldCSSUpdate(np,ns) {
    let scuProps = _.pick(np, this.css.get("watchProps"))
    let scuStates = this.pickSCUStates(ns,this.css.get("watchStates"))
    let propsTest = !_.isEqual( scuProps, this.css.get("scuProps") )
    // let statesTest = !_.isEqual( scuStates, this.css.get("scuStates") )

    let statesTest = !scuStates.equals(this.css.get("scuStates"))

    if (propsTest) this.css = this.css.set("scuProps", scuProps)
    if (statesTest) this.css = this.css.set("scuStates", scuStates)

    return propsTest || statesTest
  }
  pickSCUStates(ns,watchStates) {
    if (ns && ns.obj && Immutable.Iterable.isIterable(ns.obj)) {
    // console.log( ns.obj.filter( (v,k) => {
    //   return _.contains(watchStates, k)
    // }) )
      return ns.obj.filter( (v,k) => {
      	return _.contains(watchStates, k)
      })
    } else
      return Immutable.Map(_.pick(ns, watchStates))
  }
  // @@@@
  // @@@@
  // Compute
  // @@@@
  // @@@@
  getColor(color,props,states) {
    // console.log("Color Updated")
    if (typeof props==="undefined") props = this.props
    if (typeof states==="undefined") states = this.state

    let defBgColor = _.isFunction(this.defBgColor) ? this.defBgColor(props,states) : (this.defBgColor || "white") // Always defaults to white unless otherwise specified
    let colorKeys = this.useUIKeys ? ["uiBgColor","uiColor"] : ["bgColor","color"]
    let newColor = h.getBasicColor( props[colorKeys[0]], defBgColor, props[colorKeys[1]] , this.constructor.displayName==="RC.Loading")

    return color.merge(newColor)
  }
  getCSS(CSS,props,states) {
    // console.log("CSS Updated")
    if (typeof props==="undefined") props = this.props
    if (typeof states==="undefined") states = this.state

    let styles = this.getBaseStyles(props,states)
    const themeList = _.isArray(props.theme) ? props.theme : (props.theme ? [props.theme] : [])
    const themeStyles = themeList.length ? this.getThemeStyles(props,states) : false

    CSS = CSS.set("themes", themeList)

    let propStyleKeys = Object.keys(styles).map( (k) => { return k+"Style" }).concat("style")

    // Extend each theme
    if (themeList.length && themeStyles) {
      themeList.map( (name) => {
        if (themeStyles[name])
          Object.keys(themeStyles[name]).map( (t) => {
            if (styles[t]) Object.assign( styles[t], themeStyles[name][t] )
            else styles[t] = themeStyles[name][t]
          })
      })
    }

    // Extend each inline style passed by props
    propStyleKeys.map( (key) => {
      let realKey = key=="style"
        ? (styles.hasOwnProperty("area") ? "area" : "item")
        : key.substr(0,key.length-5)

      if (typeof props[key]==="object" && styles[realKey])
        Object.assign(styles[realKey], autoprefix(props[key], true))
    })

    return CSS.set("styles", styles)
  }

  // Can (and likely should) be overwritten in extended components
  renderChildren() {
    return this.props.children
  }

  /**
   * @summary set or update states as Immutable object created by:
   * this.state = {
   *   obj: Immutable.Map({
   *     stateOne: "xxx",
   *     stateTwo: "xxx"
   *   })
   * }
   *
   * @param obj = {
   *   foo: "new_foo_value",         // set new value
   *   bar: value => value + 1,      // update
   * }
   *
   */
  setStateObj(obj) {
    let stateObj = this.state.obj;
    let newState = stateObj.withMutations( ctx => {
      Object.keys(obj).reduce((m, key) => {
        if (!stateObj.has(key)) console.warn(`State '${key}' is not initialized. Please make sure you are setting the right state`);

        let updater = _.isFunction(obj[key]) ? obj[key] : v => obj[key];
        ctx.update(key, updater)
      }, undefined)
    });
    this.setState( {obj: newState} )
  }
}

// Common propTypes

RC.CSS.displayName = "RC.CSS"
RC.CSS.propTypes = {
  color: React.PropTypes.string,
  bgColor: React.PropTypes.string,

  theme: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  id: React.PropTypes.string,
}


/**
 * Facebook PureRenderMixin for React
 * Source: https://github.com/francoislaberge/pure-render-mixin
 *
 * With some modifications
 */


/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 * @providesModule shallowCompare
 */


/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

/**
 * Does a shallow comparison for props and state.
 * See ReactComponentWithPureRenderMixin
 */
function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}
