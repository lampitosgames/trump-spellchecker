import React, { Component } from 'react';
import {subscribeToTweets} from './api/api';
import './App.css';

class App extends Component {
  state = {
      message: "test",
      io: undefined
  }

  componentDidMount() {
    subscribeToTweets();
  }

  getHelloWorld = () => {
    fetch('/api/helloWorld')
      .then(res => res.json())
      .then(data => {
          this.setState({message: data.message});
      });
  }

  render() {
    return (
      <div className="App">
          {this.state.message}
      </div>
    );
  }
}

export default App;
