# ugit
a utility to search through unfuddle tickets and put the summary in commit messages


# What do you need:

- Ruby (2.0+)
- Node.js (0.10+)

# How to install

`npm install -g ugit`

# Environment Variables

1- make sure that `NODE_PATH` environment variable is set. If this is not set, the script will not work correctly. go to terminal and run `echo $NODE_PATH` to check if this is set or not.

2- set `UNFUDDLE_DOMAIN` , `UNFUDDLE_USERNAME` , `UNFUDDLE_PASSWORD` , `UNFUDDLE_PROJECT` environment variables. below is how to do that

 creat/open `~/.bash_profile` and put follwoing

```
export UNFUDDLE_DOMAIN="your domain"
export UNFUDDLE_USERNAME="your username"
export UNFUDDLE_PASSWORD="your password"
export UNFUDDLE_PROJECT="project id you want to search into"

```

# Usage

```
ugit <keyword>

```