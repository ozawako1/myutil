const fs = require('fs');

const dump = process.env["MY_DUMP_FILE_PATH"];

function getfilename()
{
    var now = new Date();
    var name = "";
    
    name += "" + now.getFullYear() + now.getMonth() + now.getDate() + "Z";
    name += "" + now.getHours() + now.getMinutes() + now.getSeconds();
    name += ".json";

    return name;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var buff = JSON.stringify(req);
    var file = dump + "/" + getfilename();

    var envs = process.env;
    buff += JSON.stringify(envs);

    fs.writeFileSync(file, buff);

    const responseMessage = "";
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}