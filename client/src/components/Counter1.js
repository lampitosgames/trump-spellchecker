import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { incrementCounter, decrementCounter } from '../actions';

class Counter extends Component {
  render() {
    return (
      <p>
        {this.props.name}: {this.props.count} times
        <button onClick={this.props.increment}> + </button>
        <button onClick={this.props.decriment}> - </button>
      </p>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        count: state.tweets.count
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => {
            dispatch(incrementCounter());
        },
        decriment: () => {
            dispatch(decrementCounter());
        }
    };
}

Counter.propTypes = {
  name: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
