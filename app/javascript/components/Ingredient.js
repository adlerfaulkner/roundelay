import React from "react"
import PropTypes from "prop-types"
import ListItemEditor from "./ListItemEditor.js"

class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.itemRef = React.createRef();
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
  }
  handleTextChange(e) {
    this.props.onTextChange(this.props.index, e.target.value);
  }
  handleDelete() {
    this.props.onDelete(this.props.index);
  }
  handleReturn() {
    this.props.onReturn(this.props.index);
  }
  componentDidMount() {
    this.props.innerRef.current.focus();
  }
  render () {
    const { text, type } = this.props;
    let placeholderStyle;
    if (text.length > 0) {
      placeholderStyle = { display: 'none' }
    }

    return (
      <div className='ingredient-container contenteditable-container'>
        <div className='ingredient-placeholder contenteditable-placeholder' style={placeholderStyle}>{this.props.placeholder}</div>
        <ListItemEditor text={text}
          innerRef={this.props.innerRef}
          onChange={this.handleTextChange}
          onReturn={this.handleReturn}
          onDelete={this.handleDelete}/>
      </div>
    );
  }
}

export default Ingredient
