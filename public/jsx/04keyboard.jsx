var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

/* Keyboard and key components
 * =============================================================================
 * ============================================================================= */
var Keyboard = React.createClass({
  getInitialState: function() {
    return {
      octave: 4
    }
  },
  changeOctave: function(e) {
    // console.log(e.target.value);
    var state = this.state;
    state.octave += parseInt(e.target.value);
    this.setState(state);
    // console.log(this.state);
  },
  render: function() {
    var notesInOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        keyCodes = require('../data/keyCodesKeyboard.js'),
        octave = this.state.octave,
        self = this,
        note,
        className,
        keyNumber,
        frequency;

    var keys = keyCodes.map(function(key, i) {
      // adjust our octave if we are past the first 12 notes
      note = notesInOrder[i % 12];
      className = note.length === 2 ? 'blackKey' : 'whiteKey';
      // MIDI number for our note
      keyNumber = i + (octave * 12)  + 12;
      frequency = 440 * Math.pow(2, (keyNumber - 69) / 12)
      // myKey = alphanumeric keyboard key to map to the musical keyboard key
      // key = index for react to use so it doesn't freak out
      return <Key myKey={ key[1] }
                  myLetter={ key[0] }
                  key={ i }
                  className={ className }
                  keyNumber={ keyNumber }
                  frequency={ frequency }
                  keyboardDown={ self.props.keyboardDown }
                  keyboardUp={ self.props.keyboardUp } />
    })

    var paramData = require('../data/keyParamsData.js');


    var paramSelectors = paramData.selectors.map(function(parameter, i) {
      return <KeyParamSelector key={ i }
                               name={ parameter.name }
                               labelName={ parameter.labelName }
                               options={ parameter.options }
                               optionsNames={ parameter.optionsNames }
                               keyParamsHandler={ self.props.keyParamsHandler } />
    })

    var paramSliders = paramData.sliders.map(function(paramName, i) {
      return <KeyParamSlider key={ i }
                             name={ paramName.name }
                             labelName={ paramName.labelName }
                             keyParamsHandler={ self.props.keyParamsHandler }/>
    })
    return (
      <div>
        <div className='row'>
          { keys }
        </div>
        <div className='row'>
          <div className='four columns'>
            { paramSelectors }
          </div>
          <div className='five columns'>
            { paramSliders }
          </div>
          <div className='three columns'>
            <button onClick={ this.changeOctave } value="1">+</button>
            <button onClick={ this.changeOctave } value="-1">-</button>
          </div>
        </div>
      </div>
    )
  }

})


var Key = React.createClass({
  getInitialState: function() {
    return {
      className: this.props.className
    }
  },
  keydown: function(e) {
    if (e.keyCode === this.props.myKey) {
      var state = this.state;
      state.className = state.className + ' pressed';
      this.setState(state);

      this.props.keyboardDown(this.props.frequency);
    }
  },
  keyup: function(e) {
    if (e.keyCode === this.props.myKey) {
      var state = this.state;
      state.className = state.className.split(' ')[0];
      this.setState(state);

      this.props.keyboardUp(this.props.frequency);
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
    var self = this;
    var options = this.props.options.map(function(option, i) {
      return <option value={ option } key={ i }>{ self.props.optionsNames[i] }</option>
    })

    return(
      <div>
        <small>{ this.props.labelName }</small>
        <select className="keyboardParams"
                name={ this.props.name }
                onChange={ this.props.keyParamsHandler }>
          { options }
        </select>
      </div>
    )
  }
})


/* End keyboard and key components
* ============================================================================= */

module.exports = Keyboard;
