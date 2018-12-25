import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"

class RecipeView extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const { recipe } = this.props;
    const { description, title, ingredients, steps, writer, creator } = recipe;
    let displayTitle = title;
    if (displayTitle.length < 1) {
      displayTitle = "Untitled";
    }
    const ingredientsList = ingredients.map((ingredient, i) => {
      return <div key={i} className='ingredient-container' dangerouslySetInnerHTML={{__html: ingredient.text}}></div>;
    });
    const stepsList = steps.map((step, i) => {
      return <div key={i} className='step-container'>
        <div className='step-number'>{i+1}</div>
        <div className='step-text' dangerouslySetInnerHTML={{__html: step.text}}></div>
      </div>;
    });

    let personText;
    if (writer.id == creator.id) {
      personText = <React.Fragment>Written and created by {<Avatar user={writer} />}</React.Fragment>;
    } else {
      personText = <React.Fragment>Written by {<Avatar user={writer} />}. Created by {<Avatar user={creator} />}.</React.Fragment>;
    }

    return (
      <div className='recipe-view page-width recipe-page'>
        <div className='title-container' dangerouslySetInnerHTML={{__html: displayTitle}}></div>
        <div className='description-container' dangerouslySetInnerHTML={{__html:description}}></div>
        <div className='person-container'>{personText}</div>
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
