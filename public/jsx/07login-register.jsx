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
    var path = e.target.value;
    var state = this.state;
    var request = new XMLHttpRequest();
    var self = this;

    if (path === '/register' && (!state.newUsername || !state.newPassword || !state.confirmPassword)) {
      state.message = 'Please fill out all three fields to register a new user.';
      this.setState(state);
    } else if (path === '/register' && (state.newPassword != state.confirmPassword)){
      state.message = 'Passwords do not match!';
      this.setState(state);
    } else if (path === '/login' && (!state.username || !state.password)) {
      state.message = 'Please enter both username and password to log in.';
      this.setState(state);
    } else {
      request.open('POST', '/users' + e.target.value, true);
      request.setRequestHeader('Content-Type', 'application/json');

      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
          var responseData = JSON.parse(request.responseText);

          state.message = responseData.message;
          if (responseData.username) {
            self.props.handleLogin(responseData);
            self.props.changeToLogout();
          } else {
            self.setState(state);
          }


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
      { this.state.message ? <p className='login-message'>{ this.state.message }</p> : null }
      <div className='six columns login'>
        <form className="form-container">
          <h3>Login</h3>
          <input type='text' name='username' placeholder='Enter a username' onChange={ this.handleChange } />
          <input type='password' name='password' placeholder='Password' onChange={ this.handleChange } />
          <div className='button' onClick={ this.handleSubmit } value='/login'>Submit</div>
        </form>
      </div>

      <div className='six columns login'>
        <form className="form-container">
          <h3>Register</h3>
          <input type='text' name='newUsername' placeholder='Enter a username' onChange={ this.handleChange } />
          <input type='password' name='newPassword' placeholder='Password' onChange={ this.handleChange } />
          <input type='password' name='confirmPassword' placeholder='Confirm password' onChange={ this.handleChange } />
          <div className='button' onClick={ this.handleSubmit } value='/register'>Submit</div>
        </form>
      </div>

      <div className='twelve columns'>
        <div className='button u-pull-right' onClick={ this.props.changeToMain }>Back</div>
      </div>


    </div>
  }
})



module.exports = LoginSignup;
