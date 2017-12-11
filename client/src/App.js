import React, { Component } from 'react';
import TweetTimeline from './components/TweetTimeline.js';

import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <TweetTimeline />
      </div>
    );
  }
}

export default App;
