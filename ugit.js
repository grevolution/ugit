#!/usr/bin/env node

/*
 * Copyright 2015, All Rights Reserved.
 *
 * Code licensed under the MIT License:
 * https://github.com/grevolution/ugit/blob/master/LICENSE.md
 *
 * @author Shan Ul Haq <g@grevolution.me>
 */

'use strict';
var inquirer = require("inquirer");
var exec = require("child_process").exec;
var json = '';

function findAndCommit(keyword) {
  if(!process.env.UGIT_UNFUDDLE_DOMAIN || !process.env.UGIT_UNFUDDLE_USERNAME
    || !process.env.UGIT_UNFUDDLE_PASSWORD) {
    console.log("environment variables are not defined")
    return
  }

  exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb').concat(" ").concat("\""+keyword+"\""), printTicketsToSelect);
}

function printTicketsToSelect(err, stdout, stderr){
    if(err || stderr) {
      console.log(stderr)
      return
    }
    json = JSON.parse(stdout)
    var summaries = []
    for(var i in json) {
      if(json[i].title.length > 70) {
        summaries.push(json[i].title.substring(0,70)+"...")        
      } else {
        summaries.push(json[i].title)
      }
    }

    inquirer.prompt([
      {
        type: "list",
        name: "ticket",
        message: "Ticket:",
        choices: summaries,
      },
      {
        type: "input",
        name: "message",
        message: "Your message?",
        default: function() {return "Implementation Done"}
      }
    ], function( answers ) {
        var commit_message = answers.ticket.concat(" - ").concat(answers.message)
        exec('git commit -am \"'.concat(commit_message).concat("\""), showAll)
        if(process.env.UGIT_POWERFULL_COMMIT == "true") {
          //if the message contains the word `fixed` in it. mark the ticket as resolved
          //if the ticket contains the word `spent` in it. see the next 
          for(var i in json) {
            var t = json[i]
            if(t.title.valueOf().indexOf(answers.ticket.valueOf()) > -1 ) {
              checkFixedAndTime(t, answers.message)
            }
          }          
        }
      });
}

var cMessage = ""
function checkFixedAndTime(obj, msg) {
  var resolved = false;
  if(msg.toLowerCase().indexOf("fixed") > -1) {
    //the string contains the word fixed.
    var ticketId = getTicketId(obj)
    var projectId = obj.project_id

    exec('git rev-parse --verify HEAD', function(err, stdout, stderr){
      cMessage = stdout
      if(cMessage && cMessage.trim().length > 0) {
        exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb -u ').concat(projectId+" ").concat(ticketId+" ").concat("1"+" ").concat(cMessage), showError);      
      } else {
        exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb -u ').concat(projectId+" ").concat(ticketId+" ").concat("1"+" "), showError);
      }
    });
    resolved = true
  }

  var spIndex = msg.toLowerCase().indexOf("spent")
  if(spIndex > -1){
    var str1 = msg.substring(spIndex + "spent".length)
    var timeEntryMessage = msg.substring(0, spIndex);
    var hIndex = str1.toLowerCase().indexOf("h");
    if(hIndex > -1){
      var time1 = str1.substring(0, hIndex);
      time1 = time1.trim();
      var timeSpent = parseFloat(time1)
      if(timeSpent > 0){
          //enter time entry
          var ticketId = getTicketId(obj)
          var projectId = obj.project_id
          if(!resolved){
            exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb -u ').concat(projectId+" ").concat(ticketId+" ").concat("0"), showError);            
          }
          if(timeEntryMessage.trim().length > 0) {
            exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb -a ').concat(projectId+" ").concat(ticketId+" ").concat(""+timeSpent).concat(" \""+ timeEntryMessage+"\""), showError);
          } else {
            exec('ruby '.concat(process.env.NODE_PATH).concat('/ugit/unfuddler/upload.rb -a ').concat(projectId+" ").concat(ticketId+" ").concat(""+timeSpent), showError);            
          }
      }
    }
  }
}

function getTicketId(obj){
  var location = obj.location
  var arr = location.split("/")
  return arr[arr.length -1]
}

function showAll(err, stdout, stderr) {
  if(stdout) console.log(stdout)
  if(stderr) console.log(stderr)  
}

function showError(err, stdout, stderr) {
  if(err) console.log(err)
  if(stderr) console.log(stderr)  
}

findAndCommit(process.argv[2])