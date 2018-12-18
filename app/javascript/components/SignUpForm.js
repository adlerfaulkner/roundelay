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
      password_confirmation: "",
      errors: {},
      loading: false
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
    const self = this;
    event.preventDefault();
    const reqData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };
    this.setState({loading: true});
    this._signupRequest = $.post({
      url: '/api/v1/users',
      data: reqData,
      dataType: 'JSON',
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(respData) {
        self._signupRequest = null;
        self.setState({loading: false});
        self.props.onSignUpComplete(respData);
      },
      error: function(xhr, status) {
        self._signupRequest = null;
        const respData = xhr.responseJSON;
        self.setState({loading: false, errors: respData});
      }
    });

  }

  render() {
    const { errors, name, email, password, password_confirmation } = this.state;

    return (
      <React.Fragment>
        { this.state.loading && <div className='loading-screen'><div className='spinner'></div></div>}
        <div className='form-header'>Sign Up</div>
        <form onSubmit={this.handleSubmit} className='signup-form account-form modal-form'>
          <FormInput label='Name' name='name' errors={errors['name']} value={name} onInputChange={this.handleInputChange} />
          <FormInput label='Email' name='email' errors={errors['email']} value={email} onInputChange={this.handleInputChange} />
          <FormInput label='Password' name='password' errors={errors['password']} value={password} onInputChange={this.handleInputChange} />
          <FormInput label='Confirm your password' errors={errors['password_confirmation']} name='password_confirmation' value={password_confirmation} onInputChange={this.handleInputChange} />
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
