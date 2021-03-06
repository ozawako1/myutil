﻿
var t2j = require('tabletojson').Tabletojson;
var j2c  = require('json2csv');
var cherio = require('cheerio');

module.exports = async function (context, req) {

    context.log('HTML2JSON HTTP trigger function processed a request.');

    var csv = "";
    var body = "";
    var tab = [];
    var fin = {};
    var fname = "";

    try {
        
        var html = (req.body.body == undefined) ? req.body : req.body.body;
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
        fname = fin['Automation Program'];
        csv = j2c.parse(fin, {withBOM: true});
        body = csv;

    } catch (err) {

        context.log(err.message);
        body = err.message;

    } finally {

        context.res = {
            'status': 200,
            headers: {
                'content-type': 'application/octet-stream',
                'x-filename': encodeURI(fname)
            },
            'body': body
        };
        context.done();
    }
};

