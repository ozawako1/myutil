
const FUNC_HOSTS = [
    "https://aiphonebookj.azurewebsites.net/api/PhoneBookHttpTriggerJS?code=" + process.env.MY_CODE_PHONEBOOK,
    "https://garoonfuncj.azurewebsites.net/api/GetSchedule?code=" + process.env.MY_CODE_GAROON,
    "https://zoomfunc.azurewebsites.net/api/GetMeetings?code=" + process.env.MY_CODE_ZOOM,
    "https://lspgatewayfunc.azurewebsites.net/api/HttpTriggerJS"
];

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
        options.url = itm;
        context.log("sending reqeust to [" + itm + "]");
        request(options, function (error, response, body) {
            context.log(body);
        });
    });

    context.log('JavaScript timer trigger function ran!', timeStamp);   
};