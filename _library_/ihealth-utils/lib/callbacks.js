/*
  Ref: Telescope.callbacks [ https://github.com/TelescopeJS/Telescope ]
  TODO: organize and customize; will move to a separate package
 */

/*
Callback hooks provide an easy way to add extra steps to common operations.
@namespace IH.Callbacks
 */

/*
Add a callback function to a hook
@param {String} hook - The name of the hook
@param {Function} callback - The callback function
 */

IH.Callbacks.Add = function(hook, callback) {
  if (typeof IH.Callbacks[hook] === "undefined") {
    IH.Callbacks[hook] = [];
  }
  return IH.Callbacks[hook].push(callback);
};


/*
Remove a callback from a hook
@param {string} hook - The name of the hook
@param {string} functionName - The name of the function to remove
 */

IH.Callbacks.Remove = function(hookName, callbackName) {
  return IH.Callbacks[hookName] = _.reject(IH.Callbacks[hookName], function(callback) {
    return callback.name === callbackName;
  });
};


/*
Successively run all of a hook's callbacks on an item
@param {String} hook - The name of the hook
@param {Object} item - The post, comment, modifier, etc. on which to run the callbacks
@param {Object} [constant] - An optional constant that will be passed along to each callback
@returns {Object} Returns the item after it's been through all the callbacks for this hook
 */

IH.Callbacks.Run = function(hook, item, constant) {
  var callbacks = IH.Callbacks[hook];
  if (typeof callbacks !== "undefined" && !!callbacks.length) {
    return callbacks.reduce((function(result, callback) {
      return callback(result, constant);
    }), item);
  } else {
    return item;
  }
};


/*
Successively run all of a hook's callbacks on an item, in async mode (only works on server)
@param {String} hook - The name of the hook
@param {Object} item - The post, comment, modifier, etc. on which to run the callbacks
@param {Object} [constant] - An optional constant that will be passed along to each callback
 */

IH.Callbacks.RunAsync = function(hook, item, constant) {
  var callbacks = IH.Callbacks[hook];
  if (Meteor.isServer && typeof callbacks !== "undefined" && !!callbacks.length) {
    return Meteor.defer(function() {
      return callbacks.forEach(function(callback) {
        return callback(item, constant);
      });
    });
  } else {
    return item;
  }
}
