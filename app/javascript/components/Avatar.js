import React from "react"
import PropTypes from "prop-types"

class Avatar extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const user = this.props.user;

    return (
      <div className='user-avatar'>{user.name}</div>
    );
  }
}

export default Avatar
