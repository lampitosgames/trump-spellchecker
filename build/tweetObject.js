'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tDataType = {
    PLAIN_TEXT: 'PLAIN_TEXT',
    //Twitter types
    HASHTAG: 'HASHTAG',
    AT_USER: 'AT_USER',
    TWITTER_URL: 'TWITTER_URL',
    TWITTER_MEDIA: 'TWITTER_MEDIA',
    //Spellcheck types
    GRAMMAR_MISTAKE: 'GRAMMAR_MISTAKE',
    SPELLING_MISTAKE: 'SPELLING_MISTAKE',
    STYLE_MISTAKE: 'STYLE_MISTAKE'
};

var buildObject = function buildObject(_text, _obj) {
    //Call the getData function
    var obj = _obj.getData();
    //If there is no text property, create one via substring
    obj.text = obj.text != undefined ? obj.text : _text.substring(obj.offset, obj.offset + obj.length);
    //If there is a url property, set "isLink" to true.
    obj.isLink = obj.url != undefined ? true : false;
    //If this is a grammar mistake object, "isCorrection" should be true
    obj.isCorrection = obj.isCorrection ? true : false;

    //Get the next and previous indices to make calculations easier
    obj.nextIndex = obj.offset + obj.length;
    obj.prevIndex = obj.offset;

    //Return the built object
    return obj;
};

var Tweet = function () {
    function Tweet(_tweet) {
        _classCallCheck(this, Tweet);

        //Store basic tweet data
        this.id = _tweet.id;
        this.timestamp = _tweet.created_at;
        //Store the original tweet text
        this.originalTwitterText = _tweet.full_text;

        //The full text of the tweet, excluding attachments
        this.baseTextIndices = _tweet.display_text_range;
        //Get the substring of the tweet that is the actual tweet text
        this.text = _tweet.full_text ? _tweet.full_text : _tweet.text;
        this.text = this.text.substring(0, this.baseTextIndices[1]);
        this.text = this.text.replace(/&amp;/g, "&");

        //Data about the user who tweeted this
        this.userID = _tweet.user.id;
        this.userRealName = _tweet.user.name;
        this.userScreenName = _tweet.user.screen_name;
        this.userImageLink = _tweet.user.profile_image_url_https;

        //Social metadata
        this.favorites = _tweet.favorite_count;
        this.retweets = _tweet.retweet_count;

        //TODO: Handle quoted statuses

        //Loop through each entity and create an object for each
        this.hashtags = _tweet.entities.hashtags.map(function (tag) {
            return new Hashtag(tag);
        });
        this.urls = _tweet.entities.urls.map(function (url) {
            return new TwitURL(url);
        });
        this.atUsers = _tweet.entities.user_mentions.map(function (user) {
            return new AtUser(user);
        });
        //Only create media entities if there is media in the tweet
        if (_tweet.extended_entities && _tweet.extended_entities.media) {
            this.media = _tweet.extended_entities.media.map(function (mData) {
                return new Media(mData);
            });
        } else {
            this.media = [];
        }

        //Init spellcheck variables
        this.fullCheckedText = undefined;
        this.mistakes = undefined;
    }

    _createClass(Tweet, [{
        key: 'addCheckData',
        value: function addCheckData(_data) {
            var matches = _data.matches;
            var thisTweet = this;
            //Filter out spelling error matches on @'s and #'s
            this.mistakes = matches.filter(function (match) {
                //Check for leading period on a tweet.  This is twitter grammar weirdness and it shouldn't get flagged
                if (match.offset == 0 && match.length == 1 && thisTweet.text[0] == ".") {
                    return false;
                }
                //If the rule type isn't a misspelling, keep it
                if (match.rule.issueType !== "misspelling") {
                    return true;
                }
                //Get the misspelled word
                var word = thisTweet.text.substring(match.offset, match.offset + match.length).toLowerCase();
                //Loop through hashtags and @users to see if there is a match
                for (var h = 0; h < thisTweet.hashtags.length; h++) {
                    if (word == thisTweet.hashtags[h].value()) {
                        return false;
                    }
                }
                for (var a = 0; a < thisTweet.atUsers.length; a++) {
                    if (word == thisTweet.atUsers[a].value()) {
                        return false;
                    }
                }
                for (var u = 0; u < thisTweet.urls.length; u++) {
                    if (word == thisTweet.urls[u].value()) {
                        return false;
                    }
                }
                //No matches found.  Return true
                return true;
                //Create a mistake object for each matched grammar error
            }).map(function (matchData) {
                return new Mistake(matchData);
            });
            //Make this function chainable
            return thisTweet;
        }
    }, {
        key: 'build',
        value: function build() {
            var _this = this;

            //Build all objects
            var hashtagArray = this.hashtags.map(function (tag) {
                return buildObject(_this.text, tag);
            });
            var urlArray = this.urls.map(function (url) {
                return buildObject(_this.text, url);
            });
            var atUserArray = this.atUsers.map(function (user) {
                return buildObject(_this.text, user);
            });
            var mistakesArray = this.mistakes.map(function (mistake) {
                return buildObject(_this.text, mistake);
            });
            //Put all objects into the fullCheckedText array
            this.fullCheckedText = [].concat(_toConsumableArray(hashtagArray), _toConsumableArray(urlArray), _toConsumableArray(atUserArray), _toConsumableArray(mistakesArray));

            /*
            At this point we have all of the grammar errors, hashtags, links, @'s, etc.  What we don't have is
            the actual tweet text.  Based on the offsets of each item, we need to get the remaining plaintext
            */
            //If there are no multimedia elements, the entire text string is the only entry here
            if (this.fullCheckedText.length == 0) {
                this.fullCheckedText.push(buildObject(this.text, new PlainText(0, this.baseTextIndices[1])));
                return;
            }

            //Plain text object array that will be combined with the fullCheckedText array once all the plain text is found
            var plainObjects = [];

            //Sort the fullCheckedText array by offset index
            this.fullCheckedText = this.fullCheckedText.sort(function (a, b) {
                return a.offset < b.offset ? -1 : 1;
            });

            //Get the first item and add anything before it
            var firstItem = this.fullCheckedText[0];
            if (firstItem.prevIndex > 0) {
                plainObjects.push(buildObject(this.text, new PlainText(0, firstItem.prevIndex)));
            }

            //Get all plaintext data
            for (var i = 0; i < this.fullCheckedText.length - 1; i++) {
                var a = this.fullCheckedText[i];
                var b = this.fullCheckedText[i + 1];
                //Build a new plaintext object
                plainObjects.push(buildObject(this.text, new PlainText(a.nextIndex, b.prevIndex)));
            }
            //Get a final plaintext data at the end of the string if there is one
            var lastItem = this.fullCheckedText[this.fullCheckedText.length - 1];
            //If length is greater than 1
            if (lastItem.nextIndex < this.baseTextIndices[1]) {
                plainObjects.push(buildObject(this.text, new PlainText(lastItem.nextIndex, this.baseTextIndices[1])));
            }
            //Combine the plain text objects with the fullCheckedText array
            this.fullCheckedText = [].concat(_toConsumableArray(this.fullCheckedText), plainObjects);
            //Finally, sort the array again
            this.fullCheckedText = this.fullCheckedText.sort(function (a, b) {
                return a.offset < b.offset ? -1 : 1;
            });
        }
    }, {
        key: 'getData',
        value: function getData() {
            //If no mistakes have been attached
            if (this.mistakes == undefined) {
                console.error("No spellcheck data attached to this tweet");
                return null;
            }
            if (this.fullCheckedText == undefined) {
                this.build();
            }
            return {
                id: this.id,
                timestamp: this.timestamp,
                text: this.text,
                originalTwitterText: this.originalTwitterText,
                baseTextIndices: this.baseTextIndices,
                userID: this.userID,
                userRealName: this.userRealName,
                userScreenName: this.userScreenName,
                userImageLink: this.userImageLink,
                favorites: this.favorites,
                retweets: this.retweets,
                media: this.media.map(function (mData) {
                    return mData.getData();
                }),
                fullCheckedText: this.fullCheckedText
            };
        }
    }]);

    return Tweet;
}();

exports.default = Tweet;

var PlainText = function () {
    function PlainText(startIndex, endIndex) {
        _classCallCheck(this, PlainText);

        this.type = tDataType.PLAIN_TEXT;
        this.offset = startIndex;
        this.length = endIndex - startIndex;
    }

    _createClass(PlainText, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length
            };
        }
    }]);

    return PlainText;
}();

var Mistake = function () {
    function Mistake(_data) {
        _classCallCheck(this, Mistake);

        //Determine type based on a few things.
        this.type = _data.shortMessage == "Spelling mistake" ? tDataType.SPELLING_MISTAKE : tDataType.GRAMMAR_MISTAKE;
        if (this.type == tDataType.GRAMMAR_MISTAKE) {
            this.type = _data.rule.issueType == "style" ? tDataType.STYLE_MISTAKE : tDataType.GRAMMAR_MISTAKE;
        }
        //Offset/length
        this.offset = _data.offset;
        this.length = _data.length;
        //Description of the mistake
        this.message = _data.shortMessage;
        this.fullMessage = _data.message;
        //Grab replacement values.  We just want a flat array
        this.replacements = _data.replacements.map(function (rep) {
            return rep.value;
        });
        //More descriptive issue type
        this.issueType = _data.rule.issueType;
    }

    _createClass(Mistake, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length,
                message: this.message,
                fullMessage: this.fullMessage,
                replacements: this.replacements,
                issueType: this.issueType,
                isCorrection: true
            };
        }
    }]);

    return Mistake;
}();

var Hashtag = function () {
    function Hashtag(_data) {
        _classCallCheck(this, Hashtag);

        this.type = tDataType.HASHTAG;
        //Text without the hashtag in front of it
        this.hashtagText = _data.text;
        this.offset = _data.indices[0];
        this.length = _data.indices[1] - this.offset;
        this.url = "https://twitter.com/hashtag/" + _data.text;
    }

    _createClass(Hashtag, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length,
                url: this.url
            };
        }
        //Used for comparison

    }, {
        key: 'value',
        value: function value() {
            return this.hashtagText.toLowerCase();
        }
    }]);

    return Hashtag;
}();

var AtUser = function () {
    function AtUser(_data) {
        _classCallCheck(this, AtUser);

        this.type = tDataType.AT_USER;
        this.offset = _data.indices[0];
        this.length = _data.indices[1] - this.offset;
        this.screenName = _data.screen_name;
        this.realName = _data.name;
        this.url = "https://twitter.com/" + _data.screen_name;
    }

    _createClass(AtUser, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length,
                screenName: this.screenName,
                realName: this.realName,
                url: this.url
            };
        }
        //Used for comparison

    }, {
        key: 'value',
        value: function value() {
            return ("@" + this.screenName).toLowerCase();
        }
    }]);

    return AtUser;
}();

var TwitURL = function () {
    function TwitURL(_link) {
        _classCallCheck(this, TwitURL);

        this.type = tDataType.TWITTER_URL;
        this.offset = _link.indices[0];
        this.length = _link.indices[1] - this.offset;
        this.twitterURL = _link.url;
        this.displayURL = _link.display_url;
        this.url = _link.expanded_url;
    }

    _createClass(TwitURL, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length,
                text: this.displayURL,
                twitterURL: this.twitterURL,
                url: this.url
            };
        }
        //Used for comparison

    }, {
        key: 'value',
        value: function value() {
            return this.twitterURL;
        }
    }]);

    return TwitURL;
}();

var Media = function () {
    function Media(_media) {
        _classCallCheck(this, Media);

        //TODO: Grab video data based on the type attribute
        this.type = tDataType.TWITTER_MEDIA;
        //Twitter api media data
        this.offset = _media.indices[0];
        this.length = _media.indices[1] - this.offset;
        this.twitterURL = _media.url;
        this.type = _media.type;
        this.picURL = _media.media_url_https;
        //Thumb, small, medium, large
        this.sizes = _media.sizes;
    }

    _createClass(Media, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                offset: this.offset,
                length: this.length,
                twitterURL: this.twitterURL,
                picURL: this.picURL,
                sizes: this.sizes
            };
        }
    }]);

    return Media;
}();

/*
<video preload="none" playsinline="" poster="https://pbs.twimg.com/ext_tw_video_thumb/939557527250857984/pu/img/k0RFvgl_BBaNnliM.jpg"
src="blob:https://twitter.com/b12051bc-79a6-4e3e-978d-5501a72eb6b3"
style="width: 100%; height: 100%; position: absolute; transform: rotate(0deg) scale(1);"></video>
*/