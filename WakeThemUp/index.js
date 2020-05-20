
const FUNC_HOSTS = [
    "https://aiphonebookj.azurewebsites.net/api/PhoneBookHttpTriggerJS?code=Pa404aC1o9BR1waGh/Wy1jSrMeuz0fo2mvFM41A4k4yWMABvRsV79w==",
    "https://garoonfuncj.azurewebsites.net/api/PostSchedule?code=AcH5L5PBgy1WGmIKT91j70jqWqC6hX6/1AWZAsi089ZBPdkbvQPYqQ==",
    "https://zoomfunc.azurewebsites.net/api/GetMeetings?code=fCMZNhkVrfCBkzPVR6yUc3GVv4OMmyh5ECKn2p36ahB8MMK0hDwPBQ==",
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