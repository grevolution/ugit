# ugit
a utility to search through unfuddle tickets and put the summary in commit messages


# What do you need:

- Ruby (2.0+)
- Node.js (0.10+)

# How to install

`npm install -g ugit`

# Environment Variables

1- make sure that `NODE_PATH` environment variable is set. If this is not set, the script will not work correctly. go to terminal and run `echo $NODE_PATH` to check if this is set or not.

2- set `UGIT_UNFUDDLE_DOMAIN` , `UGIT_UNFUDDLE_USERNAME` , `UGIT_UNFUDDLE_PASSWORD` , `UGIT_UNFUDDLE_PROJECT` environment variables. below is how to do that

 creat/open `~/.bash_profile` and put follwoing

```
export UGIT_UNFUDDLE_DOMAIN="your domain"
export UGIT_UNFUDDLE_USERNAME="your username"
export UGIT_UNFUDDLE_PASSWORD="your password"
export UGIT_UNFUDDLE_PROJECT="project id you want to search into"

```
`UGIT_UNFUDDLE_PROJECT` is optional but is highly recommended to be used as if it is not provided, the search will be really really slow. 

# Powerfull commits

if you want to turn on Powerfull commits then add `export UGIT_POWERFULL_COMMIT="true"` along with other variables defined in the previous steps. this setting will do following:

- when you put word 'Fixed' (case does not matter) in your commit message, then the associated ticket will automatically be marked and resolved and fixed.

- when you put 'Spent x/x.x h/hrs/hours' (e.g. spent 2.3 hrs) in your commit message, then a time entry will automatically be added to your ticket.


# Usage

```
ugit <keyword>

```