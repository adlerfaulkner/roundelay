import React from "react"
import PropTypes from "prop-types"
import AppHeader from "./AppHeader.js"
import Modal from "./Modal.js"
import LoginForm from "./LoginForm.js"
import SignUpForm from "./SignUpForm.js"
import RecipeEditor from "./RecipeEditor.js"
import Recipe from "./Recipe.js"
import RecipeView from "./RecipeView.js"

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
      recipes: [],
      loadingRecipesPage: false,
      initialRecipesLoad: false,
      hasNextRecipesPage: true,
      searchText: "",
      draftsOpen: false,
      drafts: [],
      draftsPage: 1,
      initialDraftsLoad: false,
      loadingDraftsPage: false,
      hasNextDraftsPage: true,
      openRecipe: null,
      publishing: false
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
    this.handleRecipeClick = this.handleRecipeClick.bind(this);
    this.handleRecipeListScroll = this.handleRecipeListScroll.bind(this);
    this.handleDraftsClick = this.handleDraftsClick.bind(this);
    this.loadDrafts = this.loadDrafts.bind(this);
  }

  openSignUpModal() {
    this.setState({loginModal: false, signUpModal: true});
  }
  openLoginModal() {
    this.setState({loginModal: true, signUpModal: false});
  }
  closeModals() {
    const { editRecipe } = this.state;
    if (editRecipe) {
      this.setState({ editRecipe: null, recipeEditorSaveState: null, });
    } else {
      this.setState({
        loginModal: false,
        signUpModal: false,
        openRecipe: null,
        draftsOpen: false
      });
    }
  }
  createNewRecipe() {
    const newRecipe = {
      title: "",
      description: "",
      ingredients: [{ text: "" }],
      steps: [{ text: "" }],
      creator: this.props.currentUser,
      writer: this.props.currentUser
    }
    this.setState({ editRecipe: newRecipe, openRecipe: null });
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
    const self = this;
    const { editRecipe } = this.state;
    this.setState({ publishing: true });

    this._ajaxPublishRequest = $.ajax({
      url: "/api/v1/recipes/" + editRecipe.id,
      data: { recipe: { published: true } },
      dataType: 'JSON',
      method: 'PATCH',
      success: function(respData) {
        self.setState((prevState) => {
          const newRecipes = prevState.recipes;
          newRecipes.unshift(respData);
          return {
            recipes: newRecipes,
            drafts: prevState.drafts.filter((d) => d.id != respData.id),
            editRecipe: null,
            recipeEditorSaveState: null,
            publishing: false,
            openRecipe: null
          }
        });
      },
      error: function(xhr, status) {
        self.setState({ publishing: false });
      }
    });
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
    this.setState({ loadingRecipesPage: true });
    const { searchText, recipesPage } = this.state;
    const params = { q: overrideSearchText || searchText, page: (loadPage ? recipesPage+1 : 1) };
    const self = this;
    this._ajaxRecipesRequest = $.get({
      url: '/api/v1/recipes',
      data: params,
      dataType: 'JSON',
      success: function(respData) {
        const recipes = respData.recipes
        self.setState((prevState) => {
          return {
            initialRecipesLoad: true,
            loadingRecipesPage: false,
            recipes: (loadPage ? prevState.recipes.concat(recipes) : recipes),
            recipesPage: params.page,
            hasNextRecipesPage: !respData.last_page
          }
        });
      }
    });
  }
  handleRecipeClick(recipe) {
    if (recipe.published) {
      this.setState({ openRecipe: recipe });
    } else {
      this.setState({ editRecipe: recipe });
    }
  }
  handleRecipeListScroll(e) {
    const DOMscrollContainer = e.target;
    const { hasNextRecipesPage, loadingRecipesPage, draftsOpen } = this.state;
    if (!loadingRecipesPage && hasNextRecipesPage && DOMscrollContainer.scrollTop + 800 > (DOMscrollContainer.scrollHeight - DOMscrollContainer.clientHeight)) {
      if (draftsOpen) {
        this.loadDrafts(true);
      } else {
        this.getRecipesPage(true);
      }
    }
  }
  handleDraftsClick() {
    this.setState({ draftsOpen: true });
  }
  loadDrafts(loadPage) {
    this.setState({ loadingDraftsPage: true });
    const { draftsPage } = this.state;
    const params = { page: (loadPage ? draftsPage+1 : 1)};
    const self = this;
    this._ajaxRecipesRequest = $.get({
      url: '/api/v1/recipes/drafts',
      data: params,
      dataType: 'JSON',
      success: function(respData) {
        const drafts = respData.drafts
        self.setState((prevState) => {
          return {
            initialDraftsLoad: true,
            loadingDraftsPage: false,
            drafts: (loadPage ? prevState.drafts.concat(drafts) : drafts),
            draftsPage: params.page,
            hasNextDraftsPage: !respData.last_page
          }
        });
      }
    });
  }
  componentDidMount() {
    const { initialRecipesLoad, loadingRecipesPage, draftsOpen, initialDraftsLoad, loadingDraftsPage } = this.state;
    if (!initialRecipesLoad && !loadingRecipesPage) {
      this.getRecipesPage();
    }
    if (draftsOpen && !initialDraftsLoad && !loadingDraftsPage) {
      this.loadDrafts();
    }
  }
  componentDidUpdate() {
    const { initialRecipesLoad, loadingRecipesPage, draftsOpen, initialDraftsLoad, loadingDraftsPage } = this.state;
    if (!initialRecipesLoad && !loadingRecipesPage) {
      this.getRecipesPage();
    }
    if (draftsOpen && !initialDraftsLoad && !loadingDraftsPage) {
      this.loadDrafts();
    }
  }

  render () {
    const { currentUser, signUpModal, loginModal, editRecipe, publishing,
      recipeEditorSaveState, recipes, searchText, openRecipe, loadingRecipesPage,
      draftsOpen, drafts, loadingDraftsPage } = this.state;

    let recipesToDisplay = recipes;
    if (draftsOpen) {
      recipesToDisplay = drafts;
    }

    const recipeList = recipesToDisplay.map((r, i) => {
      return <Recipe key={i} recipe={r} onRecipeClick={this.handleRecipeClick} />
    });

    return (
      <React.Fragment>
        <div id='container' onScroll={this.handleRecipeListScroll}>
          <AppHeader
            currentUser={currentUser}
            onCloseButtonClick={this.closeModals}
            onSignUpClick={this.openSignUpModal}
            onLoginClick={this.openLoginModal}
            onNewRecipeClick={this.createNewRecipe}
            onDraftsClick={this.handleDraftsClick}
            onLogoutClick={this.logout}
            onPublishClick={this.publish}
            accountModalOpen={signUpModal || loginModal}
            editRecipe={editRecipe}
            openRecipe={openRecipe}
            draftsOpen={draftsOpen}
            recipeEditorSaveState={recipeEditorSaveState} />
          <div className='page-header'>
            { draftsOpen ?
              <div className='header-text'>Your Drafts</div>
              :
              <input type='text' val={searchText}
                className='recipe-search-input'
                placeholder={"Search by title, description, ingredient, or writer"}
                onChange={this.handleSearchTextChange} />
            }
          </div>
          <div className='recipe-list'>
            { recipeList }
            { ((draftsOpen && loadingDraftsPage) || (!draftsOpen && loadingRecipesPage)) && <div className='loading-icon'></div>}
          </div>
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
        { openRecipe != null &&
          <Modal><RecipeView
            recipe={openRecipe} /></Modal>
        }
        { publishing && <div className='loading-overlay'></div> }
      </React.Fragment>
    );
  }
}

export default App
