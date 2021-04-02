const inquirer = require('inquirer')
const { exec, spawn } = require("child_process");
const request = require('request');
const fs = require('fs');
var settings = require('user-settings').file('.dante');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.init = function() {
  console.log("I am emailbuilder");
  console.log( "1: Resharper" );

  var questions = [
    {
      type: 'autosubmit',
      name: 'a1',
      message: "?",
      autoSubmit: input => input.length === 1,
    }
  ]

  var emailBuilderRoot = settings.get('emailBuilderRoot');
  var resharperRoot = settings.get('resharperRoot');

  const resharperCliApp = resharperRoot + "\\cleanupcode.exe";

  inquirer.prompt(questions).then(answers => {
    var ans = answers['a1'];

    switch(ans) {
      case "1":
        const args1 = [emailBuilderRoot + "\\EmailBuilder\\EmailBuilder.sln"];
        var child = spawn(resharperCliApp, args1);
        child.stdout.on('data', function(msg){
          console.log(msg.toString())
        });
      break;

        break;

      default:
        console.log('say what now?');
    }
  })
}
