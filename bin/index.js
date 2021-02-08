#!/usr/bin/env node

const inquirer = require('inquirer')
const { exec } = require("child_process");
const activator = require('./activator')

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log( "I am Dante!" );

console.log( "1. Activator" );
console.log( "2. EmailBuilder" );

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
    autoSubmit: input => input.length === 1
  }
]

inquirer.prompt(questions).then(answers => {
  console.log(`Hi ${answers['name']}!`)
  activator.activator();
})

/*
exec("calc", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
*/
