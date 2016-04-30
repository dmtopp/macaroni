var React    = require('react'),
    ReactDOM = require('react-dom');

var Keyboard = React.createClass({
  getInitialState: function(){
    var notesInOrder = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
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
        key_number,
        frequency;

    var keys = this.state.keys.map(function(key, i){

      // adjust our octave if we are past the first 12 notes
      noteOctave = i > 11 ? String(octave + 1) : String(octave),
      note = notesInOrder[i % 12 + 3] + noteOctave,
      console.log(note);
      // notes that have a # on them are black keys!
      className = note.length === 3 ? 'blackKey' : 'whiteKey';

      if (i < 3) {
          key_number = i + 12 + ((octave - 1) * 12) + 1;
      } else {
          key_number = i + ((octave - 1) * 12) + 1;
      }

      frequency = 440 * Math.pow(2, (key_number - 49) / 12);
      // console.log(key_number, frequency);

      // myKey = alphanumeric keyboard key to map to the musical keyboard key
      // key = index for react to use so it doesn't freak out
      return <Key note={ note }
                  myKey={ key }
                  key={ i }
                  className={ className }
                  frequency={ frequency } />
    })

    return <div>
      { keys }
    </div>
  }

})


var Key = React.createClass({
  getInitialState: function() {
    return {
      // use sample data for now
      // later these will be passed from the parent
      note: this.props.note,
      myKey: this.props.myKey,
      className: this.props.className,
      frequency: this.props.frequency
    }
  },
  componentDidMount: function() {
    var note = this.state.note;
    var myKey = this.state.myKey;
    var frequency = this.state.frequency;
    key(myKey, function() { console.log('You pressed ' + frequency + ' HZ!') });
  },
  clickHandler: function() {
    console.log('You clicked on ' + this.state.frequency + 'HZ!');
  },
  render: function() {
    return <div className={ this.state.className } onClick={ this.clickHandler }></div>
  }
})


ReactDOM.render(<Keyboard />, document.querySelector('#react-container'));
