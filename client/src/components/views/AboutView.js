import React, {Component} from 'react';

class AboutView extends Component {
    render() {
        return (
            <div className={"aboutView"}>
                    <h2 className={"aboutHeader"}>
                        Overview
                    </h2>
                    <div className={"aboutBodyText"}>
                        This application hooks into the real-time Twitter API and uses LanguageTool.org
                        to spell and grammar check twitter users (mainly Donald Trump) as
                        they post tweets.
                    </div>
                    <div className={"aboutBodyText"}>
                        I am not attempting an attack on Trump fans or the RNC or anything like that.
                        I just think it is funny how poorly he represents our country sometimes.
                    </div>
                <div className={"aboutSpacer"}></div>
                    <h2 className={"aboutHeader"}>
                        Guide
                    </h2>
                    <div className={"aboutBodyText"}>
                        Tweets of all listened to users are displayed in reverse chronological order.
                        New tweets will show up in real time with no need to refresh the page.  There
                        is a server connection indicator at the bottom of the page.
                    </div>
                    <div className={"aboutBodyText"}>
                        Hover over highlighted words to view more information about the grammatical error.
                        Red highlights are for spelling mistakes, yellow for grammar issues, and blue for
                        style suggestions.
                    </div>
                    <div className={"aboutBodyText"}>
                        Currently the only setting is adding/removing which users are being tracked by
                        the system.  The input format is a comma-delimited list of twitter handles.
                        Right now you will notice that errors will quickly start to show up.  I'm a
                        poor college student who doesn't have money to buy elevated access to the Twitter
                        APIs.  If you would like to help out with that or more server space see the
                        donations section below.
                    </div>
                <div className={"aboutSpacer"}></div>
                    <h2 className={"aboutHeader"}>
                        Backstory
                    </h2>
                    <div className={"aboutBodyText"}>
                        I had the idea for this app in class.  Our final project required
                        us to make some type of JavaScript application that used 2 external
                        APIs.  I remembered the covfefe tweet and knew about the Twitter real-time
                        API and just HAD to make this.
                    </div>
                <div className={"aboutSpacer"}></div>
                    <h2 className={"aboutHeader"}>
                        Donations
                    </h2>
                    <div className={"aboutBodyText"}>
                        If you want to help me out with server space or elevated API access or anything,
                        here are some ways to help out.  Thank you so much if you do this.
                    </div>
                    <div className={"aboutBodyText"}>
                        Paypal: <a href={"https://www.paypal.me/DanielTimko"}>dantimko1@gmail.com</a>
                    </div>
                    <div className={"aboutBodyText"}>
                        Bitcoin: 1NLpzrN8FXigtEH5NtXgknN3eByog1e4fE
                    </div>
                    <div className={"aboutBodyText"}>
                        Litecoin: LPWgvKtuXcCBTWvxfkRoyfVt6jjphkiQbw
                    </div>
                    <div className={"aboutBodyText"}>
                        Vertcoin: Vqa3QC17rtZ6F61YizEmd9mDhRnQ8BZtEu
                    </div>
                <div className={"aboutSpacer"}></div>
                    <h2 className={"aboutHeader"}>
                        Credits
                    </h2>
                    <div className={"aboutBodyText"}>
                        <a href="https://languagetool.org">LanguageTool</a> - Grammar checking API
                    </div>
                    <div className={"aboutBodyText"}>
                        <a href="https://developer.twitter.com/en/docs">Twitter API</a> - Realtime Tweet data
                    </div>
                    <div className={"aboutBodyText"}>
                        <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> - React project init
                    </div>
                    <div className={"aboutBodyText"}>
                        <a href="https://fonts.google.com/specimen/Noto+Sans">Noto Sans</a> - Great free font that looks like similar to Twitter's
                    </div>
                    <div className={"aboutBodyText"}>
                        <a href="http://thenewdaily.com.au/entertainment/tv/2016/09/27/theroux-sees-brexit-parallel-trump-us-election/">Background Image</a> - Via thenewdaily.com
                    </div>
                    <div className={"aboutBodyText"}>
                        <strong>NPM Packages:</strong> dotenv, express, moment, socket.io, twitter, babel, nodemon, concurrently,
                        react, react-bootstrap, react-dom, react-redux, redux, socket.io-client
                    </div>
                <div className={"aboutSpacer"}></div>
                    <h2 className={"aboutHeader"}>
                        Created By <a href="https://people.rit.edu/det2948/">Daniel Timko</a>
                    </h2>
            </div>
        )
    }
}

export default AboutView;
