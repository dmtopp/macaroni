var React           = require('react'),
    ReactDOM        = require('react-dom'),
    ReactTransition = require('react-addons-css-transition-group');



/* 'Global' container component
* =============================================================================
* The all-seeing, all-knowing parent component.  Contains information about
*   which child components to display.  Is also responsible for sending
*   socket.io messages to the server and playing the sounds triggered by
*   instruments.
* ============================================================================= */
var Container = React.createClass({
  getInitialState: function() {
    var context = new AudioContext;
    var masterVolume = context.createGain();

    masterVolume.gain.value = 0.3;
    masterVolume.connect(context.destination);

    return {
      sockets: io.connect(),
      context: context,
      masterVolume: masterVolume,
      oscillators: {},
      keyboardData: {
        osc1: 'square',
        osc2: 'triangle',
        attack: 0.001,
        release: 0.5,
        filterType: 'lowpass',
        filterCutoff: 2000,
        osc1Detune: -5,
        osc2Detune: 5
      }
    }
  },
  componentDidMount: function(){
    var sockets = this.state.sockets,
        keyboardData = this.state.keyboardData,
        self = this;
    sockets.on('keyboardDown', function(keyboardData){
      // console.log(keyboardData.frequency);
      self.playNote(keyboardData.data, keyboardData.frequency);
    })

    sockets.on('keyboardUp', function(keyboardData){
      var release = keyboardData.data.release,
          frequency = keyboardData.frequency,
          context = self.state.context;
      self.state.oscillators[frequency].volume.gain.setTargetAtTime(0, context.currentTime, release);
    })


  },
  playNote: function(data, frequency){
    var state = this.state;
    var context = this.state.context;
    var osc = context.createOscillator();
    var osc2 = context.createOscillator();
    var oscVolume = context.createGain();
    var filter = context.createBiquadFilter();

    osc.start(context.currentTime);
    osc2.start(context.currentTime);

    osc.type = data.osc1;
    osc2.type = data.osc2;

    // set gain for both oscillators
    // start gain at 0 and then ramp up over attack time
    oscVolume.gain.value = 0;
    oscVolume.gain.setTargetAtTime(1, context.currentTime, data.attack);

    osc.frequency.value  = frequency;
    osc2.frequency.value = frequency;
    osc.detune.value = data.osc1Detune;
    osc2.detune.value = data.osc2Detune;

    filter.type = data.filterType;
    filter.frequency.value = data.filterCutoff;

    // (osc, osc2) -> oscVolume -> master out
    osc.connect(oscVolume);
    osc2.connect(oscVolume);
    oscVolume.connect(filter);
    filter.connect(this.state.masterVolume);

    // keep track of our oscillators and volume in state
    var oscObject = {
      voices: [osc],
      volume: oscVolume
    }

    state.oscillators[frequency] = oscObject;
    this.setState(state);

  },
  keyboardDown: function(frequency) {
    var oscSocketData = {
      data: this.state.keyboardData,
      frequency: frequency
    }
    this.state.sockets.emit('keyboardDown', oscSocketData);
  },
  keyboardUp: function(frequency) {
    var oscSocketData = {
      data: this.state.keyboardData,
      frequency: frequency
    }
    this.state.sockets.emit('keyboardUp', oscSocketData);
  },
  render: function() {
    return <InstrumentContainer keyboardDown={ this.keyboardDown } keyboardUp={ this.keyboardUp } />
  }
})


/* End container component
* ============================================================================= */

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
                                                keyboardUp={ this.props.keyboardUp } />
                                    : <DrumMachine /> }
        </ReactTransition>
        <button type="button" onClick={ this.switchInstruments }>{ this.state.showKeyboard ? 'Drums' : 'Keyboard' }</button>
      </div>
    )
  }
})

/* End Drum container and drum pad components
* ============================================================================= */

/* Keyboard and key components
 * =============================================================================
 * ============================================================================= */
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
        self = this,
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
                  keyNumber={ keyNumber }
                  keyboardDown={ self.props.keyboardDown }
                  keyboardUp={ self.props.keyboardUp } />
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
    // these functions are left here so mouse input functionality can be added later
  },
  mouseUp: function() {
    // these functions are left here so mouse input functionality can be added later
  },
  render: function() {
    return <div className={ this.state.className } onMouseDown={ this.mouseDown } onMouseUp={ this.mouseUp }>
      { this.props.myLetter.toUpperCase() }
    </div>
  }
})

/* End keyboard and key components
* ============================================================================= */

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
  getInitialState: function() {
    var keyCodes = [[ 'a', 65 ],
                    [ 's', 83 ],
                    [ 'd', 68 ],
                    [ 'f', 70 ],
                    [ 'j', 74 ],
                    [ 'k', 75 ],
                    [ 'l', 76 ],
                    [ ';', 186 ]]
    return {
      keyCodes: keyCodes
    }
  },
  render: function() {
    var pads = this.state.keyCodes.map(function(key, i){
      return <DrumPad myLetter={ key[0] } myKey={ key[1] } key={ i } />
    })
    return (<div className='drum-machine-container'>
      { pads }
    </div>)
  }
})

var DrumPad = React.createClass({
  getInitialState: function() {
    return {
      className: 'drumPad',
      loop: false
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
  loopToggle: function() {
    var state = this.state;
    state.loop = !this.state.loop;
    this.setState(state);
  },
  render: function() {
    return (
      <div className="pad-container">
        <div className={ this.state.className }>
          { this.props.myLetter.toUpperCase() }
        </div>
        { this.state.loop ? <div className="loop-toggle pressed" onClick={ this.loopToggle }>Loop</div>
                          : <div className="loop-toggle" onClick={ this.loopToggle }>Loop</div> }

      </div> )

  }
})

/* End Drum container and drum pad components
* ============================================================================= */

ReactDOM.render(<Container />, document.querySelector('#react-container'));
