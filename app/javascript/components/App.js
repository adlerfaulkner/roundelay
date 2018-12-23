import React from "react"
import PropTypes from "prop-types"
import AppHeader from "./AppHeader.js"
import Modal from "./Modal.js"
import LoginForm from "./LoginForm.js"
import SignUpForm from "./SignUpForm.js"
import RecipeEditor from "./RecipeEditor.js"
import Recipe from "./Recipe.js"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      signUpModal: false,
      loginModal: false,
      editRecipe: null,
      recipeEditorSaveState: null,
      recipesPage: 1,
      loadingRecipesPage: false,
      initialRecipesLoad: false,
      hasNextPage: true,
      searchText: "",
      recipes: [],
    };
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.createNewRecipe = this.createNewRecipe.bind(this);
    this.logout = this.logout.bind(this);
    this.publish = this.publish.bind(this);
    this.handleRecipeEditorStateChange = this.handleRecipeEditorStateChange.bind(this);
    this.handleEditorRecipeChange = this.handleEditorRecipeChange.bind(this);
    this.getRecipesPage = this.getRecipesPage.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
  }

  openSignUpModal() {
    this.setState({loginModal: false, signUpModal: true});
  }
  openLoginModal() {
    this.setState({loginModal: true, signUpModal: false});
  }
  closeModals() {
    this.setState({loginModal: false, signUpModal: false, editRecipe: null, recipeEditorSaveState: null});
  }
  createNewRecipe() {
    const newRecipe = {
      title: "",
      description: "",
      ingredients: [{ text: "", innerRef: React.createRef() }],
      steps: [{ text: "", innerRef: React.createRef() }],
      creator: this.props.currentUser,
      writer: this.props.currentUser
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
    this.setState({ currentUser: null, editRecipe: null});
  }
  loginUser(userData) {
    this.setState({
      currentUser: userData,
      loginModal: false,
      signUpModal: false
    });
  }
  publish() {
    this.setState({ editRecipe: null, recipeEditorSaveState: null });
  }
  handleRecipeEditorStateChange(saveState) {
    this.setState({ recipeEditorSaveState: saveState });
  }
  handleEditorRecipeChange(recipe) {
    this.setState({ editRecipe: recipe });
  }
  handleSearchTextChange(e) {
    const self = this;
    const searchText = e.target.value;
    this.setState({ searchText: searchText });
    if (this._recipeSearchTimeout) {
      clearTimeout(this._recipeSearchTimeout);
    }
    this._recipeSearchTimeout = setTimeout( function() {
      self.getRecipesPage(false, searchText);
    }, 300);
  }
  getRecipesPage(loadPage=false, overrideSearchText=null) {
    const { searchText, recipesPage } = this.state;
    const params = { q: overrideSearchText || searchText, page: (loadPage ? recipesPage+1 : 1) };
    const self = this;
    this._ajaxRecipesRequest = $.get({
      url: '/api/v1/recipes',
      data: params,
      dataType: 'JSON',
      success: function(respData) {
        const recipes = respData.recipes.map((res) => JSON.parse(res));
        self.setState((prevState) => {
          return {
            initialRecipesLoad: true,
            loadingRecipesPage: false,
            recipes: (loadPage ? prevState.recipes.concat(recipes) : recipes),
            recipesPage: params.page,
            hasNextPage: !respData.last_page
          }
        });
      }
    });
  }
  componentDidMount() {
    const { initialRecipesLoad, loadingRecipesPage } = this.state;
    if (!initialRecipesLoad && !loadingRecipesPage) {
      this.getRecipesPage();
    }
  }
  componentDidUpdate() {
    const { initialRecipesLoad, loadingRecipesPage } = this.state;
    if (!initialRecipesLoad && !loadingRecipesPage) {
      this.getRecipesPage();
    }
  }

  render () {
    const { currentUser, signUpModal, loginModal, editRecipe, recipeEditorSaveState, recipes, searchText } = this.state;
    const recipeList = recipes.map((r, i) => {
      return <Recipe key={i} recipe={r} />
    });
    return (
      <React.Fragment>
        <div>
          <AppHeader
            currentUser={currentUser}
            onCloseButtonClick={this.closeModals}
            onSignUpClick={this.openSignUpModal}
            onLoginClick={this.openLoginModal}
            onNewRecipeClick={this.createNewRecipe}
            onLogoutClick={this.logout}
            onPublishClick={this.publish}
            accountModalOpen={signUpModal || loginModal}
            editRecipe={editRecipe}
            recipeEditorSaveState={recipeEditorSaveState} />
          <div className='recipe-search'>
            <input type='text' val={searchText}
              className='recipe-search-input'
              placeholder={"Search by title, description, ingredient, or writer"}
              onChange={this.handleSearchTextChange} />
          </div>
          <div className='recipe-list'>{ recipeList }</div>
        </div>
        { loginModal &&
          <Modal centered><LoginForm onSignUpButtonClick={this.openSignUpModal} onLoginComplete={this.loginUser}/></Modal>
        }
        { signUpModal &&
          <Modal centered><SignUpForm onLoginButtonClick={this.openLoginModal} onSignUpComplete={this.loginUser}/></Modal>
        }
        { editRecipe != null &&
          <Modal><RecipeEditor
            recipe={editRecipe}
            onSaveStateUpdate={this.handleRecipeEditorStateChange}
            onEditorRecipeChange={this.handleEditorRecipeChange}/></Modal>
        }
      </React.Fragment>
    );
  }
}

export default App
