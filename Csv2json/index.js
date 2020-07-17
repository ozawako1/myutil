

var CSVParse = require("csv-parse/lib/sync");
var ICONV = require("iconv-lite");


module.exports = async function (context, req) {

    context.log('CSV2JSON HTTP trigger function processed a request.');

    var res = "";
    const csvdata = req.body;
    const use_conv = parseInt(req.query.conv);
    const use_opt = parseInt(req.query.opt);

    try {

        var buf = Buffer.from(csvdata);

        var str = csvdata;
        if (use_conv != 0) {
            str = ICONV.decode(buf,"shift_jis");
        }

        var opt = {};
        if (use_opt != 0) {
            opt = {
                from_line: 2,
                columns: true
            };
        }
        var res = CSVParse(str, opt);

        console.log(JSON.stringify(res));
    
    } catch (err) {
        
        res = "Error:" + err.message;

    } finally {

        context.res = {
            // status: 200, /* Defaults to 200 */
            header: {
                "content-type": "application/json; charset=utf-8"
            },
            body: res
        };

    }
}