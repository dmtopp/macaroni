var React           = require('react'),
    ReactDOM        = require('react-dom'),
    ReactTransition = require('react-addons-css-transition-group');

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
          { this.state.showKeyboard ? <Keyboard /> : null }
        </ReactTransition>
        <button type="button" onClick={ this.switchInstruments }>{ this.state.showKeyboard ? 'Drums' : 'Keyboard' }</button>
      </div>
    )
  }
})



var Keyboard = React.createClass({
  getInitialState: function() {
    var notesInOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var keyCodes = [[ 'a', 65 ],
                    [ 'w', 87 ],
                    [ 's', 83 ],
                    [ 'e', 69 ],
                    [ 'd', 68 ],
                    [ 'f', 70 ],
                    [ 't', 84 ],
                    [ 'g', 71 ],
                    [ 'y', 89 ],
                    [ 'h', 72 ],
                    [ 'u', 85 ],
                    [ 'j', 74 ],
                    [ 'k', 75 ],
                    [ 'o', 79 ],
                    [ 'l', 76 ],
                    [ 'p', 80 ],
                    [ ';', 186 ],
                    [ '\'', 222]];
    return {
      keyCodes: keyCodes,
      notesInOrder: notesInOrder,
      octave: 4
    }
  },
  render: function() {
    var notesInOrder = this.state.notesInOrder,
        octave = this.state.octave,
        noteOctave,
        note,
        className,
        keyNumber;

    var keys = this.state.keyCodes.map(function(key, i){
      // adjust our octave if we are past the first 12 notes
      noteOctave = i > 11 ? String(octave + 1) : String(octave),
      note = notesInOrder[i % 12] + noteOctave,
      // notes that have a # on them are black keys!
      className = note.length === 3 ? 'blackKey' : 'whiteKey';

      // key number is the midi note number for our note
      // currently there are no connection features in this project
      // but it gives us a nice way to find the frequency
      keyNumber = i + (octave * 12)  + 12;

      // myKey = alphanumeric keyboard key to map to the musical keyboard key
      // key = index for react to use so it doesn't freak out
      return <Key note={ note }
                  myKey={ key[1] }
                  myLetter={ key[0] }
                  key={ i }
                  className={ className }
                  keyNumber={ keyNumber } />
    })

    return (
      <div className='keyboardContainer'>
        { keys }
        <select className="keyboardParams" name="osc1">
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
        </select>

        <select className="keyboardParams" name="osc2">
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
        </select>

        <select className="keyboardParams" name="filterType">
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
        </select>

        <small>Attack</small>
        <input className="keyboardParams" type="range" name="attack" defaultValue="0" min="0" max="100" />
        <small>Release</small>
        <input className="keyboardParams" type="range" name="release" defaultValue="0" min="0" max="100" />
        <small>Cutoff</small>
        <input className="keyboardParams" type="range" name="filterCutoff" defaultValue="50" min="0" max="100" />
        <small>Osc1Detune</small>
        <input className="keyboardParams" type="range" name="osc1Detune" defaultValue="0" min="0" max="100" />
        <small>Osc2Detune</small>
        <input className="keyboardParams" type="range" name="osc2Detune" defaultValue="0" min="0" max="100" />
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
    var myKey = this.props.myKey;
    // var self = this;
    if (e.keyCode === myKey) {
      var state = this.state;
      state.className = state.className + ' pressed';
      this.setState(state);
    }
  },
  keyup: function(e) {
    var myKey = this.props.myKey;
    // var self = this;
    if (e.keyCode === myKey) {
      var state = this.state;
      state.className = state.className.split(' ')[0];
      this.setState(state);
    }
  },
  componentDidMount: function() {
    var note = this.props.note;
    var myKey = this.props.myKey;
    var frequency = this.state.frequency;
    // each key listents for its own keycode to be pressed
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  },
  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  },
  mouseDown: function() {
    // var state = this.state;
    // state.className = state.className + ' pressed';
    // this.setState(state);
    // console.log(this.props.note + ' down!');
  },
  mouseUp: function() {
    // var state = this.state;
    // state.className = state.className.split(' ')[0];
    // this.setState(state);
    // console.log(this.props.note + ' up!');
  },
  render: function() {
    return <div className={ this.state.className } onMouseDown={ this.mouseDown } onMouseUp={ this.mouseUp }>
      { this.props.myLetter.toUpperCase() }
    </div>
  }
})


ReactDOM.render(<InstrumentContainer />, document.querySelector('#react-container'));
