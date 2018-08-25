import React from "react"
import PropTypes from "prop-types"
import AppHeader from "./AppHeader.js"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser
    };
  }

  render () {
    const currentUser = this.state.currentUser
    return (
      <div>
        <AppHeader currentUser={currentUser}/>
      </div>
    );
  }
}

export default App
