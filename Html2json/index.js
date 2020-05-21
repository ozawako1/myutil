
var t2j = require('tabletojson').Tabletojson;
var j2c  = require('json2csv');
var cherio = require('cheerio');
var iconv = require('iconv-lite');

module.exports = async function (context, req) {

    context.log('HTML2JSON HTTP trigger function processed a request.');

    var csv = "";
    var body = "";
    var tab = [];
    var fin = {};

    try {
        
        var html = req.body;
        if (html == undefined) {
            throw new Error("Invalid Arg.");
        }

        // 受信したHTMLをロード
        var hobj = cherio.load(html, { decodeEntities: false });

        // Pardotメール固有のParse1. <STRONG>タグの検索
        var contents = hobj("strong");
        if (contents.length == 0) {
            throw new Error("Could not find tag. Pardot Mail Format may changed.");
        }

        // Pardotメール固有のParse2. <TABLE>タグの検索
        var list = contents.nextAll("table");
        if (list.length == 0) {
            throw new Error("Could not find tables. Pardot Mail Format may changed.");
        }
        
        // 各テーブルについて列をjsonに
        for (var i = 0 ; i < list.length ; i++) {
        
            var itm = list[i];
            var jdata = t2j.convert(cherio.html(itm));
            if (jdata.length == 0){
                throw new Error("JSON Convert error.");
            }

            j = jdata[0];
            
            var x = j.filter((itm) => (itm['項目'] != undefined));
            tab = tab.concat(x);
        }
        
        tab.forEach((itm) => {
            var key = itm['項目'];
            var val = itm['値'];
            fin[key] = val;
        });
        csv = j2c.parse(fin, {withBOM: true});
        body = csv;
//        body = iconv.encode(csv, "Windows932");

    } catch (err) {

        context.log(err.message);
        body = err.message;

    } finally {

        context.res = {
            'status': 200,
//            'content-type': 'text/plain; charset=utf-8',
            'content-type': 'application/octet-stream',
            'body': body
        };
        context.done();
/*
        var fs = require('fs');
        var FCSV =  "/Users/koichi.ozawa/Documents/development/out/d.csv";
        fs.writeFileSync(FCSV, body);
*/
    }
};

//var HTML = "/Users/koichi.ozawa/Documents/development/out/d.html";
