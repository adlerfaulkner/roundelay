import React from "react"
import PropTypes from "prop-types"

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const { user, onClickHandler } = this.props;
    if (onClickHandler) {
      onClickHandler(e, user);
    }
  }
  render () {
    const user = this.props.user;

    return (
      <div className='user-avatar' onClick={this.handleClick}>{user.name}</div>
    );
  }
}

export default Avatar
