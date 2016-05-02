var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

/* Keyboard and key components
 * =============================================================================
 * ============================================================================= */
var Keyboard = React.createClass({
  getInitialState: function() {
    return {
      keyCodes: require('../data/keyCodesKeyboard.js'),
      notesInOrder: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      octave: 4
    }
  },
  render: function() {
    var notesInOrder = this.state.notesInOrder,
        octave = this.state.octave,
        self = this,
        noteOctave,
        note,
        className,
        keyNumber;

    var keys = this.state.keyCodes.map(function(key, i) {
      // adjust our octave if we are past the first 12 notes
      noteOctave = i > 11 ? String(octave + 1) : String(octave);
      note = notesInOrder[i % 12] + noteOctave;
      className = note.length === 3 ? 'blackKey' : 'whiteKey';
      // MIDI number for our note
      keyNumber = i + (octave * 12)  + 12;

      // myKey = alphanumeric keyboard key to map to the musical keyboard key
      // key = index for react to use so it doesn't freak out
      return <Key myKey={ key[1] }
                  myLetter={ key[0] }
                  key={ i }
                  className={ className }
                  keyNumber={ keyNumber }
                  keyboardDown={ self.props.keyboardDown }
                  keyboardUp={ self.props.keyboardUp } />
    })

    var sliderParamNames = [['attack', 'Attack'],
                            ['release', 'Release'],
                            ['filterCutoff', 'Filter Cutoff'],
                            ['osc1Detune', 'Oscillator 1 Detune'],
                            ['osc2Detune', 'Oscillator 2 Detune']];

    var selectParamNames = [['osc1', 'Oscillator 1'],
                            ['osc2', 'Oscillator 2'],
                            ['filterType', 'Filter Type']]

    var oscOptions = [['square', 'Square'],
                      ['sine', 'Sine'],
                      ['triangle', 'Triange'],
                      ['sawtooth', 'Sawtooth']];

    var selectOscOptions = oscOptions.map(function(option, i) {
      return <option value={ option[0] } key={ i }>{ option[1] }</option>
    })

    var paramSelectors = selectParamNames.map(function(paramName, i) {
      return <KeyParamSelector key={ i } name={ paramName[0] } labelName={ paramName[1] } options={ selectOscOptions }/>
    })

    var paramSliders = sliderParamNames.map(function(paramName, i) {
      return <KeyParamSlider key={ i } name={ paramName[0] } labelName={ paramName[1] } />
    })


    return (

      <div className='keyboardContainer'>
        { keys }
        { paramSelectors }

        <select className="keyboardParams" name="filterType" onChange={ this.props.keyParamsHandler }>
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
        </select>

        { paramSliders }
      </div>
    )
  }

})


var Key = React.createClass({
  getInitialState: function() {
    return {
      frequency: 440 * Math.pow(2, (this.props.keyNumber - 69) / 12),
      className: this.props.className
    }
  },
  keydown: function(e) {
    if (e.keyCode === this.props.myKey) {
      var state = this.state;
      state.className = state.className + ' pressed';
      this.setState(state);

      this.props.keyboardDown(this.state.frequency);
    }
  },
  keyup: function(e) {
    if (e.keyCode === this.props.myKey) {
      var state = this.state;
      state.className = state.className.split(' ')[0];
      this.setState(state);

      this.props.keyboardUp(this.state.frequency);
    }
  },
  componentDidMount: function() {
    // each key listents for its own keycode to be pressed
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  },
  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  },
  render: function() {
    return <div className={ this.state.className }>
      { this.props.myLetter.toUpperCase() }
    </div>
  }
})

var KeyParamSlider = React.createClass({
  render: function() {
    return(<div>
      <small>{ this.props.labelName }</small>
      <input type="range"
             className="keyboardParams"
             onChange={ this.props.keyParamsHandler }
             name={ this.props.name }
             defaultValue="0"
             />
    </div>

    )
  }
})

var KeyParamSelector = React.createClass({
  render: function() {
    return(
      <div>
        <small>{ this.props.labelName }</small>
        <select className="keyboardParams"
                name={ this.props.name }
                onChange={ this.props.keyParamsHandler }>
          { this.props.options }
        </select>
      </div>
    )
  }
})


/* End keyboard and key components
* ============================================================================= */

module.exports = Keyboard;
