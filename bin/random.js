const inquirer = require('inquirer')
const {
  spawn, spawnSync
} = require("child_process");
const chalk = require('chalk');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.init = function() {
  console.log("I am random");
  console.log("1: Restart IIS");
  //console.log("0: Go back");

  var questions = [{
    type: 'autosubmit',
    name: 'a1',
    message: "How can I help?",
    autoSubmit: input => input.length === 1
  }]

  inquirer.prompt(questions).then(answers => {
    var ans = answers['a1'];

    switch (ans) {
      case "1":
        // var child = spawn('iisreset');
        // child.stdout.on('data', function(msg) {
        //   console.log(msg.toString())
        // });

        var childStop = spawnSync('net', ['stop', 'W3SVC']);
        console.log(chalk.greenBright(`Stop: ${childStop.stdout}`));

        if (childStop.stderr != '')
          console.error(chalk.redBright(`Stop: stderr: ${childStop.stderr}`));


        var childStart = spawnSync('net', ['start', 'W3SVC']);
        console.log(chalk.greenBright(`Start: stdout: ${childStart.stdout}`));

        if (childStart.stderr != '')
          console.error(chalk.redBright(`Start: stderr: ${childStart.stderr}`));

        break;
      default:
        console.log('say what?');
    }
  })
}
