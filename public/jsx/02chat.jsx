var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

/* Chat container component
* =============================================================================
* ============================================================================= */
var ChatContainer = React.createClass({
  getInitialState: function() {
    return {
      message: '',
      roomName: ''
    }
  },
  componentDidMount: function() {
    this.addMessage();
    var inputs = document.querySelectorAll('input');


    // stop our inputs from triggering our instrument sounds
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keydown', function(e) {
        e.stopPropagation();
      })
      inputs[i].addEventListener('keyup', function(e) {
        e.stopPropagation();
      })
    }

  },
  addMessage: function() {
    var text = this.state.message
    if (text) {
      var state = this.state;
      state.message = '';
      this.setState(state);
      var messageData = {
        username: this.props.username || 'Mysterious Stranger',
        text: text
      }
      this.props.sendMessage(messageData);
    }
  },
  joinRoom: function() {
    this.props.joinRoom(this.state.roomName);
  },
  handleChange: function(e) {
    var state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  },
  render: function() {
    var messages = this.props.messages.map(function(message, i) {
      return <Message text={ message } key={ i } />
    })
    return <div className="four columns">
      <section id="chat">
        { messages }
      </section>

      <input id="chat-message"
             name="message"
             value={ this.state.message }
             onChange={ this.handleChange } />
      <button onClick={ this.addMessage }>Send</button>

      <input id="room-name"
             name="roomName"
             value={ this.state.roomName }
             onChange={ this.handleChange } />
           <button onClick={ this.joinRoom }>Join Room</button>
    </div>
  }
})

var Message = React.createClass({
  render: function() {
    return <p>{ this.props.text }</p>
  }
})

/* End chat container component
* ============================================================================= */

module.exports = ChatContainer;
