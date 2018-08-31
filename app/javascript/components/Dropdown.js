import React from "react"
import PropTypes from "prop-types"

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.dropdownRef = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
  }
  handleButtonClick(e) {
    this.setState((prevState) => {
      return { open: !prevState.open };
    });
  }
  handleClickOutsideDropdown(e) {
    if (!this.dropdownRef.current.contains(e.target)) {
      this.setState({open: false});
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutsideDropdown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideDropdown);
  }
  render () {
    const open = this.state.open;
    const align = this.props.align;
    let dropdownStyle = {};
    if (align == 'right') {
      dropdownStyle.right = '0px';
    } else {
      dropdownStyle.left = '0px';
    }

    return (
      <div className='dropdown-container' onClick={this.handleButtonClick} ref={this.dropdownRef}>
        <div className='dropdown-button'>{this.props.buttonContents}</div>
        { open && <div className='dropdown' style={dropdownStyle}>{this.props.children}</div>}
      </div>
    );
  }
}

export default Dropdown
