import React, { Component, useState } from 'react'; 

class Navbar extends Component {

  render() {
  return (
    <nav>
      <div className="nav__network">
        <small>NETWORK: {}</small>
      </div>
      
      <div className="nav__title">
        <h1>BLOCK EXPLORER</h1>
      </div>
    </nav>
  );
  }
}

export default Navbar;
