const inquirer = require('inquirer')
//const { exec } = require("child_process");
const { exec, spawn } = require("child_process");
const request = require('request');
const fs = require('fs');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.activator = function() {
  console.log("I am activator");
  console.log( "1: Run DemoData" );
  console.log( "2: Run ngrok");
  console.log( "3: Create Event Grid Webhooks");
  console.log( "4: FixLocalPsFile");
  //console.log( "0: Go back" );

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

    switch(ans) {
      case "1":
        const app1 = "C:\\DevFiles\\Code\\Equity\\Local\\Database\\Equity.DemoData\\bin\\Debug\\Equity.DemoData.exe";
        const args1 = ['-s', '-p', '-d', '-f=C:\\devfiles\\code\\equity\\local\\DemoData\\', '-n=local'];
        var child = spawn(app1, args1);
        child.stdout.on('data', function(msg){
          console.log(msg.toString())
        });
        break;
      case "2":
        const app3 = "ngrok";
        const args3 = ["http", "-host-header=rewrite", "local.activateotto.com:80"];
        var child = spawn(app3, args3, {detached:true, stdio: 'ignore'}).unref();
        break;
      case "3":
        const psCommand = "cd D:/Git/Equity/Tools; ./testing.ps1";
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
      case "4":
        request("http://localhost:4040/api/tunnels", { json: true }, (err, res, body) => {
          if (err) return console.log(err);
          
          let httpsTunnel = body.tunnels[0].public_url;
          let httpTunnel = body.tunnels[1].public_url;
          let command4 = "./CreateEventGridSubscriptions.base.ps1 " + 
            "-EndpointRoot \"" + httpsTunnel + "\" " +
            "-SubscriptionNamePrefix \"JR-\" " + 
            "-ResourceGroup \"Ottobase-General\" " + 
            "-SubscriptionId \"e1f843ce-5bac-42bd-b3c2-a9ea02672dab\" " + 
            "-TenantId \"1ddf5542-6a20-4020-bb72-0d757c795785\" " + 
            "-TopicName \"ma-dev-eventgridtopic\"";
          fs.writeFile('D:/Git/Equity/Tools/testing.ps1', command4, function (err) {
            if (err) console.log(err);
          });
        });
        break;
      
      default:
        console.log('say what?');
    }
  })
}
