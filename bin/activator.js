

const inquirer = require('inquirer')
//const { exec } = require("child_process");
const { spawn } = require("child_process");

inquirer.registerPrompt('autosubmit', require('inquirer-autosubmit-prompt'));

/*
console.log( "I am Activator!" );
*/

exports.activator = function() {
  console.log("I am activator");

  console.log( "1: DemoData" );

  console.log( "0: Go back" );


  var questions = [
    {
      type: 'autosubmit',
      name: 'a1',
      message: "What's your number?",
      autoSubmit: input => input.length === 1,
      // choices: ['1. Activator', '2. EmailBuilder', 'Small'],
    }
  ]

  inquirer.prompt(questions).then(answers => {
    var ans = answers['a1'];
    console.log(`Hi ${answers['a1']}!`);

    const demoData = "C:\\DevFiles\\Code\\Equity\\Local\\Database\\Equity.DemoData\\bin\\Debug\\Equity.DemoData.exe";
    //const demoDataArgs = "-s -p -d -f='C:\\devfiles\\code\\equity\\local\\DemoData\\' -n=local";
    const demoDataArgs = ['-s', '-p', '-d', '-f=C:\\devfiles\\code\\equity\\local\\DemoData\\', '-n=local'];

    switch(ans) {
      case "1":
        var child = spawn(demoData, demoDataArgs);
        child.stdout.on('data', function(msg){
          console.log(msg.toString())
        });

      /*
        exec("C:\\DevFiles\\Code\\Equity\\Local\\Database\\Equity.DemoData\\bin\\Debug\\Equity.DemoData.exe -s -p -d -f=\"C:\\devfiles\\code\\equity\\local\\DemoData\\\" -n=local", (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
          console.log(`DemoData done: ${stdout}`);
        });
        */
        // code block
        break;
      default:
        console.log('say what?');
        // code block
    }
  })


}

/*
var activator = {

  brand: 'Ford',
  model: 'Fiesta';


  init: {
    console.log( "I am Activator!" );
  }

}
*/

/*
module.exports = activator
*/
