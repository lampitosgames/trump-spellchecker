import React from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import CorrectionPopover from './correctionPopover';

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
