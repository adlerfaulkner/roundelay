import React from "react"
import PropTypes from "prop-types"
import FormInput from "./FormInput.js"

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUpButtonClick = this.handleSignUpButtonClick.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleSignUpButtonClick() {
    this.props.onSignUpButtonClick();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <div className='form-header'>Log In</div>
        <form onSubmit={this.handleSubmit} className='login-form account-form modal-form'>
          <FormInput label='Email' name='email' value={this.state.email} onInputChange={this.handleInputChange} />
          <FormInput label='Password' name='password' value={this.state.password} onInputChange={this.handleInputChange} />
          <input type="submit" value="Log In" />
        </form>
        <div className='form-footer-buttons'>
            <div className='spacer'></div>
            <span>Don't have an accout yet?</span>
          <div className='signup-button non-border-link' onClick={this.handleSignUpButtonClick}>Sign Up</div>
        </div>
      </React.Fragment>
    )
  }
}
export default LoginForm
