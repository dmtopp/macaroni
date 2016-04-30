var React    = require('react'),
    ReactDOM = require('react-dom');

var Keyboard = React.createClass({
  getInitialState: function(){
    var notesInOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var keys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';', '\''];
    return {
      keys: keys,
      notesInOrder: notesInOrder,
      octave: 4
    }
  },
  render: function(){
    var notesInOrder = this.state.notesInOrder,
        octave = this.state.octave,
        noteOctave,
        note,
        className,
        keyNumber,
        frequency;

    var keys = this.state.keys.map(function(key, i){

      // adjust our octave if we are past the first 12 notes
      noteOctave = i > 11 ? String(octave + 1) : String(octave),
      note = notesInOrder[i % 12] + noteOctave,
      // notes that have a # on them are black keys!
      className = note.length === 3 ? 'blackKey' : 'whiteKey';

      // key number is the midi note number for our note
      // currently there are no connection features in this project
      // but it gives us a nice way to find the frequency
      keyNumber = i + (octave * 12)  + 12;

      frequency = 440 * Math.pow(2, (keyNumber - 69) / 12);

      // myKey = alphanumeric keyboard key to map to the musical keyboard key
      // key = index for react to use so it doesn't freak out
      return <Key note={ note }
                  myKey={ key }
                  key={ i }
                  className={ className }
                  keyNumber={ keyNumber } />
    })

    return <div>
      { keys }
    </div>
  }

})


var Key = React.createClass({
  getInitialState: function() {
    return {
      frequency: 440 * Math.pow(2, (this.props.keyNumber - 69) / 12)
    }
  },
  componentDidMount: function() {
    var note = this.props.note;
    var myKey = this.props.myKey;
    var frequency = this.state.frequency;
    key(myKey, function() { console.log(note + ' is ' + frequency + ' HZ!') });
  },
  clickHandler: function() {
    console.log(this.props.note + ' is ' + this.props.frequency + ' HZ!');
  },
  render: function() {
    return <div className={ this.props.className } onClick={ this.clickHandler }></div>
  }
})


ReactDOM.render(<Keyboard />, document.querySelector('#react-container'));
