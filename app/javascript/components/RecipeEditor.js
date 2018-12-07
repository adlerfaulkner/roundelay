import React from "react"
import PropTypes from "prop-types"
import TitlePlaceholder from "./TitlePlaceholder.js"
import TitleEditor from "./TitleEditor.js"
import DescriptionEditor from "./DescriptionEditor.js"

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
    const placeholders = TitlePlaceholder();
    this.titleRef = React.createRef();
    this.descRef = React.createRef();
    this.titlePlaceholder = placeholders[0];
    this.descPlaceholder = placeholders[1];
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
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

    return (
      <div className='recipe-editor page-width'>
        <div className='title-container contenteditable-container'>
          <div className='title-placeholder contenteditable-placeholder' style={titlePlaceholderStyle}>{this.titlePlaceholder}</div>
          <TitleEditor title={title} innerRef={this.titleRef} onChange={this.handleTitleChange}/>
        </div>
        <div className='description-container contenteditable-container'>
          <div className='description-placeholder contenteditable-placeholder' style={descPlaceholderStyle}>{this.descPlaceholder}</div>
          <DescriptionEditor description={description} innerRef={this.descRef} onChange={this.handleDescriptionChange}/>
        </div>
      </div>
    );
  }
}

export default RecipeEditor
