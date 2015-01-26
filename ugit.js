/**
 * Unfuddle Ticket Search and Commit
 */

var inquirer = require("inquirer");

var exec = require("child_process").exec;
exec('ruby upload.rb'.concat(" ").concat(process.argv[2]), print_tickets_to_select);

function print_tickets_to_select(err, stdout, stderr){
    inquirer.prompt([
      {
        type: "list",
        name: "ticket",
        message: "Ticket:",
        choices: stdout.split("\n")
      },
      {
        type: "input",
        name: "message",
        message: "Your message?"
      }
    ], function( answers ) {
        var commit_message = answers.ticket.concat(" - ").concat(answers.message)
        exec('git commit -am '.concat(commit_message), git_commit_callback)
      });
}

function git_commit_callback(err, stdout, stderr){
  console.log(stdout)
  console.log(stderr)  
}
