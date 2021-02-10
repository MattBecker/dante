#!/usr/bin/env node

const inquirer = require('inquirer')
const process = require("child_process");
const activator = require('./activator');
const random = require('./random');
const chalk = require('chalk');

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

// process.spawnSync('Clear-Host');

console.log(chalk.bgGreen("-".repeat(30) + "I am Dante" + "-".repeat(30)));
console.log("1. Activator");
console.log("2. EmailBuilder");
console.log("3. Random");
//console.log("0. Exit");

var questions = [{
  type: 'autosubmit',
  name: 'num',
  message: "?",
  autoSubmit: input => input.length === 1
}]

inquirer.prompt(questions).then(answers => {
  var ans = answers['num'];
  switch (ans) {
    case "0":
      console.log(chalk.gray('thanks for playing'));
      break;
    case "1":
      activator.activator();
      break;
    case "3":
      random.random();
      break;
    default:
      console.log('say what?');
  }
})
