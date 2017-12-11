import React, { Component } from 'react';
import { connect } from 'react-redux';

import connectionTypes from '../../actions/connectionTypes';

class SocketStatus extends Component {
  render() {
    let indicatorID = (this.props.status === connectionTypes.CONNECTED) ? "socketConnected" : "";
    indicatorID += (this.props.status === connectionTypes.CONNECTING) ? "socketConnecting" : "";
    indicatorID += (this.props.status === connectionTypes.DISCONNECTED) ? "socketDisconnected" : "";
    return (
      <div className={"socketStatusWrapper"}>
          <span>Socket Status - {this.props.status}</span>
          <div id={indicatorID} className={"socketStatusIndicator"}></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        status: state.socket.socketStatus
    };
}

export default connect(mapStateToProps)(SocketStatus);
