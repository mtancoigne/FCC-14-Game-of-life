console.clear();

import React from 'react';
import {render} from 'react-dom';

import Menu from './Menu.jsx';
import Game from './Game.jsx';

/**
Fusion a small array in a bigger one
@author mtancoigne

@var array pattern Array to insert
@var array grid Big array
@var object options

Options:
 - x int Default 0. Insertion point.
 - y int Default 0. Insertion point.
 - rdm bool Default false. Randomize insertion point.
*/
function arrayFusion(pattern, grid, options){
  // Pattern size
  var l=pattern.length;
  var w=pattern[0].length;
  var size=grid.length;
  if(options.random==true){
    // Random start point
    var stx=Math.floor(Math.random()*(size-l));
    var sty=Math.floor(Math.random()*(size-w));
  }else{
    if(options.x!=undefined){
      stx=options.x;
    }else{
      stx=0;
    }
    if(options.y!=undefined){
      sty=options.y
    }else{
      sty=0;
    }
  }
  // Overwriting
  for(let j=0; j<l; j++){
    for(let k=0; k<w; k++){
      grid[stx+j][sty+k]=pattern[j][k];
    }
  }
  return grid;
}

/* ------------------------------

Main React component

------------------------------ */
class App extends React.Component {
  _getInitialData(){
    var patterns=[
      // Still lifes
      //Block
      [
        [true, true],
        [true, true]
      ],
      //Beehive
      [
        [false, true, true, false],
        [true, false, false, true],
        [false, true, true, false]
      ],
      // Loaf
      [
        [false, true, true, false],
        [true, false, false, true],
        [false, true, false, true],
        [false, false, true, false]
      ],
      // Boat
      [
        [true, true, false],
        [true, false, true],
        [false, true, false],
      ],
      // Oscillators
      // Line(h)
      [
        [true, true, true]
      ],
      // Line (v)
      [
        [true],
        [true],
        [true],
      ],
      // Toad
      [
        [false, true, true, true],
        [true, true, true, false]
      ],
      //Beacon
      [
        [true, true, false, false],
        [true, true, false, false],
        [false, false, true, true],
        [false, false, true, true]
      ],
      // Pulsar
      [
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, true, true, true, false, false, false, true, true, true, false, false]
      ],
      // Spaceships
      // Glider
      [
        [true, false, false],
        [false, true, true],
        [true, true, true]
      ]
    ];
    // initial grid size
    var size=20;
    var grid=[]

    // Grid construction
    for(let i=0; i<size; i++){
      var row=[]
      for(let j=0; j<size; j++){
        var val=false;
        // Random noise
        if(Math.floor(Math.random()*size)<size/10 && this.state.noise===true){
          val=true;
        }
        row.push(val);
      }
      grid.push(row);
    }
    // adding some random patterns
    if(this.state.randomPatterns===true){
      var seed=Math.floor(Math.random()*size/4 + 1);
      for(let i=0; i<seed; i++){
        grid=arrayFusion(patterns[Math.floor(Math.random()*patterns.length)], grid,{random:true});
      }
    }
    return grid;
  }

  constructor(props){
    super(props);
    // Default data and configuration
    this.state={
      // Current iteration number
      currentGeneration:0,
      // Flag to see if the app is running or not
      running:false,
      // Other options
      noise:true,
      randomPatterns:true
    }
    // Current set of data. Declared after state, to use the defined default states
    this.state.currentData=this._getInitialData();
  }

  render() {
    return (
      <div>
        <Menu
          // Values
          gridSize={this.state.currentData.length}
          currentGeneration={this.state.currentGeneration}
          running={this.state.running}
          noise={this.state.noise}
          randomPatterns={this.state.randomPatterns}
          // Functions
          _gridSizeChange={(v)=>this._gridSizeChange(v)}
          _start={this._start.bind(this)}
          _stop={this._stop.bind(this)}
          _reset={this._reset.bind(this)}
          _toggleNoise={this._toggleNoise.bind(this)}
          _toggleRandom={this._toggleRandom.bind(this)}
        />
        <div id="board">
          <Game
            // Values
            running={this.state.running}
            currentData={this.state.currentData}
            currentGeneration={this.state.currentGeneration}
            // Functions
            _updateGeneration={this._updateGeneration.bind(this)}
          />
        </div>
      </div>
    );
  }

  //
  // Changing grid size and adding/deleting values in state
  _gridSizeChange(size){
    var dataSize=this.state.currentData.length;
    // Only update if sizes are differents.
    if(dataSize===size){
      return true;
    }else{
      var currentData=this.state.currentData;
      var newData=[];
      for(let i=0; i<size; i++){
        var row=[]
        for(let j=0; j<size; j++){
          if(j>=dataSize || i>=dataSize){
            row.push(false);
          }else{
            row.push(this.state.currentData[i][j]);
          }
        }
        newData.push(row);
      }
      this.setState({currentData:newData});
      return true;
    }
  }

  _toggleNoise(){
    this.setState({noise:!this.state.noise});
  }

  _toggleRandom(){
    this.setState({randomPatterns:!this.state.randomPatterns})
  }

  // Set the state to running...
  _start(){
    this.setState({running:true});
  }

  _stop(){
    this.setState({running:false});
  }

  // Resets the game
  _reset(){
    this.setState({
      running:false,
      currentGeneration:0,
      currentData:this._getInitialData()
    });
  }

  _updateGeneration(data, generation){
    this.setState({
      currentData:data,
      currentGeneration:generation,
      running:true,
    });
  }

}


/* ------------------------------
Render the App
------------------------------ */
$(document).ready(()=>{
  render(<App />, document.getElementById('app'));
});
