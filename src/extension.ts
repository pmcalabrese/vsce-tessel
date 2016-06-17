'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {execFile,execSync} from 'child_process';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "tessel" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let t2_list = vscode.commands.registerCommand('extension.t2_list', () => {
        // The code you place here will be executed every time your command is executed
        const child = execFile('t2', ['list'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            var devices_list: Array<string>;
            var devices_list_message: Array<vscode.MessageItem> = [];
            devices_list = stdout.split("\n");
            devices_list.pop();
            devices_list.forEach(value => {
                devices_list_message.push({
                    title: value
                })
            })
            console.info('devices_list',devices_list);
            vscode.window.showInformationMessage("searching...",...devices_list_message).then(value => {
                vscode.window.setStatusBarMessage(devices_list.length + " interface" + (devices_list.length > 1 ? "s" : "") + " found")
            });
        });
    });

    let t2_rename = vscode.commands.registerCommand('extension.t2_rename', () => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({ placeHolder: 'device name'}).then(value => {
            const child = execFile('t2', ['rename '+value], { timeout: 0 }, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(stderr)
                }
                vscode.window.showInformationMessage("device renamed "+value);
            });
        })
    });

    let t2_wifi_connect = vscode.commands.registerCommand('extension.t2_wifi_connect', () => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({ placeHolder: 'network name'}).then(network_name => {
            vscode.window.showInputBox({ placeHolder: 'password', password: true}).then(password => {
                const child = execFile('t2', ['wifi -n '+network_name+ ' -p '+ password], { timeout: 0 }, (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(stderr)
                    }
                    vscode.window.showInformationMessage("device connected to "+network_name);
                });
            })
        });
    });

    let t2_wifi = vscode.commands.registerCommand('extension.t2_wifi', () => {
        // The code you place here will be executed every time your command is executed
        
        const child = execFile('t2', ['wifi'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let out = stderr.replace("/\n/g"," ").replace("/\t/g"," ").replace("INFO","");
            console.log("out",out)
            vscode.window.showInformationMessage(out);
        });
    });

    let t2_provision = vscode.commands.registerCommand('extension.t2_provision', () => {
        // The code you place here will be executed every time your command is executed
        
        const child = execFile('t2',['provision'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let stderr_array = stderr.split("\n");
            vscode.window.showInformationMessage(stderr_array[stderr_array.length - 2]);
        });
    });

    let t2_update = vscode.commands.registerCommand('extension.t2_update', () => {
        // The code you place here will be executed every time your command is executed
        
        const child = execFile('t2', ['update'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let stderr_array = stderr.split("\n");
            vscode.window.showInformationMessage(stderr_array[stderr_array.length - 2]);
        });
    });

    let t2_init = vscode.commands.registerCommand('extension.t2_init', () => {
        // The code you place here will be executed every time your command is executed
        
        const child = execFile('t2', ['init'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let stdout_array = stdout.split("\n");
            console.log("stdout",stdout);
            vscode.window.showInformationMessage(stdout_array[stdout_array.length - 2]);
        });
    });

    let t2_run = vscode.commands.registerCommand('extension.t2_run', () => {
        // The code you place here will be executed every time your command is executed
        
        const child = execFile('t2', ['run',vscode.workspace.rootPath+'/index.js'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let stdout_array = stdout.split("\n");
            console.log("stdout",stdout);
            console.log("stderr",stderr);
            vscode.window.showInformationMessage(stdout_array[stdout_array.length - 2]);
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
        });
    });

    context.subscriptions.push(t2_list);
    context.subscriptions.push(t2_rename);
    context.subscriptions.push(t2_wifi_connect);
    context.subscriptions.push(t2_wifi);
    context.subscriptions.push(t2_provision);
    context.subscriptions.push(t2_update);
    context.subscriptions.push(t2_init);
    context.subscriptions.push(t2_run);
}

// this method is called when your extension is deactivated
export function deactivate() {
}