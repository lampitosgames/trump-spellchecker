import React, {Component} from 'react';
import {connect} from 'react-redux';

class ErrorList extends Component {
    render() {
        //Generate error elements array
        let errorElements = this.props.errors.map((error) => {
            return (
                <div className="errorWrapper">
                    <div className="errorTitle">Error: {error.context}</div>
                    {(typeof error.message === "string")
                        ? <div className="errorDescription">{error.message}</div>
                        : ""}
                </div>
            );
        });
        return (
            <div className={"errorBox"}>
                {errorElements}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {errors: state.error.errorList};
}

export default connect(mapStateToProps)(ErrorList);
