import React from 'react';
import Immutable from 'immutable';
import autoprefix from './autoprefix.jsx';
import {_} from 'meteor/kg:base';
let RC = {};

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
			realHex: "transparent" // Real color hex code provided by the "bgColor" prop (If no prop was passed, it will default to "transparent")

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
		return color;
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


RC.MeteorData = class extends React.Component {
	componentWillMount() {
		this.data = {}

		this._meteorDataManager = new MeteorDataManager(this)
		var newData = this._meteorDataManager.calculateData()
		this._meteorDataManager.updateData(newData)
	}
	componentWillUpdate(nextProps, nextState) {
		var saveProps = this.props
		var saveState = this.state
		var newData = undefined
		try {
			// Temporarily assign this.state and this.props,
			// so that they are seen by getMeteorData!
			// This is a simulation of how the proposed Observe API
			// for React will work, which calls observe() after
			// componentWillUpdate and after props and state are
			// updated, but before render() is called.
			// See https://github.com/facebook/react/issues/3398.
			this.props = nextProps
			this.state = nextState
			newData = this._meteorDataManager.calculateData()
		} finally {
			this.props = saveProps
			this.state = saveState
		}

		this._meteorDataManager.updateData(newData)
	}
	componentWillUnmount() {
		this._meteorDataManager.dispose()
	}
}

RC.CSSMeteorData = class extends RC.CSS {
	componentWillMount() {
		super.componentWillMount()

		this.data = {}

		this._meteorDataManager = new MeteorDataManager(this)
		var newData = this._meteorDataManager.calculateData()
		this._meteorDataManager.updateData(newData)
	}
	componentWillUpdate(nextProps, nextState) {
		super.componentWillUpdate(nextProps, nextState)

		var saveProps = this.props
		var saveState = this.state
		var newData = undefined
		try {
			// Temporarily assign this.state and this.props,
			// so that they are seen by getMeteorData!
			// This is a simulation of how the proposed Observe API
			// for React will work, which calls observe() after
			// componentWillUpdate and after props and state are
			// updated, but before render() is called.
			// See https://github.com/facebook/react/issues/3398.
			this.props = nextProps
			this.state = nextState
			newData = this._meteorDataManager.calculateData()
		} finally {
			this.props = saveProps
			this.state = saveState
		}

		this._meteorDataManager.updateData(newData)
	}
	componentWillUnmount() {
		super.componentWillUnmount()
		this._meteorDataManager.dispose()
	}
}

class MeteorDataManager {
	constructor(component) {
		this.component = component;
		this.computation = null;
		this.oldData = null;
	}

	dispose() {
		if (this.computation) {
			this.computation.stop();
			this.computation = null;
		}
	}

	calculateData() {
		const component = this.component;
		const {props, state} = component;

		if (! component.getMeteorData) {
			return null;
		}

		// When rendering on the server, we don't want to use the Tracker.
		// We only do the first rendering on the server so we can get the data right away
		if (Meteor.isServer) {
			return component.getMeteorData();
		}

		if (this.computation) {
			this.computation.stop();
			this.computation = null;
		}

		let data;
		// Use Tracker.nonreactive in case we are inside a Tracker Computation.
		// This can happen if someone calls `ReactDOM.render` inside a Computation.
		// In that case, we want to opt out of the normal behavior of nested
		// Computations, where if the outer one is invalidated or stopped,
		// it stops the inner one.
		this.computation = Tracker.nonreactive(() => {
			return Tracker.autorun((c) => {
				if (c.firstRun) {
					const savedSetState = component.setState;
					try {
						component.setState = () => {
							throw new Error(
								"Can't call `setState` inside `getMeteorData` as this could cause an endless" +
								" loop. To respond to Meteor data changing, consider making this component" +
								" a \"wrapper component\" that only fetches data and passes it in as props to" +
								" a child component. Then you can use `componentWillReceiveProps` in that" +
								" child component.");
						};

						data = component.getMeteorData();
					} finally {
						component.setState = savedSetState;
					}
				} else {
					// Stop this computation instead of using the re-run.
					// We use a brand-new autorun for each call to getMeteorData
					// to capture dependencies on any reactive data sources that
					// are accessed.  The reason we can't use a single autorun
					// for the lifetime of the component is that Tracker only
					// re-runs autoruns at flush time, while we need to be able to
					// re-call getMeteorData synchronously whenever we want, e.g.
					// from componentWillUpdate.
					c.stop();
					// Calling forceUpdate() triggers componentWillUpdate which
					// recalculates getMeteorData() and re-renders the component.
					component.forceUpdate();
				}
			});
		});

		if (Package.mongo && Package.mongo.Mongo) {
			Object.keys(data).forEach(function (key) {
				if (data[key] instanceof Package.mongo.Mongo.Cursor) {
					console.warn(
						"Warning: you are returning a Mongo cursor from getMeteorData. This value " +
						"will not be reactive. You probably want to call `.fetch()` on the cursor " +
						"before returning it.");
				}
			});
		}

		return data;
	}

	updateData(newData) {
		const component = this.component;
		const oldData = this.oldData;

		if (! (newData && (typeof newData) === 'object')) {
			throw new Error("Expected object returned from getMeteorData");
		}
		// update componentData in place based on newData
		for (let key in newData) {
			component.data[key] = newData[key];
		}
		// if there is oldData (which is every time this method is called
		// except the first), delete keys in newData that aren't in
		// oldData.  don't interfere with other keys, in case we are
		// co-existing with something else that writes to a component's
		// this.data.
		if (oldData) {
			for (let key in oldData) {
				if (!(key in newData)) {
					delete component.data[key];
				}
			}
		}
		this.oldData = newData;
	}
}

export default RC;