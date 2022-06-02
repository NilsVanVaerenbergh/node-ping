const {exec} = require("child_process");
const ping = async (site, options, callback) => {
    if(options.showTime) console.time("took");
        await exec(`ping ${site}`, (error, stdout, stderr) => {
            const result = new Object();
            if(error === null) {
                result["input_host"] = site;
                result["output"] = stdout;
                result["min"] = parseInt(stdout.match(/(?:Minimum = )\d+/g)[0].replace("Minimum =", ""))
                result["max"] = parseInt(stdout.match(/(?:Maximum = )\d+/g)[0].replace("Maximum =", ""))
                result["avg"] = parseInt(stdout.match(/(?:Average = )\d+/g)[0].replace("Average =", ""))
                result["packets_sent"] = parseInt(stdout.match(/(?:Sent = )\d+/g)[0].replace("Sent =", ""))
                result["packets_received"] = parseInt(stdout.match(/(?:Received = )\d+/g)[0].replace("Received =", ""))
                result["packets_lost"] = parseInt(stdout.match(/(?:Lost = )\d+/g)[0].replace("Lost =", ""));
                result["lost"] = stdout.match(/\d+(?:%)/)[0];
            }
            callback(error, result);
            if(options.showTime) console.timeEnd("took");
        });
}
module.exports = ping;