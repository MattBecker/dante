const inquirer = require('inquirer')
const {
  spawn
} = require("child_process");
inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.init = function() {
  console.log("I am random");
  console.log("1: IIS Reset");
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
        var child = spawn('iisreset');
        child.stdout.on('data', function(msg) {
          console.log(msg.toString())
        });
        break;
      default:
        console.log('say what?');
    }
  })
}
