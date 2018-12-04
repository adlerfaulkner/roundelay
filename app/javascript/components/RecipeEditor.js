import React from "react"
import PropTypes from "prop-types"
import TitlePlaceholder from "./TitlePlaceholder.js"
import TitleEditor from "./TitleEditor.js"

class RecipeEditor extends React.Component {
  constructor(props) {
    super(props);

    const recipe = this.props.recipe;

    this.state = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      creator: recipe.creator,
      postedBy: recipe.postedBy
    }
    this.titlePlaceholder = TitlePlaceholder();
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  render () {
    const { title, description, ingredients, steps, creator, postedBy } = this.state;
    let placeholderStyle;
    if (title.length > 0) {
      placeholderStyle = { display: 'none' }
    }

    return (
      <div className='recipe-editor page-width'>
        <div className='title-container'>
          <div className='title-placeholder' style={placeholderStyle}>{this.titlePlaceholder}</div>
          <TitleEditor title={title} onChange={this.handleTitleChange}/>
        </div>
      </div>
    );
  }
}

export default RecipeEditor
