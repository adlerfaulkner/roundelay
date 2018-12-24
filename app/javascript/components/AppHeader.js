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
      onSignUpClick, recipeEditorSaveState, openRecipe, onDraftsClick,
      draftsOpen } = this.props;
    let headerButtons, leftButtons;

    if (!accountModalOpen) {
      let loginButtons;

      if (editRecipe) {
        headerButtons = <div className='editor-buttons-wrapper'>
          <div className='save-state'>{recipeEditorSaveState}</div>
          { (editRecipe.id != null && $.trim(editRecipe.title).length > 0) ?
            <button className='publish-button fill-link' onClick={onPublishClick}>Publish</button>
            :
            <Dropdown classes="publish-button-dropdown" align={'right'} buttonContents={<button className='publish-button fill-link inactive'>Publish</button>}>
              <div className='cannot-publish-notice'>Add a title to your recipe before publishing it!</div>
            </Dropdown>
          }
        </div>
      } else if (currentUser) {
        const avatar = <Avatar user={currentUser}/>
        headerButtons = <div className='login-wrapper'>
            <button className='black-non-border-link margin-button drafts-link' onClick={onDraftsClick}>Drafts</button>
            <Dropdown classes={'margin-button'} buttonContents={avatar} align={'right'}>
              <button className='dropdown-option' onClick={onNewRecipeClick}>New recipe</button>
              <button className='dropdown-option' onClick={onDraftsClick}>Drafts</button>
              <button className='dropdown-option logout-button' onClick={onLogoutClick}>Log Out</button>
            </Dropdown>
            { editRecipe == null && <button className='new-button fill-link' onClick={onNewRecipeClick}>New Recipe</button> }
          </div>
      } else {
        headerButtons = <div className='login-wrapper'>
          <button className='login-button black-non-border-link margin-button' onClick={this.props.onLoginClick}>Log In</button>
          <button className='signup-button fill-link' onClick={this.props.onSignUpClick}>Sign Up</button>
        </div>
      }
    } else {
      headerButtons = <div className='login-wrapper'><div className='close-button non-border-link' onClick={onCloseButtonClick}>Close</div></div>;
    }

    return (
      <div className='header-bar'>
        <div className='centering'>
          { leftButtons }
          <div className='logo-container'>
            <a href="" className='site-nav-logo' onClick={this.props.onLogoClick}>
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
      </div>
    );
  }
}

export default AppHeader
