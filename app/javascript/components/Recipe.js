import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleRecipeClick = this.handleRecipeClick.bind(this);
  }
  handleRecipeClick(e) {
    this.props.onRecipeClick(this.props.recipe);
  }
  render () {
    const { recipe } = this.props;
    const stepText = recipe.steps.map((s, i) => [i+1, s.text].join(" ")).join(" ")

    return (
      <div className='recipe-container' onClick={this.handleRecipeClick}>
        <div className='recipe-title'>{recipe.title || "Untitled"}</div>
        <div className='recipe-description'>{recipe.description} {stepText}</div>
        <div className='recipe-people'>Written by {<Avatar user={recipe.writer} />}</div>
      </div>
    );
  }
}

export default Recipe
