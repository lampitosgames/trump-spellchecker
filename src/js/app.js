import React, { Component } from 'react';
import { render } from 'react-dom';

import '../css/style.css';
import catImage from '../assets/download.jpg';

export default class Hello extends Component {
  render() {
    return (
      <div>
        Hello from react

        <img src={ catImage } alt='Commander Keen' />
      </div>
    );
  }
}

render(<Hello />, document.getElementById('app'));
