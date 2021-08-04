const inquirer = require('inquirer')
const { exec, spawn } = require("child_process");
const request = require('request');
const fs = require('fs');
var settings = require('user-settings').file('.dante');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.init = function() {
  console.log("I am activator");
  console.log( "1: DemoData import (snapshot)" );
  console.log( "2: DemoData import (non snapshot)" );
  console.log( "3: DemoData export" );
  console.log( "4: Setup event grid");

  var activatorRoot = settings.get('activatorRoot');
  var initials = settings.get('initials');

  var questions = [
    {
      type: 'autosubmit',
      name: 'a1',
      message: "?",
      autoSubmit: input => input.length === 1,
    }
  ]

  inquirer.prompt(questions).then(answers => {
    var ans = answers['a1'];
    const demoDataApp = activatorRoot + "\\Database\\Equity.DemoData\\bin\\Debug\\Equity.DemoData.exe";

    switch(ans) {
      case "1":
        const args1 = ['-a', '-p', '-d', '-f=' + activatorRoot + '\\DemoData\\', '-n=local'];
        var child = spawn(demoDataApp, args1);
        child.stdout.on('data', function(msg){
          console.log(msg.toString())
        });
        break;
      case "2":
          const args2 = ['-p', '-d', '-f=' + activatorRoot + '\\DemoData\\', '-n=local'];
          var child = spawn(demoDataApp, args2);
          child.stdout.on('data', function(msg){
            console.log(msg.toString())
          });
          break;
      case "3":
          const args3 = ['-e', '-f=' + activatorRoot + '\\DemoData\\', '-n=local'];
          var child = spawn(demoDataApp, args3);
          child.stdout.on('data', function(msg){
            console.log(msg.toString())
          });
          break;
      case "4":
          const apiUrl = "http://localhost:4040/api/tunnels";
          let successFunc = body => {
            let tunnel1 = body.tunnels[1].public_url;
            let tunnel2 = body.tunnels[0].public_url;
            let httpsTunnel = tunnel1.indexOf('https') !== -1 ? tunnel1 : tunnel2;
            createPsFile(activatorRoot, httpsTunnel, initials);

            const psCommand = "cd " + activatorRoot + "/Tools; ./CreateEventGridSubscriptions.local.ps1";
            runPsCommand(psCommand);
          };
          let failFunc = err => {
            console.log("Looks like nGrok is not running... Running it now.");
            runNgrok();
            console.log("Waiting for 60 seconds...");

            setTimeout(() => {
              requestJson(apiUrl, successFunc, () => console.log("Failed"));
            }, 60000);
          };

          requestJson(apiUrl, successFunc, failFunc);
          break;
      default:
        console.log('say what?');
    }
  })
}

var createPsFile = function(activatorRoot, httpsTunnel, initials){
  console.log("Creating PS file...");
  let command = "./CreateEventGridSubscriptions.base.ps1 " +
                "-EndpointRoot \"" + httpsTunnel + "\" " +
                "-SubscriptionNamePrefix \"" + initials + "-\" " +
                "-ResourceGroup \"Ottobase-General\" " +
                "-SubscriptionId \"e1f843ce-5bac-42bd-b3c2-a9ea02672dab\" " +
                "-TenantId \"1ddf5542-6a20-4020-bb72-0d757c795785\" " +
                "-TopicName \"ma-dev-eventgridtopic\"";
  fs.writeFile(activatorRoot + '/Tools/CreateEventGridSubscriptions.local.ps1', command, function (err) {
    if (err) console.log("Error creating file: ", err);
    else console.log("PS file created...");
  });
};

var runNgrok = function() {
  console.log("Running nGrok...");
  var ngrokRoot = settings.get('ngrokRoot');
  const app = ngrokRoot + "\\ngrok.exe";
  const args = ["http", "-host-header=rewrite", "local.activateotto.com:80"];
  let child = spawn(app, args, { detached:true, stdio: 'ignore' }).unref();
  console.log("ngrok started...");
};


///////////////////////////////
var runPsCommand = function(psCommand){
  console.log("Running PS command...", psCommand);
  let output = "";
  let errors = "";

  var child = spawn("powershell.exe", [psCommand]);
  child.stdout.on("data", data => {
    process.stdout.write(".");
    output += data;
  });
  child.stderr.on("data", data => {
    process.stdout.write(".");
    errors += data;
  });
  child.on("exit", () => {
    console.log("");
    console.log("Output: ", output);
    console.log("Errors: ", errors);
  });
  child.stdin.end();
  console.log("PS command finished..");
};

var requestJson = function(url, successCallback, failCallback){
  request(url, { json: true }, (err, res, body) => {
    if (err) {
      console.log(err);
      failCallback(err);
    }
    else{
      successCallback(body);
    }
  });
};
