#!/usr/bin/env node

const inquirer = require('inquirer')
const { exec } = require("child_process");
const activator = require('./activator')
const random = require('./random')

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log( "I am Dante!" );


console.log( "1. Activator" );
console.log( "2. EmailBuilder" );
console.log( "3. Random" );


/*
readline.question(`What you want?`, name => {
  console.log(`Hi ${name}!`)
  readline.close()
})
*/


var questions = [
  {
    type: 'autosubmit',
    name: 'name',
    message: "What's your number?",
    autoSubmit: input => input.length === 1,
    // choices: ['1. Activator', '2. EmailBuilder', 'Small'],
  }
]

inquirer.prompt(questions).then(answers => {
  var ans = answers['name'];

  console.log(`Hi ${answers['name']}!`)
  switch(ans) {
    case "1":
      activator.activator();
      break;
    case "3":
        random.random();
        break;
    default:
      console.log('say what?');
      // code block
  }


})
