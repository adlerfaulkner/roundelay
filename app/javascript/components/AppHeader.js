import React from "react"
import PropTypes from "prop-types"

class AppHeader extends React.Component {
  render () {
    return (
      <div className='header-bar'>
        <div className='logo-container'>
          <a href="#" className='site-nav-logo'>
            <svg width="163px" height="35px" viewBox="0 0 163 35">
                <title>Roundelay</title>
                <defs></defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fontFamily="SnellRoundhand-Black, Snell Roundhand" fontSize="32" fontWeight="700">
                    <text id="Roundelay-Copy-3" fill="#000000">
                        <tspan x="0.076" y="24">Roundelay</tspan>
                    </text>
                </g>
            </svg>
          </a>
        </div>
      </div>
    );
  }
}

export default AppHeader
