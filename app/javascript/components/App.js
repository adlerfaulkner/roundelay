import React from "react"
import PropTypes from "prop-types"
import AppHeader from "./AppHeader.js"
import Modal from "./Modal.js"
import LoginForm from "./LoginForm.js"
import SignUpForm from "./SignUpForm.js"
import RecipeEditor from "./RecipeEditor.js"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      signUpModal: false,
      loginModal: false,
      editRecipe: null
    };
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.createNewRecipe = this.createNewRecipe.bind(this);
    this.logout = this.logout.bind(this);
  }

  openSignUpModal() {
    this.setState({loginModal: false, signUpModal: true});
  }
  openLoginModal() {
    this.setState({loginModal: true, signUpModal: false});
  }
  closeModals() {
    this.setState({loginModal: false, signUpModal: false});
  }
  createNewRecipe() {
    const newRecipe = {
      title: "",
      description: "",
      ingredients: [{ text: "", innerRef: React.createRef() }],
      steps: [{ text: "", innerRef: React.createRef() }],
      creator: this.props.currentUser,
      postedBy: this.props.currentUser
    }
    this.setState({ editRecipe: newRecipe });
  }
  logout() {
    this._logoutRequest = $.ajax({
      url: '/api/v1/logout',
      dataType: 'JSON',
      method: 'DELETE',
      success: function(respData) {
        $('meta[name="csrf-token"]').attr('content', respData.csrf_token);
      }
    });
    this.setState({ currentUser: null });
  }
  loginUser(userData) {
    this.setState({
      currentUser: userData,
      loginModal: false,
      signUpModal: false
    });
  }

  render () {
    const { currentUser, signUpModal, loginModal, editRecipe } = this.state;

    return (
      <React.Fragment>
        <div>
          <AppHeader currentUser={currentUser} onCloseButtonClick={this.closeModals}
            onSignUpClick={this.openSignUpModal} onLoginClick={this.openLoginModal}
            onNewRecipeClick={this.createNewRecipe} onLogoutClick={this.logout}
            accountModalOpen={signUpModal || loginModal}/>
        </div>
        { loginModal &&
          <Modal centered><LoginForm onSignUpButtonClick={this.openSignUpModal} onLoginComplete={this.loginUser}/></Modal>
        }
        { signUpModal &&
          <Modal centered><SignUpForm onLoginButtonClick={this.openLoginModal} onSignUpComplete={this.loginUser}/></Modal>
        }
        { editRecipe != null &&
          <Modal><RecipeEditor recipe={editRecipe}/></Modal>
        }
      </React.Fragment>
    );
  }
}

export default App
