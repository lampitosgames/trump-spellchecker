import https from 'https';
import querystring from 'querystring';

export const createPostData = (dataObject) => {
    return querystring.stringify(dataObject);
}

/*
 * Helper function that creates HTTP request POST options based
 * on input
 */
export const createPostOptions = (_hostname, _path, _postData) => {
    return {
        hostname: _hostname,
        path: _path,
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(_postData)
        }
    }
}

/*
 * Makes a post request with the given parameters already constructed
 * Returns a promise that resolves when the data is returned, passing
 * the return body
 */
export const postRequest = (_data, _options) => {
    return new Promise((resolve, reject) => {
        let req = https.request(_options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (data) => {
                resolve(data);
            });
        });
        req.on('error', (err) => reject(err));
        req.write(_data);
        req.end();
    });
}

export const testRequest = () => {
    const postData = createPostData({text: "I can't can't spell for shiteasdf", language: "en-US"});
    const options = createPostOptions('www.languagetool.org', '/api/v2/check', postData);
    postRequest(postData, options).then((data) => {
        console.dir(JSON.parse(data));
    }).catch((err) => console.log(err));
}

export const spellcheckText = (_text) => {
    const postData = createPostData({text: _text, language: "en-US"});
    const options = createPostOptions('www.languagetool.org', '/api/v2/check', postData);
    return postRequest(postData, options);
}
