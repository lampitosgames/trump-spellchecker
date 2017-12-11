import React from 'react';
import {Popover} from 'react-bootstrap';

const CorrectionPopover = (fragment) => {
    //Determine the type of popover this is so the proper ID can be assigned.
    //This is used for styling
    let popoverID = fragment.type === 'GRAMMAR_MISTAKE' ? "popoverGrammar" : "";
    popoverID += fragment.type === 'SPELLING_MISTAKE' ? "popoverSpelling" : "";
    popoverID += fragment.type === 'STYLE_MISTAKE' ? "popoverStyle" : "";

    //Default body string is just a normal span.  If there are no corrections, this
    //will be the content that fills the popover
    let bodyString = <span>{fragment.fullMessage}</span>;

    //If there are suggested replacements
    if (fragment.replacements.length > 0) {
        //Create a string
        let repl = "Suggestions: " + fragment.replacements[0];
        //Loop through all replacements.  Limit how many are displayed to 4.  Add each
        for (let i = 1; i < fragment.replacements.length && i < 4; i++) {
            repl += ", " + fragment.replacements[i];
        }
        //Change the body string to include replacements
        bodyString = (
            <div>
                <p>{fragment.fullMessage}</p>
                <em>{repl}</em>
            </div>
        );
    }

    //Return the popover with our computed body string and the proper class
    return (
        <Popover id={popoverID} title={fragment.message}>
            {bodyString}
        </Popover>
    )
}

export default CorrectionPopover;
