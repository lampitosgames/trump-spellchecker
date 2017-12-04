import React, { Component } from 'react';
import Counter from './components/Counter.js';
import TweetList from './components/TweetList.js';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Counter name="test"/>
          <TweetList />
      </div>
    );
  }
}

export default App;
