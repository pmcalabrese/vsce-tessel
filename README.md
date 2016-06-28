# VSCE Tessel
![vsce-tessel](https://raw.githubusercontent.com/pmcalabrese/vsce-tessel/master/vsce-tessel.gif)

vsce-tessel is a visual studio code extention for manage your Tessel 2, it's a wrapper around [t2-cli](https://github.com/tessel/t2-cli).

I build this extention with the intention to avoid switching to the terminal for every single command, makes short loop interations faster.

## Features

vsce-tessel supports most of the commands provided by [t2-cli](https://github.com/tessel/t2-cli), please if you cannot find the command that you need please open an issue and remember that in the meanwhile you can still use the t2-cli.

## Requirements

You need to have [t2-cli](https://github.com/tessel/t2-cli) installed.

## Extension Settings

vsce-tessel extention uses tesselfile.json. This file contains some configurations used by the plugin. It's very useful when you have multiple projects, or multiple boards connected at the same time.

For example, you could config the name of the board where you want to deploy the code on, so when you run the command `run` it will run on that specific board. It's also a convenient way to share configurations across multiple team members. 

## Known Issues

After call the run commands the board needs to be resetted for quit the current script.

## Release Notes

### 0.0.1

Initial release

### 0.0.2

- Better README
- Add video link
- Remove console log

### 0.0.3

- Better README
- Upgrade dependencies