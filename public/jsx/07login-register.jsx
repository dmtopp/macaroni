var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

var LoginSignup = React.createClass({
  getInitialState: function() {
    return {
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
      username: '',
      password: '',
      message: ''
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log(e.target.value);
    var path = e.target.value;
    var state = this.state;
    var request = new XMLHttpRequest();
    var self = this;

    if (path === '/register' && (!state.newUsername || !state.newPassword || !state.confirmPassword)) {
      state.message = 'Please fill out all three fields to register a new user.';
      this.setState(state);
    } else if (path === '/login' && (!state.username || !state.password)) {
      state.message = 'Please enter both username and password to log in.';
      this.setState(state);
    } else {
      request.open('POST', '/users' + e.target.value, true);
      request.setRequestHeader('Content-Type', 'application/json');

      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
          responseData = JSON.parse(request.responseText);

          state.message = responseData.message;
          if (responseDate.username) this.props.handleLogin();

          self.setState(state);
        }
      }
      request.send(JSON.stringify(state));
    }
  },
  handleChange: function(e) {
    var state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  },
  render: function() {
    return <div>
      <form className="form-container">
        <input type='text' name='newUsername' placeholder='Enter a username' onChange={ this.handleChange } />
        <input type='password' name='newPassword' onChange={ this.handleChange } />
        <input type='password' name='confirmPassword' onChange={ this.handleChange } />
        <button onClick={ this.handleSubmit } value='/register'>Submit</button>
      </form>
      <form className="form-container">
        <input type='text' name='username' placeholder='Enter a username' onChange={ this.handleChange } />
        <input type='password' name='password' onChange={ this.handleChange } />
        <button onClick={ this.handleSubmit } value='/login'>Submit</button>
      </form>
      <h2>{ this.state.message }</h2>
    </div>
  }
})



module.exports = LoginSignup;
