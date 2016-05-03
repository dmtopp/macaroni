var React = require('react'),
    ReactTransition = require('react-addons-css-transition-group'),
    Dilla = require('dilla');

var DrumLoop = React.createClass({
  getInitialState: function() {
    var dilla = new Dilla(this.props.context, { 'tempo': 88 });

    return {
      dilla: dilla,
      loopData: { '0': [],
                  '1': [],
                  '2': [],
                  '3': [],
                  '4': [],
                  '5': [] },
      measure: 1
    }
  },
  componentDidMount: function() {
    // this.state.dilla.set('kick', [
    //   ['1.1.01'],
    //   ['1.2.01'],
    //   ['1.3.01'],
    //   ['1.4.01'],
    //   ['2.1.01'],
    //   ['2.2.01'],
    //   ['2.3.01'],
    //   ['2.4.01']
    // ]);

    var self = this;
    this.state.dilla.on('step', function(step) {
      // console.log(step);
      // console.log(this.state.dilla.position);
      self.props.drumPadTrigger({ padNumber: step.id,
                                  loop: false,
                                  time: step.time })
    })

    this.state.dilla.start();
  },
  addNote: function(noteData) {
    var state = this.state,
        channel = String(noteData.channel),
        beat = noteData.beat,
        channelBeats = this.state.loopData[channel],
        alreadyExists = false;

    channelBeats.forEach(function(channelBeat, i) {
      if (channelBeat[0] === beat) {
        channelBeats.splice(i, 1);
        alreadyExists = true;
      }
    })

    if (!alreadyExists) channelBeats.push([beat]);

    state.loopData[channel] = channelBeats;
    this.setState(state);

    this.state.dilla.set(channel, channelBeats);

  },
  render: function() {
    var BeatData = require('../data/drumMachineData.js');
    var allLoopButtons = [];
    var self = this;
    for (var i = 0; i < 6; i++) {
      var buttons = BeatData.map(function(beat, j) {
        return <LoopButton addNote={ self.addNote } key={ j } beatNumber={ j } instNumber={ i } beat={ beat[0] } />
      })
      allLoopButtons.push(buttons);
    }
    return <div className="loop-container">{ allLoopButtons }</div>
  }
})

var LoopButton = React.createClass({
  getInitialState: function() {
    return {
      className: 'loop-button',
      pressed: false
    }
  },
  loopToggle: function() {
    var state = this.state;
    // console.log(this.props.instNumber, this.props.beat);
    this.props.addNote({ beat: this.props.beat,
                         channel: this.props.instNumber,
                         active: this.state.pressed,
                         beatNumber: this.props.beatNumber })
    if (!this.state.pressed) {
      state.className = 'loop-button pressed';
      state.pressed = true;
    } else {
      state.className = 'loop-button'
      state.pressed = false;
    }

    this.setState(state);
  },
  render: function() {
    return <div className={ this.state.className } onClick={ this.loopToggle }></div>
  }
})

module.exports = DrumLoop;
