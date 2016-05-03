var React           = require('react'),
    ReactTransition = require('react-addons-css-transition-group');

var LoginSignup = React.createClass({
  handleSubmit: function(e) {
    console.log(e.target.value);
  },
  render: function() {
    var formParams = require('../data/loginParams.js');
    // console.log(formParams);

    var signup = formParams.map(function(data, i) {
      return <FormField key={ i }
                        label={ data.label }
                        type={ data.type }
                        name={ data.name }
                        placeholder={ data.placeholder } />
    })

    var login = formParams.map(function(data, i) {
      return <FormField key={ i }
                        label={ data.label }
                        type={ data.type }
                        name={ data.name }
                        placeholder={ data.placeholder } />
    })
    login.pop();
    return <div>
      <section className="form-container">
        { signup }
        <button onClick={ this.handleSubmit }>Submit</button>
      </section>
      <section className="form-container">
        { login }
        <button onClick={ this.handleSubmit }>Submit</button>
      </section>
    </div>
  }
})


var FormField = React.createClass({
  render: function() {
    return <div>
      <small>{ this.props.label }</small>
      <input type={ this.props.type }
             name={ this.props.name }
             placeholder={ this.props.placeholder }
             onClick={ this.props.onClick }>{ this.props.text }</input>
    </div>
  }
})

module.exports = LoginSignup;
