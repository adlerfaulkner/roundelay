import React from "react"
import ReactDOM from 'react-dom';
import PropTypes from "prop-types"

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    let classes = ["modal-screen"];
    if (this.props.centered) {
      classes.push("centered");
    }
    this.el.setAttribute('class', classes.join(" "));
  }

  componentDidMount() {
    document.getElementById('modal-root').appendChild(this.el);
  }

  componentWillUnmount() {
    document.getElementById('modal-root').removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children,this.el);
  }
}
export default Modal
