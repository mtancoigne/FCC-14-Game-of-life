console.clear();

import React from 'react';
import {render} from 'react-dom';

/* ------------------------------

Main React component

------------------------------ */
class App extends React.Component {

  constructor(props){
    super(props);
    // Define some properties
    this.state={

    };
  }

  render() {
    return (
      <div className="container">
      </div>
    );
  }

}

/* ------------------------------
Render the App
------------------------------ */
$(document).ready(()=>{
  render(<App/>, document.getElementById('app'));
});
