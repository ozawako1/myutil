
var t2j = require('tabletojson').Tabletojson;
var j2c  = require('json2csv');
var cherio = require('cheerio');
var iconv = require('iconv-lite');

module.exports = async function (context, req) {

    context.log('HTML2JSON HTTP trigger function processed a request.');

    var csv = "";

    try {
        
        var html = req.body;
        if (html == undefined) {
            throw new Error("Invalid Arg.");
        }

        var answer = [];
        var fin = {};
        var hobj = cherio.load(html, { decodeEntities: false });

        // Pardotメール固有のParse
        var contents = hobj("strong");
        var list = contents.nextAll("table");

        for (var i = 0 ; i < list.length ; i++) {
        
            var itm = list[i];
            var jdata = t2j.convert(cherio.html(itm));
        
            j = jdata[0];
            
            var x = j.filter((itm) => (itm['項目'] != undefined));
            answer = answer.concat(x);
        }
        
        answer.forEach((itm) => {
            var key = itm['項目'];
            var val = itm['値'];
            fin[key] = val;
        });
        csv = j2c.parse(fin, {withBOM: true});
        
    } catch (err) {
        context.log(err.message);
        context.res = {        
            'status': 200,
            'content-type': 'text/plain',
            'body': err.message
        };
        context.done();

    } finally {

        context.res = {
            'status': 200,
            'content-type': 'text/plain',
            'body': iconv.encode(csv, "Shift_JIS");
        };
        context.done();

    }
};

//var fs = require('fs');
//var HTML = "/Users/koichi.ozawa/Documents/development/out/d.html";
//var FCSV =  "/Users/koichi.ozawa/Documents/development/out/d.csv";
//var html = fs.readFileSync(HTML);
