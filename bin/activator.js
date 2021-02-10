const inquirer = require('inquirer')
//const { exec } = require("child_process");
const { exec, spawn } = require("child_process");

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.activator = function() {
  console.log("I am activator");
  console.log( "1: Run DemoData" );
  console.log( "2: Create Event Grid Webhooks")
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
        const app2 = "C:\\DevFiles\\Code\\Equity\\Local\\Tools\\CreateEventGridSubscriptions.local.ps1"
        var child = spawn("powershell.exe",[app2]);
        child.stdout.on("data",function(data){
          console.log("Powershell Data: " + data);
        });
        child.stderr.on("data",function(data){
          console.log("Powershell Errors: " + data);
        });
        child.on("exit",function(){
          console.log("Powershell Script finished");
        });
        child.stdin.end(); //end input
        break;
      default:
        console.log('say what?');
    }
  })
}
