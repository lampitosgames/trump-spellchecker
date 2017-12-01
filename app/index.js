import React, { Component } from 'react';
import { render } from 'react-dom';

import './styles.scss';
import image from './assets/download.jpg';

export default class Hello extends Component {
  render() {
    return (
      <div>
        Hello from react
        <img src={ image }/>
      </div>
    );
  }
}

render(<Hello />, document.getElementById('app'));
