/* ECMAScript 6 Polyfill */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

Date.prototype.addDays = function(days){
  if (typeof days !== 'number') return this;

  let d = new Date(this.valueOf());
  d.setDate(d.getDate() + days);
  return d;
};
Date.prototype.addHours = function (hours) {
  if (typeof hours !== 'number') return this;

  let d = new Date(this.valueOf());
  d.setHours(d.getHours() + hours);
  return d
};

/**
 * Helper Functions for both Client & Server
 */
h = {
  leftPad: function(str, pad){
    str = String(str)
    pad = String(pad)
    return pad.substring(0, pad.length - str.length) + str
  },
  ltrim: function(str){
    return str.replace(/^\s+/,"")
  },
  rtrim: function(str){
    return str.replace(/\s+$/,"")
  },
  time_format: function(time, return_full){
    var read = moment(time).format("h:mm a")
    if (!return_full) return read

    return {
      time: read,

      // TODO:
      // Replace days_past with "past" and add W/D/Y in a differnet key
      days_past: moment().diff( moment(time), "days")
    }
  },
  nk: function(object, key) {
		if( !_.isString(key)) return false

		var key = key.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
		key = key.replace(/^\./, '') // strip a leading dot

		if (key.indexOf('.')<=0)
			return object[ key] || null

		var split = key.split('.')
		while (split.length) {
			var n = split.shift()
			if (_.isObject(object) && n in object)
				object = object[n]
			else
				return null
		}
    return object
	},
  uniqueKey: function(len){
		var do_rand = function(){
			return (0|Math.random()*9e6).toString(36)
		}

		if(isNaN(len))
			return do_rand()

		var rand = ''
		for( var i = Math.floor(len/4); i>=0; i-- ){
			rand += do_rand()
		}
		return rand.substr(0,len)
	},
  to_read: function(str) {
    if (!_.isString(str)) return
    return str.toLowerCase().trim().replace(/ /g, "-")
  },
  capitalize: function(str) {
    return str && str.charAt(0).toUpperCase() + str.substring(1)
  },
  filterUndefined: function(arr){
    return _.filter(arr, function(a){
      return !_.isUndefined(a)
    })
  },
  getDataID: function(dataId){
    if (!_.isString(dataId)) return dataId

    return dataId.startsWith('ObjectID') ? new Mongo.ObjectID(dataId.split('"')[1]) : dataId
  }
}

if (Meteor.isClient){
  // ##
  // Client Only Helper Functions

  /**
   * Return current platform.
   * Or return boolean if checking to see if platform matches.
   */
  h.getPlatform = function(test) {
    let platform;
    if (Meteor.isCordova && typeof device==="undefined") {
      console.error('h.getPlatform needs to be after Meteor.startup. device not available. assuming platform is web')
      platform = "web";
    } else
      platform = (Meteor.isCordova && device.platform ? device.platform : "web").toLowerCase()

    return test ? platform==test : platform;
  }
  /**
   * Get all the device informations from Session
   */
  h.getDevices = function(type){
    var devices = Session.get("devices") || { bluetooth: false }
    return type ? devices[type] : devices
  }
  /**
   * Save device informations to Session
   */
  h.saveDevices = function(session, connected){
    var cur = Session.get("devices") || { bluetooth: false }
    var compare = _.clone(cur)

    if (!_.isObject(session)) session = {}
    if (connected) session.bluetooth = true
    _.extend(cur,session)

    if (!_.isEqual(compare,cur))
      Session.set("devices", cur) // Cur is Extended
  }
	/*
	 * Wait until a condition returns true before doing a function.
	 * @check = A function that determines whether the check interval should continue
	 * @completeFunc = Function to run after check is true
	 * @delay = Delay between each check interval
	 * @timeout = Give up after this timeout duration if check still fails
	 */
	h.wait_for = function(check, completeFunc, delay, timeout) {
		// if the check returns true, execute onComplete immediately
		if (check()) {
		  completeFunc()
		  return
		}
		var onComplete = function(){
			Meteor.setTimeout( function(){
				completeFunc()
			},100)
		}
		if (!delay) delay=100
		var count = 1 // This incremends every loop, creating a longer interval periods in case something went wrong
		var intervalPointer = null

		// if after timeout milliseconds function doesn't return true, abort
		var timeoutPointer = timeout ?
			Meteor.setTimeout(function() {
			  Meteor.clearTimeout(intervalPointer)
			}, timeout) : null

		var interval_func = function() {
			if (!check())
				intervalPointer = Meteor.setTimeout(interval_func, delay)
			else {
				// if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
				if (timeoutPointer) Meteor.clearTimeout(timeoutPointer)
				onComplete()
			}
		}
		intervalPointer = Meteor.setTimeout(interval_func, delay)
	}
  h.returnComponent = function(tmpl, props){
    if (!React) return null
    var props = _.isObject(props) ? props : null
    if (_.isObject(tmpl)) {
      if (props)
        return React.cloneElement(tmpl, props)
      return tmpl
    } else if (_.isString(tmpl) && window[tmpl])
      return React.createElement(window[tmpl], props)
    else if (RC)
      return React.createElement(RC.NotFound)
  }
  h.serializeForm = function(form){
		var formData = _.map($(form).serializeArray(), function(data) {
      const name = _.isString(data.name) ? data.name.trim() : data.name
      const value = _.isString(data.value) ? data.value.trim() : data.value
			return [name, value]
		})
		return _.object(formData)
	}
  h.getDomPos = function(el, args){
    var defs = {
      reverse: false,
      xOffset: 0,
      yOffset: 0,
    }
    if (_.isObject(args)) _.defaults(args, defs); else args = defs;

    var pos = el.getBoundingClientRect()

    if (args.reverse) {
      pos.x = window.innerWidth - pos.left - pos.width - args.xOffset
      pos.y = window.innerHeight - pos.top - args.yOffset
    } else {
      pos.x = pos.left + pos.width + args.xOffset
      pos.y = pos.top + args.yOffset
    }

    return pos
  }
  h.strToArray = function(str){
    if (typeof str!=="string")
      return str || []
    return _.filter( str.replace(/,/g, " ").split(" "), function(t){
      return t.length
    })
  }
  h.numberFormat = function(num, decimals){

    if (isNaN(num) && num!==null)
      return num // If string, just return

    if (decimals && _.isNumber(decimals)) {
      let point = 1
      for (decimals ; decimals>0 ; decimals--) {
        point = point*10
      }
      num = Math.round(num*point)/point
    } else
      num = Math.round(num)
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  h.setStateIfMounted = (self, state) => {
    if (self.isMounted())
      self.setState(state)
  }
}


if (Meteor.isServer){
  // ##
  // Server Only Helper Functions
}
