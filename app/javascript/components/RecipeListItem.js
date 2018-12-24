import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"

class RecipeListItem extends React.Component {
  constructor(props) {
    super(props);
    this.descTextRef = React.createRef();
    this.descContainerRef = React.createRef();
    this.handleRecipeClick = this.handleRecipeClick.bind(this);
  }
  handleRecipeClick(e) {
    this.props.onRecipeClick(this.props.recipe);
  }
  componentDidMount() {
    let hasEllipsis = false;
    const descContainer = $(this.descContainerRef.current);
    const descText = $(this.descTextRef.current);
    const containerHeight = descContainer.height();
    let innerTextHeight = descText.height();
    let iterations = 0;
    let innerTextHTML = descText.text();
    while (innerTextHeight > containerHeight && iterations < 1000) {
      innerTextHTML = descText.text();
      if (hasEllipsis) {
        const ellipsisIndex = innerTextHTML.lastIndexOf('...');
        descText.html(innerTextHTML.slice(0,ellipsisIndex-1) + "...");
      } else {
        descText.html(innerTextHTML.slice(0,innerTextHTML.length-3) + "...");
        hasEllipsis = true
      }
      innerTextHeight = descText.height();
      iterations += 1;
    }
  }


  render () {
    const { recipe } = this.props;
    const stepText = recipe.steps.map((s, i) => [i+1, s.text].join(" ")).join(" ")

    return (
      <div className='recipe-container' onClick={this.handleRecipeClick}>
        <div className='recipe-title'>{recipe.title || "Untitled"}</div>
        <div className='recipe-description' ref={this.descContainerRef}><div className='text' ref={this.descTextRef}>{recipe.description} {stepText}</div></div>
        <div className='recipe-people'>Written by {<Avatar user={recipe.writer} />}</div>
      </div>
    );
  }
}

export default RecipeListItem
