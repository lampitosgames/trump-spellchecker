import React, { Component } from 'react';
import TweetList from './components/TweetList.js';

import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <TweetList />
      </div>
    );
  }
}

export default App;
