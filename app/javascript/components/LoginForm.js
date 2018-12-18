import React from "react"
import PropTypes from "prop-types"
import FormInput from "./FormInput.js"

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {}
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
    event.preventDefault();
    const self = this;
    const reqData = {
      email: this.state.email,
      password: this.state.password
    };
    this.setState({loading: true});
    this._loginRequest = $.post({
      url: '/api/v1/login',
      data: reqData,
      dataType: 'JSON',
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(respData) {
        self._loginRequest = null;
        self.setState({loading: false});
        self.props.onLoginComplete(respData);
      },
      error: function(xhr, status) {
        self._loginRequest = null;
        const respData = xhr.responseJSON;
        self.setState({ loading: false, errors: respData });
      }
    });
  }

  render() {
    const { email, password, errors } = this.state;

    return (
      <React.Fragment>
        { this.state.loading && <div className='loading-screen'><div className='spinner'></div></div>}
        <div className='form-header'>Log In</div>
        <form onSubmit={this.handleSubmit} className='login-form account-form modal-form'>
          <FormInput label='Email' name='email' errors={errors['email']} value={email} onInputChange={this.handleInputChange} />
          <FormInput label='Password' name='password' errors={errors['password']} value={password} onInputChange={this.handleInputChange} />
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
