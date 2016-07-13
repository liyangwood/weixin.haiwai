
import React from 'react';
let h = {};

h.returnComponent = function(tmpl, props){
	if (!React) return null
	var props = _.isObject(props) ? props : null
	if (_.isObject(tmpl)) {
		if (props)
			return React.cloneElement(tmpl, props)
		return tmpl
	} else if (_.isString(tmpl) && window[tmpl])
		return React.createElement(window[tmpl], props)


	return null;
}

export default h;