const tDataType = {
    TWEET: 'TWEET',
    HASHTAG: 'HASHTAG',
    AT_USER: 'AT_USER',
    TWIT_URL: 'TWIT_URL',
    TWIT_MEDIA: 'TWIT_MEDIA'
}

export default class Tweet {
    declareProps = () => {
        //Declarations
        //Basic data about the tweet
        this.id = undefined;
        this.timestamp = undefined;
        this.text = undefined;

        //Original text data
        this.originalTwitterText = undefined;
        this.baseTextIndices = undefined;

        //User data
        this.userID = undefined;
        this.userRealName = undefined;
        this.userScreenName = undefined;
        this.userImageLink = undefined;

        //Interaction data
        this.favorites = undefined;
        this.retweets = undefined;

        //Multimedia arrays
        this.hashtags = [];
        this.urls = [];
        this.atUsers = [];
        this.media = [];

        //TODO: Handle quoted statuses

        //Spellchecked data
        //This is an array of strings with extra info. If the text properties of this array were strung together, they'd make up the "this.text" property
        //Included here is data about spelling, grammar, URLs, etc.  This should be constructed after the tweet data has been constructed
        this.fullCheckedText = [];
    }

    constructor = (_tweet) => {
        this.type = tDataType.TWEET;
        //Declare all properties of this object
        declareProps();
        //Determine if tweet data is raw twitter data or a previously-minified version of this tweet object
        if (_tweet.created_at != undefined) {
            //Twitter-based tweet
            this.convertFromTwitterAPI(_tweet);
        } else {
            //Socket-based tweet that has previously been converted
            this.setData(_tweet);
        }
    }

    convertFromTwitterAPI = (_data) => {
        //Store basic tweet data
        this.id = _data.id;
        this.timestamp = _data.created_at;
        //Store the original tweet text
        this.originalTwitterText = _data.full_text;
        //The full text of the tweet, excluding attachments
        this.baseTextIndices = _data.display_text_range;
        this.baseTextIndices[1]--;
        this.text = _data.full_text.substring(0, this.baseTextIndices[1]);
        //Data about the user who tweeted this
        this.userID = _data.user.id;
        this.userRealName = _data.user.name;
        this.userScreenName = _data.user.screen_name;
        this.userImageLink = _data.user.profile_image_url_https;
        //Social metadata
        this.favorites = _data.favorite_count;
        this.retweets = _data.retweet_count;
        //Loop through each entity and create an object for each
        this.hashtags = _data.entities.hashtags.map(tag => new Hashtag(tag));
        this.urls = _data.entities.urls.map(url => new TwitUrl(url));
        this.atUsers = _data.entities.user_mentions.map(user => new AtUser(user));
        //Only create media entities if there is media in the tweet
        if (_data.extended_entities && _data.extended_entities.media) {
            this.media = _data.extended_entities.media.map(mData => new Media(mData));
        }
    }

    addCheckData = (_data) => {
        this.fullCheckedText = _data;
    }

    getData = () => ({
        id: this.id,
        timestamp: this.timestamp;
        text: this.text,
        originalTwitterText: this.originalTwitterText,
        baseTextIndices: this.baseTextIndices,
        userID: this.userID,
        userRealName: this.userRealName,
        userScreenName: this.userScreenName,
        userImageLink: this.userImageLink,
        favorites: this.favorites,
        retweets: this.retweets,
        hashtags: this.hashtags.map(tag => tag.getData()),
        urls: this.urls.map(url => url.getData()),
        atUsers: this.atUsers.map(user => user.getData()),
        media: this.media.map(mData => mData.getData()),
        fullCheckedText: this.fullCheckedText
    });

    setData = (_data) => {
        //Store basic tweet data
        this.id = _data.id;
        this.timestamp = _data.timestamp;
        this.text = _data.text;
        //Store the original tweet text
        this.originalTwitterText = _data.originalTwitterText;
        //The full text of the tweet, excluding attachments
        this.baseTextIndices = _data.baseTextIndices;
        //Data about the user who tweeted this
        this.userID = _data.userID;
        this.userRealName = _data.userRealName;
        this.userScreenName = _data.userScreenName;
        this.userImageLink = _data.userImageLink;
        //Social metadata
        this.favorites = _data.favorites;
        this.retweets = _data.retweets;
        //Loop through each entity and create an object for each
        this.hashtags = _data.hashtags.map(tag => new Hashtag(tag));
        this.urls = _data.urls.map(url => new TwitUrl(url));
        this.atUsers = _data.atUsers.map(user => new AtUser(user));
        this.media = _data.media.map(mData => new Media(mData));

        this.fullCheckedText = _data.fullCheckedText;
    }
}

class Hashtag {
    constructor = (_data) => {
        this.type = tDataType.HASHTAG;
        setData(_data);
    }
    getData = () => ({text: this.text, indices: this.indices});
    setData = (_data) => {
        this.text = _data.text;
        this.indices = _data.indices;
        this.twitterLink = "https://twitter.com/hashtag/" + _data.text;
    }
    //Used for comparison
    valueOf = () => (this.text);
    //Actual indices in the full_text twitter attribute
    actualIndices = () => ([
        this.indices[0] + 1,
        this.indices[1] - 1
    ]);
}

class AtUser {
    constructor(_data) {
        this.type = tDataType.AT_USER;
        if (_data.screen_name != undefined) {
            this.screenName = _data.screen_name;
            this.realName = _data.name;
            this.indices = _data.indices;
            this.twitterLink = "https://twitter.com/" + _data.screen_name
        } else {
            setData(_data);
        }
    }
    getData = () => ({screenName: this.screenName, realName: this.realName, indices: this.indices});
    setData = (_data) => {
        this.screenName = _data.screenName;
        this.realName = _data.realName;
        this.indices = _data.indices;
        this.twitterLink = "https://twitter.com/" + _data.screenName;
    }
    //Used for comparison
    valueOf = () => ("@" + this.screenName);
    //Actual indices in the full_text twitter attribute
    actualIndices = () => ([
        this.indices[0], this.indices[1] - 1
    ]);
}

class TwitURL {
    constructor = (_link) => {
        this.type = tDataType.TWIT_URL;
        if (_link.display_url != undefined) {
            //Twitter api url data
            this.twitterURL = _link.url;
            this.displayURL = _link.display_url;
            this.indices = _link.indices;
            this.url = _link.expanded_url;
        } else {
            //Previously converted url data
            setData(_link);
        }
    }
    getData = () => ({twitterURL: this.twitterURL, displayURL: this.displayURL, indices: this.indices, url: this.url});
    setData = (_data) => {
        this.twitterURL = _data.twitterURL;
        this.displayURL = _data.displayURL;
        this.indices = _data.indices;
        this.url = _data.url;
    }
    //Used for comparison
    valueOf = () => (this.twitterURL);
    //Actual indices in the full_text twitter attribute
    actualIndices = () => ({
        this.indices[0],
        this.indices[1] - 1
    });
}

class Media {
    constructor = (_media) => {
        //TODO: Grab video data based on the type attribute
        this.type = tDataType.TWIT_MEDIA;
        if (_media.media_url_https != undefined) {
            //Twitter api media data
            this.twitterURL = _media.url;
            this.type = _media.type;
            this.indices = _media.indices
            this.picURL = _media.media_url_https;
            //Thumb, small, medium, large
            this.sizes = _media.sizes;
        } else {
            //Previously converted media data
            setData(_media);
        }
    }
    getData = () => ({twitterURL: this.twitterURL, type: this.type, indices: this.indices, picURL: this.picURL, sizes: this.sizes});
    setData = (_data) => {
        this.twitterURL = _data.twitterURL;
        this.type = _data.type;
        this.indices = _data.indices;
        this.picURL = _data.picURL;
        this.sizes = _data.sizes;
    }
    //Used for comparison
    valueOf = () => (this.twitterURL);
    //Actual indices in the full_text twitter attribute
    actualIndices = () => ({
        this.indices[0],
        this.indices[1] - 1
    });
}

/*
<video preload="none" playsinline="" poster="https://pbs.twimg.com/ext_tw_video_thumb/939557527250857984/pu/img/k0RFvgl_BBaNnliM.jpg"
src="blob:https://twitter.com/b12051bc-79a6-4e3e-978d-5501a72eb6b3"
style="width: 100%; height: 100%; position: absolute; transform: rotate(0deg) scale(1);"></video>
*/
