import React, { Component } from 'react'; 
import Particles from "react-tsparticles";
import Navigation from './componenets/navigation/navigation.component';
import SignIn from './componenets/sign-in/sign-in.component'
import Register from './componenets/register/register.component';
import Logo from './componenets/logo/logo.component';
import Rank from './componenets/rank/rank.component';
import ImageLinkForm from './componenets/image-link-form/image-link-form.component';
import FaceRegognition from './componenets/face-recognition/face-recognition.component';
import './App.css';

const particlesOptions = {
  fpsLimit: 120,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "right",
      enable: true,
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 120,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'sign-in',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: 
      {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.clientWidth);
    const height = Number(image.clientHeight);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    const { input, user } = this.state;
    this.setState({ imageUrl: input});
    fetch('https://quiet-bayou-96809.herokuapp.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ input })
    })
    .then(response => response.json())
    .then(response => {      
      fetch('https://quiet-bayou-96809.herokuapp.com/image', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ id: user.id })
      })
      .then(response => response.json())
      .then(count => this.setState(Object.assign(user, { entries: count })))
      .catch(console.log)
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(console.log);
  }

  onRouteChange = (route) => {
    if(route === 'sign-out') 
      this.setState(initialState)
    else if(route === 'home')
      this.setState({isSignedIn: true});

    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' id="tsparticles" options={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRegognition imageUrl={imageUrl} box={box} />
            </div>
          : ( route === 'sign-in' 
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
