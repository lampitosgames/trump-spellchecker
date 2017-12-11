import React, {Component} from 'react';
import {connect} from 'react-redux';
import {listenToNewUsers} from '../../actions';

import {FormControl, Button} from 'react-bootstrap';

class SettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.getFormattedUserlist(props.listeningTo)
        }
    }

    getFormattedUserlist(userList) {
        let formattedUserList = userList.length > 0 ? userList[0] : "";
        for (let i=1; i<userList.length; i++) {
            formattedUserList += ", " + userList[i];
        }
        return formattedUserList;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: this.getFormattedUserlist(nextProps.listeningTo)
        });
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSubmit(null);
        }
    }

    handleSubmit(e) {
        this.props.listenToNewUsers(this.state.value);
    }

    render() {
        return (
            <div className={"settingsView"}>
                <h2 className={"settingFormTitle"}>Spellcheck Users:</h2>
                <div id={"listeningTo"} className={"settingFormWrapper"}>
                    <FormControl
                        type="text"
                        onKeyPress={this.handleKeyPress.bind(this)}
                        bsClass="form-control input-sm textBox"
                        value={this.state.value}
                        placeholder="realDonaldTrump"
                        onChange={this.handleChange.bind(this)}
                    />
                    <Button
                        bsClass="btn btn-sm btn-primary applyButton"
                        disabled={this.props.isLoading}
                        onClick={this.props.isLoading ? null : this.handleSubmit.bind(this)}
                    >
                        {this.props.isLoading ? "Working..." : "Apply Changes"}
                    </Button>
                </div>
                <div className={"settingFormDescription"}>
                    <em>Comma seperated list of users to listen to</em>
                    <br></br>
                    <em>Note: this is unstable due to API throttles.  It might throw a lot of errors</em>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listeningTo: state.socket.listeningTo,
        isLoading: !state.socket.changedListeningSuccessfully
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        listenToNewUsers: (users) => {
            dispatch(listenToNewUsers(users));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
