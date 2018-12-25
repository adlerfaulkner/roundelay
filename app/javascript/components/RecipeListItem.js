import React from "react"
import PropTypes from "prop-types"
import Avatar from "./Avatar.js"

class RecipeListItem extends React.Component {
  constructor(props) {
    super(props);
    this.descTextRef = React.createRef();
    this.descContainerRef = React.createRef();
    this.handleRecipeClick = this.handleRecipeClick.bind(this);
    this.addEllipses = this.addEllipses.bind(this);
  }
  handleRecipeClick(e) {
    this.props.onRecipeClick(this.props.recipe);
  }
  addEllipses() {
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
  componentDidMount() {
    this.addEllipses()
  }
  componentDidUpdate(prevProps) {
    const { recipe, refresh } = this.props;
    if (prevProps.refresh != refresh) {
      const stepText = recipe.steps.map((s, i) => [i+1, s.text].join(" ")).join(" ");
      $(this.descTextRef.current).html(recipe.description + " " + stepText);
      this.addEllipses();
    }
  }


  render () {
    const { recipe } = this.props;
    const { writer, creator, title, description } = recipe;
    const stepText = recipe.steps.map((s, i) => [i+1, s.text].join(" ")).join(" ");

    let personText;
    console.log(creator)
    console.log(writer)
    if (writer.id == creator.id) {
      personText = <React.Fragment>Written and created by {<Avatar user={writer} />}</React.Fragment>;
    } else {
      personText = <React.Fragment>Written by {<Avatar user={writer} />}. Created by {<Avatar user={creator} />}.</React.Fragment>;
    }

    return (
      <div className='recipe-container' onClick={this.handleRecipeClick}>
        <div className='recipe-title' dangerouslySetInnerHTML={{__html: title || "Untitled"}}></div>
        <div className='recipe-description' ref={this.descContainerRef}>
          <div className='text' ref={this.descTextRef} dangerouslySetInnerHTML={{__html: description + " " + stepText }}></div>
        </div>
        <div className='recipe-people'>{personText}</div>
      </div>
    );
  }
}

export default RecipeListItem
