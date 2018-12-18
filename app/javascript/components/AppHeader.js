import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"
import Dropdown from "./Dropdown.js"

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const { currentUser, accountModalOpen, onCloseButtonClick, editRecipe,
      onNewRecipeClick, onPublishClick, onLoginClick, onLogoutClick,
      onSignUpClick } = this.props;
    let headerButtons;

    if (accountModalOpen) {
      headerButtons = <div className='close-button non-border-link' onClick={onCloseButtonClick}>Close</div>;
    } else {
      let loginButtons;

      if (currentUser) {
        const avatar = <Avatar user={currentUser}/>
        loginButtons = (
          <React.Fragment>
            { editRecipe == null ?
              <button className='new-button fill-link' onClick={this.props.onNewRecipeClick}>New Recipe</button>
              :
              <button className='publish-button fill-link' onClick={this.props.onPublishClick}>Publish</button>
            }
            <Dropdown buttonContents={avatar} align={'right'}>
              <button className='dropdown-option' onClick={this.props.onLogoutClick}>Log Out</button>
            </Dropdown>
          </React.Fragment>
        )
      } else {
        loginButtons = (
          <React.Fragment>
            <button className='login-button non-border-link' onClick={this.props.onLoginClick}>Log In</button>
            <button className='signup-button fill-link' onClick={this.props.onSignUpClick}>Sign Up</button>
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
