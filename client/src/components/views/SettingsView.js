import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormControl, Button} from 'react-bootstrap';

class SettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'realDonaldTrump'
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {

    }

    render() {
        return (
            <div className={"settingsView"}>
                <h2 className={"settingFormTitle"}>Spellcheck Users:</h2>
                <div id={"listeningTo"} className={"settingFormWrapper"}>
                    <FormControl
                        type="text"
                        bsClass="form-control input-sm textBox"
                        value={this.state.value}
                        placeholder="realDonaldTrump"
                        onChange={this.handleChange.bind(this)}
                    />
                    <Button
                        bsClass="btn btn-sm btn-primary applyButton"
                        onClick={this.handleSubmit.bind(this)}
                    >
                        Apply Changes
                    </Button>
                </div>
                <div className={"settingFormDescription"}>
                    <em>Comma seperated list of users to listen to.</em>
                    <br></br>
                    <em>Note: this is unstable due to API throttles.  It might throw a lot of errors</em>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {tweets: state.tweets.tweets};
}

export default connect(mapStateToProps)(SettingsView);
