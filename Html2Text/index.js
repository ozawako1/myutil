const Conv = require('html-to-text');

module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.html) {

        var text = Conv.fromString(req.body.html);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: text
        };
    }
    else {
        context.res = {
            status: 400,
            body: req.body
        };
    }
};