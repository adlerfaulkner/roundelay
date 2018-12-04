import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"
import Dropdown from "./Dropdown.js"

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleNewRecipeClick = this.handleNewRecipeClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }
  handleLoginClick(e) {
    e.preventDefault();
    this.props.onLoginClick();
  }
  handleSignUpClick(e) {
    e.preventDefault();
    this.props.onSignUpClick();
  }
  handleNewRecipeClick(e) {
    e.preventDefault();
    this.props.onNewRecipeClick();
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.onLogoutClick();
  }
  render () {
    const currentUser = this.props.currentUser;
    const accountModalOpen = this.props.accountModalOpen;
    let headerButtons;

    if (accountModalOpen) {
      headerButtons = <div className='close-button non-border-link' onClick={this.props.onCloseButtonClick}>Close</div>;
    } else {
      let loginButtons;

      if (currentUser) {
        const avatar = <Avatar user={currentUser}/>
        loginButtons = (
          <React.Fragment>
            <a href='/new-recipe' className='new-button fill-link' onClick={this.handleNewRecipeClick}>New Recipe</a>
            <Dropdown buttonContents={avatar} align={'right'}>
              <a href='/logout' className='dropdown-option' onClick={this.handleLogoutClick}>Log Out</a>
            </Dropdown>
          </React.Fragment>
        )
      } else {
        loginButtons = (
          <React.Fragment>
            <a href='/login' className='login-button non-border-link' onClick={this.handleLoginClick}>Log In</a>
            <a href='/signup' className='signup-button border-link' onClick={this.handleSignUpClick}>Sign Up</a>
          </React.Fragment>
        )
      }
      headerButtons = (
        <div className='login-wrapper'>{ loginButtons }</div>
      )
    }

    return (
      <div className='header-bar'>
        <div className='logo-container'>
          <a href="" className='site-nav-logo'>
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
        { headerButtons }
      </div>
    );
  }
}

export default AppHeader
