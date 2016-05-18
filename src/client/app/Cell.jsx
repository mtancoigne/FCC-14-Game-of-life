import React from 'react';

/* ------------------------------

Cell

------------------------------ */
class Cell extends React.Component{
  constructor(props){
    super(props);
    this.state={state:this.props.state};
  }

  componentWillReceiveProps(np){
    this.setState({state:np.state});
  }

  render(){
    return (
      <div
        className={this.state.state?'cell cell-alive':'cell'}
        onClick={this._toggleInitialCell.bind(this)}
        style={{width: 100/this.props.gridSize + '%'}}/>
    )
  }

  _toggleInitialCell(){
    this.props._toggleCell(this.props.reference);
  }
}

export default Cell
