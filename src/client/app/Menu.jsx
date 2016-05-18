import React from 'react';

class Menu extends React.Component{
  constructor(props){
    super(props);

    this._toggleRun=this._toggleRun.bind(this);
  }

  render(){
    return(
      <nav id="menu">
        <div id="menuContent">
          <div>
            <div className="menuCol">
            Grid size: <input type="number" value={this.props.gridSize} onChange={
              (e)=>{this.props._gridSizeChange((e.target.value>=5)?e.target.value:5)}
            }/>
            </div>
            <div className="menuCol">
              <input id="noiseChkbx" type="checkbox"
                onChange={this.props._toggleNoise}
                checked={this.props.noise}
              /><label for="noiseChkbx"> Noise</label></div>
            <div className="menuCol">
              <input id="rdmChkbx" type="checkbox"
                onChange={this.props._toggleRandom}
                checked={this.props.randomPatterns}
              /><label for="rdmChkbx"> Random patterns</label></div>
          </div>
          <div>
            Current generation: <input id="current_generation" value={this.props.currentGeneration} type="text" disabled />
          </div>
          <div>
            <div className="menuCol">
              <button
                onClick={this.props._reset}
                >Reset</button>
            </div>
            <div className="menuCol">
              <button
                onClick={this._toggleRun}
                >{this.props.running?'Stop':'Start'}</button>
            </div>
          </div>
        </div>
        <div id="menuToggle" onClick={()=>{
            $('#menuContent').toggle();
            ($('#menuContent').is(':visible'))?$('#menuToggle').html('HIDE'):$('#menuToggle').html('SHOW');
          }}>HIDE</div>
      </nav>
    );
  }

  // Toggle the running state
  _toggleRun(){
    if(this.props.running){
      this.props._stop();
    }else{
      this.props._start();
    }
  }
}

export default Menu;
