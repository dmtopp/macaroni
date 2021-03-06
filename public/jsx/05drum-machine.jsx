var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

/* Drum Machine and Drum Pad components
* =============================================================================
* Drum Machine component is responsible for handling the data associated with
*   each individual drum pad.
* Drum Pad components contain a div that serves as a visual representaion of
*   when a pad is pressed as well as a clickable button to loop each drum sound.
*   Each drum pad adds an event listener to the DOM when it mounts to listen for
*   its associated key, and calls a function belonging to the 'global' parent
*   component to trigger the acutal sound.
* ============================================================================= */

var DrumMachine = React.createClass({
  render: function() {
    var self = this;
    var keyCodes = require('../data/keyCodesDrumPad.js');
    var pads = keyCodes.map(function(key, i) {
      return <DrumPad myLetter={ key[0] }
                      myKey={ key[1] }
                      key={ i }
                      padNumber={ i }
                      drumPadTrigger={ self.props.drumPadTrigger }/>
    })
    return (<div className='drum-machine-container'>
      { pads }
      <div className='u-full-width'>
        <div className='button prevInst' onClick={ this.props.switchInstruments } value="1">Prev</div>
        <div className='button nextInst' onClick={ this.props.switchInstruments } value="-1">Next</div>
      </div>
    </div>)
  }
})

var DrumPad = React.createClass({
  getInitialState: function() {
    return {
      className: 'drumPad'
    }
  },
  componentDidMount: function() {
    var myKey = this.props.myKey;
    // each key listents for its own keycode to be pressed
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  },
  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  },
  keydown: function(e) {
    if (e.keyCode === this.props.myKey) {
      this.props.drumPadTrigger({ padNumber: this.props.padNumber,
                                  time: 0 });
      var state = this.state;
      state.className = state.className + ' pressed';
      this.setState(state);
    }
  },
  keyup: function(e) {
    if (e.keyCode === this.props.myKey) {
      var state = this.state;
      state.className = state.className.split(' ')[0];
      this.setState(state);
    }
  },
  render: function() {
    return (
      <div className='pad-container'>
        <div className={ this.state.className }>
          <p>{ this.props.myLetter.toUpperCase() }</p>
        </div>

      </div> )

  }
})

/* End Drum container and drum pad components
* ============================================================================= */

module.exports = DrumMachine;
