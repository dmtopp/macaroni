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
    // add our welcome message to chat
    this.addMessage();
    var inputs = document.querySelectorAll('input');
    var self = this;
    // stop our inputs from triggering our instrument sounds
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
          self.addMessage();
        } else {
          e.stopPropagation();
        }
      })
      inputs[i].addEventListener('keyup', function(e) {
        e.stopPropagation();
      })
    }
  },
  componentDidUpdate: function() {
    // this has our chat scroll down to the most recent message
    var chat = document.querySelector('#chat');
    chat.scrollTop = chat.scrollHeight;
  },
  addMessage: function() {
    var text = this.state.message,
        messageData = {
          username: this.props.username || 'Mysterious Stranger',
          text: text
        }
    if (text) {
      this.props.sendMessage(messageData);
      var state = this.state;
      state.message = '';
      this.setState(state);

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
