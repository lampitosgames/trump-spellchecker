import React from 'react';

const GrammarText = ({fragment}) => {
    let className = fragment.type === 'GRAMMAR_MISTAKE' ? "grammarText" : "";
    className += fragment.type === 'SPELLING_MISTAKE' ? "spellingText" : "";
    className += fragment.type === 'STYLE_MISTAKE' ? "styleText" : "";

    className += " tooltip";
    return <span className={className} title={fragment.fullMessage}>{fragment.text}</span>;
}

export default GrammarText;
