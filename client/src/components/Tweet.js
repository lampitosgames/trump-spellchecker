import React, {Component} from 'react';
import PlainText from './tweetComponents/plainText';
import TwitterLink from './tweetComponents/twitterLink';
import GrammarText from './tweetComponents/grammarText';

class Tweet extends Component {
    render() {
        let uniqueID = 0;
        let renderedString = this.props.tweetData.fullCheckedText.map((fragment) => {
            //If the string fragment is a link (# or @ or actual link), format it
            if (fragment.isLink) {
                return <TwitterLink key={uniqueID++} fragment={fragment} />;
            }
            //If the string fragment is a correction, format it
            if (fragment.isCorrection) {
                return <GrammarText key={uniqueID++} fragment={fragment} />;
            }
            return <PlainText key={uniqueID++} fragment={fragment} />;
        });
        return (
            <p className={"tweet"}>
                {renderedString}
            </p>
        )}
}

export default Tweet;
