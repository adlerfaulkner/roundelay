import React from "react"
import ReactDOM from 'react-dom';
import PropTypes from "prop-types"

class FormInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const label = this.props.label;
    const name = this.props.name;
    const value = this.props.value;

    let classes = "";
    if (value.length > 0) {
      classes += 'up'
    }

    return (
      <div className='form-input-wrapper'>
        <input type={name == 'password' || name == 'passwordConfirmation' ? 'password' : 'text'} name={name} id={name} value={value} onChange={this.props.onInputChange} />
        <label className={classes} htmlFor={name}>{ label }</label>
      </div>
    )
  }
}
export default FormInput
