var React               = require('react'),
    ReactDOM            = require('react-dom'),
    ReactTransition     = require('react-addons-css-transition-group'),
    sounds              = require('../data/sounds.js'),
    keyboardData        = require('../data/keyboardData.js'),
    InstrumentContainer = require('./03instrument-container.jsx'),
    ChatContainer       = require('./02chat.jsx'),
    LoginRegister       = require('./07login-register.jsx');

/* 'Global' container component
* =============================================================================
* The all-seeing, all-knowing parent component.  Contains information about
*   which child components to display.  Is also responsible for sending
*   socket.io messages to the server and all audio generation.
* ============================================================================= */
var Container = React.createClass({
  getInitialState: function() {
    var context = new AudioContext;
    var masterVolume = context.createGain();

    masterVolume.gain.value = 0.3;
    masterVolume.connect(context.destination);

    return {
      isAuthenticated: false,
      username: 'Mysterious Stranger',
      displayLogin: false,
      sockets: io.connect(),
      context: context,
      masterVolume: masterVolume,
      oscillators: {},
      messages: [{ username: 'Macaroni',
                   text: 'Welcome to macaroni!  Enter a room name to join or start a noodle.',
                   className: 'from-app' }],
      keyboardData: keyboardData,
      sounds: sounds
    }
  },
  loadAudio: function(object, url) {
    var request = new XMLHttpRequest();
    var context = this.state.context;

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer){
        object.buffer = buffer;
      });
    }

    request.send();
  },
  componentDidMount: function() {
    var sockets = this.state.sockets,
        keyboardData = this.state.keyboardData,
        self = this,
        context = this.state.context;

    this.state.sounds.forEach(function(sound){
      self.loadAudio(sound, sound.url);
      sound.play = function (time) {
        var s = context.createBufferSource();
        s.buffer = sound.buffer;
        s.connect(self.state.masterVolume);
        s.start(time);
        sound.s = s;
      }
    })

    // sockets event handlers
    // ----------------------
    sockets.on('keyboardDown', function(keyboardData) {
      self.playNote(keyboardData.data, keyboardData.frequency);
    })

    sockets.on('keyboardUp', function(keyboardData) {
      var release = keyboardData.data.release,
          frequency = keyboardData.frequency,
          context = self.state.context;
      self.state.oscillators[frequency].volume.gain.setTargetAtTime(0, context.currentTime, release);
    })

    sockets.on('drumPadTrigger', function(data) {
      self.state.sounds[data.padNumber].play(data.time);
    })

    sockets.on('new-message', function(messageData) {
      var state = self.state;
      state.messages.push(messageData);
      self.setState(state);
    })

  },
  // handles the user's changing of keyboard parameters
  keyParamsHandler: function(e) {
    var name = e.target.name;
    var value = e.target.value;
    var state = this.state;
    e.target.blur();

    switch (name) {
      case 'attack':
      case 'release':
        state.keyboardData[name] = (value / 100) * 2 + 0.001;
        break;
      case 'filterCutoff':
        state.keyboardData[name] = (value / 100) * 20000;
        break;
      case 'osc1Detune':
      case 'osc2Detune':
        state.keyboardData[name] = (value / 100) * 100;
        break;
      case 'filterType':
      case 'osc1':
      case 'osc2':
        state.keyboardData[name] = value;
        break;
    }

    this.setState(state);
  },
  playNote: function(data, frequency) {
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
    oscVolume.gain.setTargetAtTime(0.5, context.currentTime, data.attack);

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
  drumPadTrigger: function(data) {
    this.state.sockets.emit('drumPadTrigger', data);
  },
  joinRoom: function(roomName) {
    var username = this.state.username || 'Mysterious Stranger';
    this.state.sockets.emit('join-room', roomName);
    this.sendMessage({
      text: username + ' has joined ' + roomName,
      username: 'Macaroni',
      className: 'from-app'
    });
  },
  sendMessage: function(data) {
    this.state.sockets.emit('send-message', data);
  },
  handleLogin: function(data) {
    var state = this.state;
    state.isAuthenticated = true;
    state.username = data.username;
    this.setState(state);
  },
  handleLogout: function(data) {
    var state = this.state;
    state.isAuthenticated = false;
    state.username = 'Mysterious Stranger';
    this.setState(state);
  },
  changeToLogin: function() {
    var state = this.state;
    state.displayLogin = !state.displayLogin;
    this.setState(state);
  },
  render: function() {
    var main = <div>
                 <div className='row'>
                   <h1>Macaroni</h1>
                   <AuthButtons isAuthenticated={ this.state.isAuthenticated }
                                handleLogout={ this.handleLogout }
                                changeToLogin={ this.changeToLogin } />
                 </div>
                 <div className='row'>
                   <InstrumentContainer  keyboardDown={ this.keyboardDown }
                                         keyboardUp={ this.keyboardUp }
                                         keyParamsHandler={ this.keyParamsHandler }
                                         drumPadTrigger={ this.drumPadTrigger }
                                         context={ this.state.context } />
                   <ChatContainer joinRoom={ this.joinRoom }
                                  sendMessage={ this.sendMessage }
                                  messages={ this.state.messages }
                                  username={ this.state.username }/>

                 </div>
              </div>

    var login = <div className='row'><LoginRegister handleLogin={ this.handleLogin }
                                                    changeToMain={ this.changeToLogin }/></div>

    return <div>
      { this.state.displayLogin ? <div>{ login }</div> : <div>{ main }</div> }

    </div>
  }
})


var AuthButtons = React.createClass({
  render: function() {
    if (this.props.isAuthenticated) {
      return <div className='auth button' onClick={ this.props.handleLogout }>Logout</div>
    } else {
      return <div className='auth button' onClick={ this.props.changeToLogin }>Log In</div>
    }
  }
})
/* End container component
* ============================================================================= */

ReactDOM.render(<Container />, document.querySelector('#react-container'));
