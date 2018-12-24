import React from "react"
import PropTypes from "prop-types"

class RecipeView extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const { recipe } = this.props;
    const { description, title, ingredients, steps } = recipe;
    let displayTitle = title;
    if (displayTitle.length < 1) {
      displayTitle = "Untitled";
    }
    const ingredientsList = ingredients.map((ingredient, i) => {
      return <div key={i} className='ingredient-container'>{JSON.parse(ingredient).text}</div>;
    });
    const stepsList = steps.map((step, i) => {
      return <div key={i} className='step-container'>
        <div className='step-number'>{i+1}</div>
        <div className='step-text'>{JSON.parse(step).text}</div>
      </div>;
    });

    return (
      <div className='recipe-view page-width recipe-page'>
        <div className='title-container'>{displayTitle}</div>
        <div className='description-container'>{description}</div>
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

export default RecipeView
