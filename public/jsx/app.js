var React    = require('react'),
    ReactDOM = require('react-dom');

var Container = React.createClass({

  render: function() {
    return <LoginSignup />
  }
})

var LoginSignup = React.createClass({
  render: function() {
    return (
      <div className="row">

        <section className="six columns">

          <h2>Login</h2>

          <form>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Log In</button>
          </form>

        </section>

        <section className="six columns">

          <h2>Sign Up</h2>

          <form>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="confirmPassword" placeholder="Confirm password" />
            <button type="submit">Sign Up</button>
          </form>

        </section>


      </div>


    )
  }
})


ReactDOM.render(<Container />, document.querySelector('#react-container'));
