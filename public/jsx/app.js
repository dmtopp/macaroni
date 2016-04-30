var React    = require('react'),
    ReactDOM = require('react-dom'),
    Slider   = require('react-slick');

/* React component for the container to hold all of our different
 * components
 */
var Container = React.createClass({

  render: function() {
    return <SimpleSlider />
    // return <h1>fuck yeahhh</h1>
  }
})

/* React component for the login and signup forms
 *
 */
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

var Instruments = React.createClass({
  render: function(){
    return <div></div>
  }
})

var SimpleSlider = React.createClass({

  render: function () {
    var settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
      <div>
        <h1>huhh</h1>
        <Slider {...settings}>

          <section id="soundpad">
            <div className="soundPad" id="0" data-sound="http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409274kick.wav"></div>
            <div className="soundPad" id="1" data-sound="http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409275snare.wav"></div>
            <div className="soundPad" id="2" data-sound="http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav"></div>
            <div className="soundPad" id="3" data-sound="http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409278hat.wav"></div>
          </section>

          <div id="keyboard">
            <select className="keyboardParams" name="osc1">
              <option value="square">Square</option>
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
            </select>

            <select className="keyboardParams" name="osc2">
              <option value="square">Square</option>
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
            </select>

            <select className="keyboardParams" name="filterType">
              <option value="lowpass">Lowpass</option>
              <option value="highpass">Highpass</option>
              <option value="bandpass">Bandpass</option>
            </select>

            <small>Attack</small>
            <input className="keyboardParams" type="range" name="attack" value="0" min="0" max="100" />
            <small>Release</small>
            <input className="keyboardParams" type="range" name="release" value="0" min="0" max="100" />
            <small>Cutoff</small>
            <input className="keyboardParams" type="range" name="filterCutoff" value="50" min="0" max="100" />
            <small>Osc1Detune</small>
            <input className="keyboardParams" type="range" name="osc1Detune" value="0" min="0" max="100" />
            <small>Osc2Detune</small>
            <input className="keyboardParams" type="range" name="osc2Detune" value="0" min="0" max="100" />
          </div>
        </Slider>

      </div>

    );
  }
});

ReactDOM.render(<Container />, document.querySelector('#react-container'));
