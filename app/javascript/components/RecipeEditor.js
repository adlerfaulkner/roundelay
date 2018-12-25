import React from "react"
import PropTypes from "prop-types"
import TitlePlaceholder from "./TitlePlaceholder.js"
import IngredientPlaceholders from "./IngredientPlaceholders.js"
import StepPlaceholders from "./StepPlaceholders.js"
import TitleEditor from "./TitleEditor.js"
import DescriptionEditor from "./DescriptionEditor.js"
import Step from "./Step.js"
import Ingredient from "./Ingredient.js"
import Avatar from "./Avatar.js"

function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

class RecipeEditor extends React.Component {
  constructor(props) {
    super(props);

    const recipe = this.props.recipe;

    this.state = {
      saved: recipe.id != null,
      saving: false,
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.map((ingredient) => {
        return {
          position: ingredient.position,
          innerRef: React.createRef(),
          id: ingredient.id,
          text: ingredient.text
        }
      }),
      prevIngredients: recipe.ingredients,
      steps: recipe.steps.map((step) => {
        return {
          position: step.position,
          innerRef: React.createRef(),
          id: step.id,
          text: step.text
        }
      }),
      prevSteps: recipe.steps,
      creator: recipe.creator,
      writer: recipe.writer
    }
    const placeholders = TitlePlaceholder();
    this.ingredientPlaceholders = IngredientPlaceholders();
    this.stepPlaceholders = StepPlaceholders();
    this.titleRef = React.createRef();
    this.descRef = React.createRef();
    this.titlePlaceholder = placeholders[0];
    this.descPlaceholder = placeholders[1];
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTitleReturn = this.handleTitleReturn.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDescReturn = this.handleDescReturn.bind(this);
    this.handleDescDelete = this.handleDescDelete.bind(this);
    this.handleIngredientTextChange = this.handleIngredientTextChange.bind(this);
    this.handleStepTextChange = this.handleStepTextChange.bind(this);
    this.handleIngredientReturn = this.handleIngredientReturn.bind(this);
    this.handleIngredientDelete = this.handleIngredientDelete.bind(this);
    this.handleStepReturn = this.handleStepReturn.bind(this);
    this.handleStepDelete = this.handleStepDelete.bind(this);
    this.handleRecipeChange = this.handleRecipeChange.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
  }
  handleRecipeChange() {
    const self = this;
    if (this._saveRecipeTimeout) {
      clearTimeout(this._saveRecipeTimeout);
    }
    this.setState({ saved: false });
    this.props.onSaveStateUpdate("Unsaved");
    this._saveRecipeTimeout = setTimeout( function() {
      self.saveRecipe();
    }, 1000);
  }
  saveRecipe() {
    if (this.state.saving) {
      return
    }

    this.setState({ saving: true });
    this.props.onSaveStateUpdate("Saving...");
    const self = this;
    const { id, title, description, ingredients, steps, prevIngredients, prevSteps } = this.state;

    let ingredients_to_delete = [];
    let steps_to_delete = [];
    const ingredientsForParams = ingredients.map((ingredient, i) => {
      const ingredientCopy = {
        position: i,
        text: ingredient.text
      }
      if (ingredient.id) {
        ingredientCopy.id = ingredient.id;
      }
      return ingredientCopy;
    });
    for(let i=0; i < prevIngredients.length; i++) {
      const id = prevIngredients[i].id;
      if (id) {
        const ingredientInParams = ingredientsForParams.find((i) => i.id == id);
        if (!ingredientInParams) {
          ingredients_to_delete.push(id);
        }
      }
    }

    const stepsForParams = steps.map((step, i) => {
      const stepCopy = {
        position: i,
        text: step.text
      }
      if (step.id) {
        stepCopy.id = step.id;
      }
      return stepCopy;
    });
    for(let i=0; i < prevSteps.length; i++) {
      const id = prevSteps[i].id;
      if (id) {
        const stepInParams = stepsForParams.find((i) => i.id == id);
        if (!stepInParams) {
          steps_to_delete.push(id);
        }
      }
    }

    const params = {
      recipe: {
        title: title,
        description: description,
        ingredients_attributes: ingredientsForParams,
        steps_attributes: stepsForParams,
      },
      ingredients_to_delete: ingredients_to_delete,
      steps_to_delete: steps_to_delete
    }

    let url, method;
    if (id) {
      url = "/recipes/" + id;
      method = "PATCH";
    } else {
      url = "/recipes"
      method = "POST";
    }
    this._saveRecipeRequest = $.ajax({
      url: "/api/v1" + url,
      data: params,
      dataType: 'JSON',
      method: method,
      success: function(respData) {
        self.props.onSaveStateUpdate("Saved");
        const newIngredients = respData.ingredients
        const newSteps = respData.steps
        self.setState((prevState) => {
          return {
            prevIngredients: newIngredients,
            prevSteps: newSteps,
            saving: false,
            saved: true,
            id: respData.id,
            ingredients: prevState.ingredients.map((ingredient, i) => {
              if (newIngredients[i]) {
                ingredient.id = newIngredients[i].id;
              }
              return ingredient;
            }),
            steps: prevState.steps.map((step, i) => {
              if (newSteps[i]) {
                step.id = newSteps[i].id;
              }
              return step;
            })
          }
        });
        self.props.onEditorRecipeChange(respData);
      },
      error: function(xhr, status) {
        console.log(xhr);
        console.log(status);
        self.setState({
          saving: false,
          saved: false,
        });
      }
    })
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
    this.handleRecipeChange();
  }
  handleTitleReturn() {
    placeCaretAtEnd(this.descRef.current);
  }
  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
    this.handleRecipeChange();
  }
  handleDescReturn() {
    placeCaretAtEnd(this.state.ingredients[0].innerRef.current);
  }
  handleDescDelete() {
    placeCaretAtEnd(this.titleRef.current);
  }
  handleIngredientTextChange(index, text) {
    this.setState((prevState) => {
      const newState = {
        ingredients: prevState.ingredients
      };
      newState.ingredients[index].text = text;
      return newState;
    });
    this.handleRecipeChange();
  }
  handleStepTextChange(index, text) {
    this.setState((prevState) => {
      const newState = {
        steps: prevState.steps
      };
      newState.steps[index].text = text;
      return newState;
    });
    this.handleRecipeChange();
  }
  handleIngredientDelete(index) {
    const { ingredients } = this.state;
    if (index == 0 && ingredients.length == 1) {
      placeCaretAtEnd(this.descRef.current);
    } else {
      this.setState((prevState) => {
        const newIngredients = prevState.ingredients.slice();
        newIngredients.splice(index,1)
        return { ingredients: newIngredients };
      }, () => {
        placeCaretAtEnd(this.state.ingredients[Math.max(0, index-1)].innerRef.current);
      });
    }
    this.handleRecipeChange();
  }
  handleIngredientReturn(index) {
    this.setState((prevState) => {
      const newIngredients = prevState.ingredients.slice();
      newIngredients.splice(index+1, 0, { text: "", innerRef: React.createRef() });
      return { ingredients: newIngredients };
    });
    this.handleRecipeChange();
  }
  handleStepDelete(index) {
    const { steps, ingredients } = this.state;
    if (index == 0 && steps.length == 1) {
      placeCaretAtEnd(ingredients[ingredients.length-1].innerRef.current);
    } else {
      this.setState((prevState) => {
        const newSteps = prevState.steps.slice();
        newSteps.splice(index,1)
        return { steps: newSteps };
      }, () => {
        placeCaretAtEnd(this.state.steps[Math.max(0, index-1)].innerRef.current);
      });
    }
    this.handleRecipeChange();
  }
  handleStepReturn(index) {
    this.setState((prevState) => {
      const newSteps = prevState.steps.slice();
      newSteps.splice(index+1, 0, { text: "", innerRef: React.createRef() } );
      return { steps: newSteps };
    });
    this.handleRecipeChange();
  }
  componentDidMount() {
    const self = this;
    const { recipe } = this.props;
    setTimeout(function() {
      self.titleRef.current.focus();
    });
    if (recipe.id != null) {
      this.props.onSaveStateUpdate("Saved");
    }
  }
  render () {
    const { title, description, ingredients, steps, creator, writer } = this.state;
    let titlePlaceholderStyle;
    if (title.length > 0) {
      titlePlaceholderStyle = { display: 'none' };
    }
    let descPlaceholderStyle;
    if (description.length > 0) {
      descPlaceholderStyle = { display: 'none' };
    }

    const ingredientsList = ingredients.map((ingredient, i) => {
      return <Ingredient
        key={i}
        innerRef={ingredient.innerRef}
        text={ingredient.text}
        index={i}
        placeholder={this.ingredientPlaceholders[i]}
        onTextChange={this.handleIngredientTextChange}
        onReturn={this.handleIngredientReturn}
        onDelete={this.handleIngredientDelete}/>;
    });

    const stepsList = steps.map((step, i) => {
      return <Step
        key={i}
        innerRef={step.innerRef}
        text={step.text}
        index={i}
        placeholder={this.stepPlaceholders[i]}
        onTextChange={this.handleStepTextChange}
        onReturn={this.handleStepReturn}
        onDelete={this.handleStepDelete}/>;
    });

    return (
      <div className='recipe-editor page-width recipe-page'>
        <div className='title-container contenteditable-container'>
          <div className='title-placeholder contenteditable-placeholder' style={titlePlaceholderStyle}>{this.titlePlaceholder}</div>
          <TitleEditor title={title}
            innerRef={this.titleRef}
            onChange={this.handleTitleChange}
            onReturn={this.handleTitleReturn}/>
        </div>
        <div className='description-container contenteditable-container'>
          <div className='description-placeholder contenteditable-placeholder' style={descPlaceholderStyle}>{this.descPlaceholder}</div>
          <DescriptionEditor
            description={description}
            innerRef={this.descRef}
            onChange={this.handleDescriptionChange}
            onReturn={this.handleDescReturn}
            onDelete={this.handleDescDelete}/>
        </div>
        <div className='recipe-body'>
          <div className='section ingredients-section'>
            { ingredientsList }
          </div>
          <div className='section steps-section'>
            { stepsList }
          </div>
        </div>
      </div>
    );
  }
}

export default RecipeEditor
