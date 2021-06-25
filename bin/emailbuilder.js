const inquirer = require('inquirer')
const { exec, spawn, spawnSync } = require("child_process");
const request = require('request');
const fs = require('fs');
const os = require('os');

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
        var filesChanged = getFilesChanged();

        console.log('fc=' + filesChanged);

        //var filesChangedWithSemis = filesChanged.split(os.EOL).join(';');
        var filesChangedWithSemis = filesChanged.replace(os.EOL, ';');
        //var filesChangedWithSemis = filesChanged.join(';');

        console.log('fcws=' + filesChangedWithSemis);

        const args1 = [emailBuilderRoot + "\\EmailBuilder\\EmailBuilder.sln", "--include", filesChangedWithSemis];
        var child = spawn(resharperCliApp, args1);
        child.stdout.on('data', function(msg){
          console.log(msg.toString())
        });

        break;

      default:
        console.log('say what now?');
    }
  });
};

var getFilesChanged = function() {
  //console.log('getFilesChanged');
  var emailBuilderRoot = settings.get('emailBuilderRoot');

  //var ngrokRoot = settings.get('ngrokRoot');
  const app = "git";
  const args = ["diff", "--name-only"];
  //exec('cd ' + emailBuilderRoot + '; C:\\Program%20Files\\Git\\cmd\\git.exe diff --name-only', (err, stdout, stderr) => {
  //exec("cd " + emailBuilderRoot + "; C:\\Progra~1\\Git\\cmd\\git.exe diff --name-only", (err, stdout, stderr) => {
//    exec('C:\\Program%20Files\\Git\\cmd\\git.exe diff --name-only', (err, stdout, stderr) => {
  //exec('C:\\Program%20Files\\Git\\cmd\\git.exe diff --name-only', (err, stdout, stderr) => {

  const psCommand = "cd " + emailBuilderRoot + "; C:\\Progra~1\\Git\\cmd\\git.exe diff --name-only";
  var output = runPsCommandSync(psCommand);

  // parse the output of "git diff"
    //const diffs = parseDiff(stdout);
//console.log(output);
  // array of diff objects
  //console.log('err=' + err);
  //console.log('stdout=' + stdout);
  //console.log('stderr=' + stderr);

  //});
  return output;
};

var runPsCommandSync = function(psCommand){
  //console.log("Running PS command...", psCommand);
  let output = "";
  let errors = "";
  var retval = "";

  //var child = spawnSync("powershell.exe", [psCommand], {
    //stdio: [process.stdin, process.stdout, process.stderr]
//});

//  return child.output;

  var child = spawnSync("powershell.exe", [psCommand]);

return child.stdout.toString();
};


var runPsCommand = function(psCommand){
  //console.log("Running PS command...", psCommand);
  let output = "";
  let errors = "";
  var retval = "";

  var child = spawn("powershell.exe", [psCommand]);
  child.stdout.on("data", data => {
    //process.stdout.write(".");
    output += data;
  });
  child.stderr.on("data", data => {
    process.stdout.write(".");
    errors += data;
  });
  child.on("exit", () => {
    console.log("");
    //console.log("Output: ", output);
    //console.log("Errors: ", errors);
    retval = output;
    //return output;
  });
  child.stdin.end();
  //console.log("PS command finished..");
  console.log("Retval: ", retval);

  return retval;
};
