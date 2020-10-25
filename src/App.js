import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
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
      box: {}
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  // console.log(width, height);
  return {
    leftCol: clarifaiFace.left_col * width;
    topRow: clarifaiFace.top_row * height;
    rightCol: width - (clarifaiFace.right_col * width);
    bottomRow: height - (clarifaiFace.bottom_row * height);
  }
}

  // PARAMETER OF APP
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
    .then(response => this.calculateFaceLocation(response))
    .catch(err => console.log(err));
  }
  render() {
    return (
      //COMPONENTS
        <div className="App">
        <Particles className="particles"
        params={particlesOptions} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl}/>
        </div>
    );
  }
}

export default App;
