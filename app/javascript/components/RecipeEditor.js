import React from "react"
import PropTypes from "prop-types"
import TitlePlaceholder from "./TitlePlaceholder.js"
import IngredientPlaceholders from "./IngredientPlaceholders.js"
import StepPlaceholders from "./StepPlaceholders.js"
import TitleEditor from "./TitleEditor.js"
import DescriptionEditor from "./DescriptionEditor.js"
import Step from "./Step.js"
import Ingredient from "./Ingredient.js"

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
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      creator: recipe.creator,
      postedBy: recipe.postedBy
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
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  handleTitleReturn() {
    placeCaretAtEnd(this.descRef.current);
  }
  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
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
  }
  handleStepTextChange(index, text) {
    this.setState((prevState) => {
      const newState = {
        steps: prevState.steps
      };
      newState.steps[index].text = text;
      return newState;
    });
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
        placeCaretAtEnd(ingredients[Math.max(0, index-1)].innerRef.current);
      });
    }
  }
  handleIngredientReturn(index) {
    this.setState((prevState) => {
      const newIngredients = prevState.ingredients.slice();
      newIngredients.splice(index+1, 0, { text: "", innerRef: React.createRef() });
      return { ingredients: newIngredients };
    });
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
        placeCaretAtEnd(steps[Math.max(0, index-1)].innerRef.current);
      });
    }
  }
  handleStepReturn(index) {
    this.setState((prevState) => {
      const newSteps = prevState.steps.slice();
      newSteps.splice(index+1, 0, { text: "", innerRef: React.createRef() } );
      return { steps: newSteps };
    });
  }
  componentDidMount() {
    const self = this;
    setTimeout(function() {
      self.titleRef.current.focus();
    });
  }
  render () {
    const { title, description, ingredients, steps, creator, postedBy } = this.state;
    let titlePlaceholderStyle;
    if (title.length > 0) {
      titlePlaceholderStyle = { display: 'none' }
    }
    let descPlaceholderStyle;
    if (description.length > 0) {
      descPlaceholderStyle = { display: 'none' }
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
      <div className='recipe-editor page-width'>
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
        <div className='section ingredients-section'>
          { ingredientsList }
        </div>
        <div className='section steps-section'>
          { stepsList }
        </div>
      </div>
    );
  }
}

export default RecipeEditor
