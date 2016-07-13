
"use strict";

const PAD = 8


/* ##########################################
  Form Element Primary Base Class
########################################## */
RC.FormElementPrimary = class extends RC.CSS {
  constructor(props) {
    super(props)

    this.doNotAutoprefix = true
    this.state = {
      required: props.required || false,
    }
  }
  themeStyles(np, ns) {
    let cPAD = RC.Theme.size.paddingPx - PAD // This must be here to allow dynamic changes
    const fontSize = RC.Theme.font.size

    return {
      // Stacked Label
      stackedLabel: {
        area: {
          display: "block",
        },
        label: Object.assign({}, RC.cssMixins.font("heavy"), {
          flex: "0 1 auto",
          maxWidth: "100%", display: "block", margin: "0 0 -3px",
          paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0,
          fontSize: RC.Theme.font.size-4
        }),
        form: {
          flex: "0 1 auto", display: "block",
        }
      },
      // Smaller
      smaller: {
        area: { fontSize: fontSize-2 },
        label: { fontSize: fontSize-2 },
        form: { fontSize: fontSize-2 }
      },
      // Right
      right: {
        form: {
          textAlign: "right"
        },
        label: {
          paddingLeft: 0,
        }
      },
      // Overlay
      overlay: {
        area: {
          margin: `0 0 ${RC.Theme.size.paddingPx}px`
        },
        form: {
          backgroundColor: this.color.get("realHex"), borderColor: this.color.get("realHex")
        }
      }
    }
  }
}

RC.FormElementPrimary.propTypes = Object.assign({}, RC.FormElementPrimary.propTypes, {
  name: React.PropTypes.string,
  label: React.PropTypes.string,
  validations: React.PropTypes.func,   // Add more types later

  style: React.PropTypes.object,
})


/* ##########################################
 Form Element Secondary Base Classes
 ########################################## */

/*
 Form Element With User Entered Value
*/

RC.FormElementSecondaryEnter = class extends RC.FormElementPrimary {
  constructor(props) {
    super(props);

    const value = props.value ? String(props.value) : "";
    const isError = _.isFunction(props.validations) && value
      ? props.validations(value)
      : false
    this.state = {
      obj: Immutable.Map({
        value: false,
        isFocused: false,
        isError: isError
      })
    };

    this.watchProps = ["borderColor", "labelColor", "labelColorFocus", "errorColor"]
    this.watchStates = ["isFocused", "isError"]
  }

  reset() {
    this.setStateObj( {value: this.props.value || false} )
  }

  getValue() {
    const value = this.props.value ? String(this.props.value) : ""
    const vState = this.state.obj.get("value");
    return h.ltrim((vState !== false ? vState : value) || "")
  }

  _focusHandler(e) {
    this.setStateObj( {isFocused: true} )
    if (_.isFunction(this.props.onFocus))
      this.props.onChange(e)
  }

  _blurHandler(e) {
    this.setStateObj( {isFocused: false} )
    if (_.isFunction(this.props.onBlur))
      this.props.onBlur(e)
  }

  _changeHandler(e) {
    let newStateObj = { value: e.target.value };

    if (_.isFunction(this.props.onChange))
      this.props.onChange(e);

    if (_.isFunction(this.props.validations))
      newStateObj.isError = this.props.validations(e.target.value);

    this.setStateObj( newStateObj )
  }

  componentWillReceiveProps(np) {
    if (np.value !== this.props.value)
      this.setStateObj({
        value: String(np.value)
      })
  }

  baseStyles(np, ns) {

    let labelColor, borderColor, cPAD, fontSize
    cPAD = RC.Theme.size.paddingPx - PAD  // This must be here to allow dynamic changes
    fontSize = RC.Theme.font.size

    if (typeof this.labelColor === "undefined" || np.labelColor != this.props.labelColor)
      this.labelColor = np.labelColor
        ? h.getRealColor(np.labelColor, "silver", null, true)
        : RC.Theme.color.silver

    if (typeof this.labelColorFocus === "undefined" || np.labelColorFocus != this.props.labelColorFocus)
      this.labelColorFocus = np.labelColorFocus
        ? h.getRealColor(np.labelColorFocus, "brand1", null, true)
        : RC.Theme.color.brand1

    if (!ns.obj.get("isError")) {
      labelColor = ns.obj.get("isFocused") ? this.labelColorFocus : this.labelColor
      borderColor = ns.obj.get("isFocused") ? this.labelColorFocus : RC.Theme.color.edges
    } else
      labelColor = borderColor = RC.Theme.color.red

    return {
      area: {
        display: "flex", margin: `0 0 ${cPAD}px`,
        borderBottom: `solid 1px ${borderColor}`
      },
      label: {
        fontSize: fontSize,
        color: labelColor
      }
    }
  }
}
RC.FormElementSecondaryEnter.propTypes = Object.assign({}, RC.FormElementPrimary.propTypes, {

  //value: React.PropTypes.string,

  errorColor: React.PropTypes.string,
  labelColor: React.PropTypes.string,
  labelColorFocus: React.PropTypes.string,

  disabled: React.PropTypes.bool,
})
