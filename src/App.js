import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import './App.css';

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
//Creating initial state for the app
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0, //How many images has entered
        joined: '' //To track joining date
      }
}

class App extends Component {
  constructor() { //Creating state
    super(); // To be able to use 'this'
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries, //How many images has entered
      joined: data.joined //To track joining date
    }})
  }

  //CONSOLELOGGING FIRST HARDCODED USERS
/*  componentDidMount() {
    fetch("http://localhost:3000")
    .then(response => response.json())
    .then(data => console.log(data))
  } */

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
    //console.log(box);
    this.setState({box: box});
  }

  // PARAMETER OF APP
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //HERE I CAN CHANGE MODEL ID
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch("http://localhost:3000/imageurl", { //this will call image route and increment entries!
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch("http://localhost:3000/image", { //this will call image route and increment entries!
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState) //If user signed out, initialize the app state
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
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
            : (
              route === 'signin' 
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> //if not signed in, show form, if signed in, show content!  
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            ) 
            
          }
        </div>
    );
  }
}

export default App;
