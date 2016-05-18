import React from 'react';

import Cell from './Cell.jsx';

/* ------------------------------

The game itself

------------------------------ */
class Game extends React.Component{
  constructor(props){
    super(props);
    // Creating default state from props. This is done to render the empty grid
    // at least once.
    this.runningTimers=0;
    this.state={
      currentData:this.props.currentData,
      currentGeneration:this.props.currentGeneration,
      running:this.props.running
    }
    //this._run=this._run.bind(this);
    this._tick=this._tick.bind(this);
    this._getCellState=this._getCellState.bind(this);
    //this._renderCells=this._renderCells.bind(this);
  }

  //
  // Managing new props. Can be a change state or a new dataset
  componentWillReceiveProps(np){
    this.setState({
      currentData:np.currentData,
      currentGeneration:np.currentGeneration,
      running:np.running
    });

    if(np.running===false && this.props.running===true){// && this.props.running===false){
      clearInterval(this.timer);
      this.runningTimers=0;
    }
    // Launching and limiting the numbers of timers
    if(np.running===true && this.runningTimers===0){
      this.runningTimers++;
      this.timer=setInterval(this._tick, 1000);
    }
  }


  _tick(){
    // Build array of current data
    var size=this.state.currentData.length;
    var newState=[];
    for(let i=0; i<this.state.currentData.length; i++){
      var row=[];
      for(let j=0; j<this.state.currentData.length; j++){
        row.push(this._calcCellState(i+':'+j));
      }
      newState.push(row);
    }
    // update data in the parent
    this.props._updateGeneration(newState, this.state.currentGeneration+1);
  }

  _renderCells(){
    var rows=[];
    for(let i=0; i<this.state.currentData.length; i++){
      var cols=[];
      for(let j=0; j<this.state.currentData.length; j++){
        cols.push(<Cell
          state={this.state.currentData[i][j]}
          key={i+':'+j}
          ref={i+':'+j}
          reference={i+':'+j}
          _toggleCell={this._toggleCell.bind(this)}
          />);
      }
      rows.push(<div className="row" key={i}>{cols}</div>);
    }
    return rows;
  }

  _toggleCell(ref){
    var cell=ref.split(':');
    var x=Number (cell[0]);
    var y=Number (cell[1]);
    var clone=this.state.currentData.slice(0);
    clone[x][y]=!clone[x][y];
    this.setState({currentData:clone});
  }

  render(){
    return(
      <div id="game">
        {this._renderCells()}
      </div>
    );
  }

  // Calculate the number of living cells around a given position.
  _calcCellState(pos){
    var cell=pos.split(':');
    var x=Number (cell[0]);
    var y=Number (cell[1]);
    var currState=this._getCellState(x, y);
    // Get adjacent cells
    var sum=0;
    sum+=this._getCellState(x-1, y-1);
    sum+=this._getCellState(x, y-1);
    sum+=this._getCellState(x+1, y-1);
    sum+=this._getCellState(x-1, y);
    sum+=this._getCellState(x+1, y);
    sum+=this._getCellState(x-1, y+1);
    sum+=this._getCellState(x, y+1);
    sum+=this._getCellState(x+1, y+1);

    // Living cell
    if(currState===1){
      // < 2 live neighbors
      if(sum<2){return false;}
      // 2 or 3
      if(sum===2 || sum===3){return true;}
      // > 3
      if(sum>3){return false;}
    }else{
      if(sum===3){return true;}
    }
    return false
  }

  // Returns the current state of a given cell.
  _getCellState(x,y){
    if(x>=0 && y>=0 && x<this.state.currentData.length && y<this.state.currentData.length){
      return (this.refs[x+':'+y].state.state===true)?1:0;
    }else{
      return 0;
    }
  }
}

export default Game;
