const inquirer = require('inquirer')
const { exec, spawn } = require("child_process");
const request = require('request');
const fs = require('fs');
var settings = require('user-settings').file('.dante');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

exports.init = function() {
  console.log("I am docker");
  console.log( "1: do stuff" );

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
        break;

      default:
        console.log('say what now?');
    }
  })
}
