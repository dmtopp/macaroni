var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group'),
    Keyboard        = require('./04keyboard.jsx'),
    DrumMachine     = require('./05drum-machine.jsx');


/* Instrument container component
* =============================================================================
* Instrument container is responsible for switching between the drum machine
*   and keyboard components.
* ============================================================================= */
var InstrumentContainer = React.createClass({
  getInitialState: function() {
    return {
      showKeyboard: true
    }
  },
  switchInstruments: function() {
    var state = this.state;
    state.showKeyboard = !this.state.showKeyboard;
    this.setState(state);
  },
  render: function() {
    return (
      <div className="instrument-container">
        <ReactTransition transitionName="instrument" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          { this.state.showKeyboard ? <Keyboard keyboardDown={ this.props.keyboardDown }
                                                keyboardUp={ this.props.keyboardUp }
                                                keyParamsHandler={ this.props.keyParamsHandler } />
                                    : <DrumMachine drumPadTrigger={ this.props.drumPadTrigger }/> }
        </ReactTransition>
        <button type="button" onClick={ this.switchInstruments }>{ this.state.showKeyboard ? 'Drums' : 'Keyboard' }</button>
      </div>
    )
  }
})

/* End instrument container component
* ============================================================================= */
module.exports = InstrumentContainer;
