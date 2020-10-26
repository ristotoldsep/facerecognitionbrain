import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: '32d66d5ba7d448b1ba43c4b8941fcff5'
});

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800,
        color: "#3CA9D1",
      }
    }
  }
}

class App extends Component {
  constructor() { //Creating state
    super(); // To be able to use 'this'
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  // PARAMETER OF APP
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //HERE I CAN CHANGE MODEL ID
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state; //Destructuring/refactoring codE!
    return (
      //COMPONENTS
        <div className="App">
        <Particles className="particles"
        params={particlesOptions} />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          { route === 'home'
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
            : (
              route === 'signin' 
              ? <SignIn onRouteChange={this.onRouteChange} /> //if not signed in, show form, if signed in, show content!  
              : <Register onRouteChange={this.onRouteChange} />
            ) 
            
          }
        </div>
    );
  }
}

export default App;
