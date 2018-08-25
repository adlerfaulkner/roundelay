import React from "react"
import PropTypes from "prop-types"
import FormInput from "./FormInput.js"

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleLoginButtonClick() {
    this.props.onLoginButtonClick();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <div className='form-header'>Sign Up</div>
        <form onSubmit={this.handleSubmit} className='signup-form account-form modal-form'>
          <FormInput label='Name' name='name' value={this.state.name} onInputChange={this.handleInputChange} />
          <FormInput label='Email' name='email' value={this.state.email} onInputChange={this.handleInputChange} />
          <FormInput label='Password' name='password' value={this.state.password} onInputChange={this.handleInputChange} />
          <FormInput label='Confirm your password' name='passwordConfirmation' value={this.state.passwordConfirmation} onInputChange={this.handleInputChange} />
          <input type="submit" value="Sign Up" />
        </form>
        <div className='form-footer-buttons'>
          <div className='spacer'></div>
          <span>Already have an accout?</span>
          <div className='signup-button account-button non-border-link' onClick={this.handleLoginButtonClick}>Log In</div>
        </div>
      </React.Fragment>
    )
  }
}
export default SignUpForm
