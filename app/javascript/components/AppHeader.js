import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
  }
  handleLoginClick() {
    this.props.onLoginClick();
  }
  handleSignUpClick() {
    this.props.onSignUpClick();
  }
  render () {
    const currentUser = this.props.currentUser;
    const modalOpen = this.props.modalOpen;

    return (
      <div className='header-bar'>
        <div className='logo-container'>
          <a href="#" className='site-nav-logo'>
            <svg width="163px" height="35px" viewBox="0 0 163 35">
                <title>Roundelay</title>
                <defs></defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fontFamily="SnellRoundhand-Black, Snell Roundhand" fontSize="32" fontWeight="700">
                    <text id="Roundelay-Copy-3" fill="#000000">
                        <tspan x="0.076" y="24">Roundelay</tspan>
                    </text>
                </g>
            </svg>
          </a>
        </div>
        <div className='spacer'></div>
        { modalOpen ?
          <div className='close-button non-border-link' onClick={this.props.onCloseButtonClick}>Close</div>
          :
          <div className='login-wrapper'>
            { currentUser ?
              <React.Fragment>
                <Avatar user={currentUser} />
              </React.Fragment>
              :
              <React.Fragment>
                <div className='login-button non-border-link' onClick={this.handleLoginClick}>Log In</div>
                <div className='signup-button fill-link' onClick={this.handleSignUpClick}>Sign Up</div>
              </React.Fragment>
            }
          </div>
        }
      </div>
    );
  }
}

export default AppHeader
