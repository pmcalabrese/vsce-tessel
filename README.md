# VSCE Tessel
![vsce-tessel](./vsce-tessel.gif)

vsce-tessel is a visual studio code extention for manage your Tessel 2, it's a wrapper around [t2-cli](https://github.com/tessel/t2-cli).

I build this extention with the intention to avoid switching to the terminal for every single command, makes short loop interations faster.

## Features

vsce-tessel supports most of the commands provided by [t2-cli](https://github.com/tessel/t2-cli), please if you cannot find the command that you need please open an issue and remember that in the meanwhile you can still use the t2-cli.

## Requirements

you need to have [t2-cli](https://github.com/tessel/t2-cli) installed.

## Extension Settings

vsce-tessel extentions uses tesselfile.json. This files contains some configurations used by plugin and it's very useful when you have multiple projects, or multiple board connected at the same time.

For example you can config the name of the board where you want to deploy the code on, so when you run the command `run` it will run on that specific board. It's also a convinente way to share configurations. 

## Known Issues

After call the run commands the board needs to be resetted for quit the current script.

## Release Notes

### 1.0.0

Initial release