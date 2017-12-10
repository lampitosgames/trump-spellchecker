import React from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';

const CorrectionPopover = (fragment) => {
    let popoverID = fragment.type === 'GRAMMAR_MISTAKE' ? "popoverGrammar" : "";
    popoverID += fragment.type === 'SPELLING_MISTAKE' ? "popoverSpelling" : "";
    popoverID += fragment.type === 'STYLE_MISTAKE' ? "popoverStyle" : "";

    return (
        <Popover id={popoverID} title={fragment.message}>
            {fragment.fullMessage}
        </Popover>
    )
}

const GrammarText = ({fragment}) => {
    let popoverElement = CorrectionPopover(fragment);

    let className = fragment.type === 'GRAMMAR_MISTAKE' ? "grammarText" : "";
    className += fragment.type === 'SPELLING_MISTAKE' ? "spellingText" : "";
    className += fragment.type === 'STYLE_MISTAKE' ? "styleText" : "";
    return (
        <OverlayTrigger trigger={['hover', 'focus']} placement={"top"} overlay={popoverElement}>
            <div className={className}>
                {fragment.text}
            </div>
        </OverlayTrigger>
    )
}

export default GrammarText;
