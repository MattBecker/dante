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
  console.log( "4: Run ngrok");
  console.log( "5: Create Event Grid Webhooks");
  console.log( "6: FixLocalPsFile");

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
        const args1 = ['-s', '-p', '-d', '-f=' + activatorRoot + '\\DemoData\\', '-n=local'];
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
        const app4 = "ngrok";
        const args4 = ["http", "-host-header=rewrite", "local.activateotto.com:80"];
        var child = spawn(app4, args4, {detached:true, stdio: 'ignore'}).unref();
        break;
      case "5":
        const psCommand = "cd " + activatorRoot + "/Tools; ./testing.ps1";
        var child = spawn("powershell.exe", [psCommand]);
        child.stdout.on("data", function(data){
          console.log("Powershell Data: " + data);
        });
        child.stderr.on("data", function(data){
          console.log("Powershell Errors: " + data);
        });
        child.on("exit",function(){
          console.log("Powershell Script finished");
        });
        child.stdin.end(); //end input
        break;
      case "6":
        request("http://localhost:4040/api/tunnels", { json: true }, (err, res, body) => {
          if (err) return console.log(err);

          let httpsTunnel = body.tunnels[0].public_url;
          let httpTunnel = body.tunnels[1].public_url;
          let command4 = "./CreateEventGridSubscriptions.base.ps1 " +
            "-EndpointRoot \"" + httpsTunnel + "\" " +
            "-SubscriptionNamePrefix \"" + initials + "-\" " +
            "-ResourceGroup \"Ottobase-General\" " +
            "-SubscriptionId \"e1f843ce-5bac-42bd-b3c2-a9ea02672dab\" " +
            "-TenantId \"1ddf5542-6a20-4020-bb72-0d757c795785\" " +
            "-TopicName \"ma-dev-eventgridtopic\"";
          fs.writeFile(activatorRoot + '/Tools/testing.ps1', command4, function (err) {
            if (err) console.log(err);
          });
        });
        break;

      default:
        console.log('say what?');
    }
  })
}
