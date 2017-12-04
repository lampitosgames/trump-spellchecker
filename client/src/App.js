import React, { Component } from 'react';
// import {subscribeToTweets} from './api/api';

import Counter from './components/counter';

class App extends Component {
  componentDidMount() {
    // subscribeToTweets();
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
          <Counter name="test"/>
      </div>
    );
  }
}

export default App;
