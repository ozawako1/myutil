
const FUNC_HOSTS = [
    {
        method: "GET",
        url: "https://aiphonebookj.azurewebsites.net/api/PhoneBookHttpTriggerJS?code=" + process.env.MY_CODE_PHONEBOOK
    },
    {
        method: "GET",
        url: "https://garoonfuncj.azurewebsites.net/api/GetSchedule?code=" + process.env.MY_CODE_GAROON
    },
    {
        method: "GET",
        url: "https://zoomfunc.azurewebsites.net/api/GetMeetings?code=" + process.env.MY_CODE_ZOOM
    },
    {
        method: "GET",
        url: "https://lspgatewayfunc.azurewebsites.net/api/HttpTriggerJS"
    },
    {
        method: "POST",
        url: "https://funcs27ex0a00.azurewebsites.net/api/CancelOrder?code=" + process.env.MY_CODE_EDI
    }  
];

const url = require("url");

var request = require('request');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if(myTimer.isPastDue)
    {        
        context.log('JavaScript is running late!');
    }

    var options = {
        url: '',
        method: 'GET',
        headers: {
            'User-Agent': 'WakeThemUp / node.js - request'
        }
    }

    FUNC_HOSTS.forEach(function(itm){
        var host = url.parse(itm.url).hostname;

        options.method = itm.method;
        options.url = itm.url;
        
        context.log("sending reqeust to [" + host + "]");
        request(options, function (error, response, body) {
            context.log("Done. [" + host + ":" + body + "]");
        });
    });

    context.log('JavaScript timer trigger function ran!', timeStamp);   
};