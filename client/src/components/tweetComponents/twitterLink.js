import React from 'react';

const TwitterLink = ({fragment}) => (
    <a href={fragment.url} target={"_blank"}>
        <span className={"tweetLink"}>{fragment.text}</span>
    </a>
);

export default TwitterLink;
