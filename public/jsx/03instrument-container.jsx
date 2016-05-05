var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group'),
    Keyboard        = require('./04keyboard.jsx'),
    DrumMachine     = require('./05drum-machine.jsx'),
    DrumLoop        = require('./06drum-loop.jsx');


/* Instrument container component
* =============================================================================
* Instrument container is responsible for switching between the drum machine
*   and keyboard components.
* ============================================================================= */
var InstrumentContainer = React.createClass({
  getInitialState: function() {
    return {
      instrumentToDisplay: 0
    }
  },
  switchInstruments: function(e) {
    var state = this.state;
    state.instrumentToDisplay += parseInt(e.target.value);
    this.setState(state);
  },
  render: function() {
    return (

        <div className="eight columns">
          <ReactTransition transitionName="instrument" transitionEnterTimeout={500} transitionLeaveTimeout={300}>

            { this.state.instrumentToDisplay % 3 === 0 ? <Keyboard keyboardDown={ this.props.keyboardDown }
                                                                   keyboardUp={ this.props.keyboardUp }
                                                                   keyParamsHandler={ this.props.keyParamsHandler } /> : null }

            { Math.abs(this.state.instrumentToDisplay) % 3 === 1 ? <DrumMachine drumPadTrigger={ this.props.drumPadTrigger }/> : null }

            { Math.abs(this.state.instrumentToDisplay) % 3 === 2 ? <DrumLoop context = { this.props.context }
                                                                   drumPadTrigger={ this.props.drumPadTrigger }/> : null }

          </ReactTransition>
            <div className='twelve columns'>
              <div className='button prevInst' onClick={ this.switchInstruments } value="1">Prev</div>
              <div className='button nextInst' onClick={ this.switchInstruments } value="-1">Next</div>
            </div>

        </div>

    )
  }
})

/* End instrument container component
* ============================================================================= */
module.exports = InstrumentContainer;
