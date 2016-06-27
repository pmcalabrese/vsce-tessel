'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {execFile,execSync} from 'child_process';
import * as fs from 'fs';

export interface IOptions {
    /** Set timeout in seconds for scanning for networked tessels  [5] */
	timeout: number;
    /** SSH key for authorization with your Tessel */
	key: string;
    /** The name of the tessel on which the command will be executed */
	name: string;
    /** Use only a LAN connection */
	lan: boolean;
    /** Use only a USB connection */
	usb: boolean;
    /** Prefer a LAN connection when available, otherwise use USB.  [false] */
	lanPrefer: boolean;
    /** Enable or disable writing command output to stdout/stderr. Useful for CLI API consumers.  [true] */
	output: boolean;
	type: string;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "tessel" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    function readOptions(cb) {
        fs.readFile(vscode.workspace.rootPath+'/tesselfile.json', (err, options) => {
            cb(JSON.parse(options.toString()));
        });
    }

    function readOption(option, cb) {
        readOptions(function (options) {
            cb(options[option]);
        })
    }

    function writeOptions(option,cb) {
        readOptions(function (options:IOptions) {
            let new_options = Object.assign(options,option);
            fs.writeFile(vscode.workspace.rootPath+'/tesselfile.json', JSON.stringify(new_options, null, '\t'), cb);
        });
    }

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
                let device_name = "";
                device_name = value.title.split("\t")[2];
                if (value.title.indexOf('LAN') !== -1) {
                    writeOptions({lan:true,usb:false,name:device_name},function () {
                    });
                }
                if (value.title.indexOf('USB') !== -1) {
                    writeOptions({lan:false,usb:true,name:device_name},function () {
                    });  
                }
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

    let t2_wifi_cofig = vscode.commands.registerCommand('extension.t2_wifi_cofig', () => {
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
        
        const child = execFile('t2', ['init'], { cwd:vscode.workspace.rootPath ,timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stderr)
            }
            let stdout_array = stdout.split("\n");
            vscode.window.showInformationMessage(stdout_array[stdout_array.length - 2]);
        });
    });

    let t2_run = vscode.commands.registerCommand('extension.t2_run', () => {
        // The code you place here will be executed every time your command is executed
        console.log("vscode.workspace.textDocuments",vscode.workspace.textDocuments);
        readOptions(options => {
            var flags: string = "";
            if (options.lan) {
                flags = "--lan" 
            } else if (options.usb) {
                flags = "--usb"
            }
            if (options.lanPrefer) {
                flags += " --lanPrefer"
            }
            const child = execFile('t2', ['run',flags,vscode.workspace.rootPath+'/index.js'], { timeout: 0 }, (error, stdout, stderr) => {
                if (error) {
                    let stderr_array = stderr.split("\n");
                    vscode.window.showErrorMessage(stderr_array[stderr_array.length - 2])
                }
                let stdout_array = stdout.split("\n");
                console.log("stdout",stdout);
                console.log("stderr",stderr);
                vscode.window.showInformationMessage(stdout_array[stdout_array.length - 2]);
            });
            child.on('close', function(code) {
                console.log('closing code: ' + code);
            });
        })
    });

    let t2_push = vscode.commands.registerCommand('extension.t2_push', () => {
        // The code you place here will be executed every time your command is executed
        console.log("vscode.workspace.textDocuments",vscode.workspace.textDocuments);
        const child = execFile('t2', ['push',vscode.workspace.rootPath+'/index.js'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                let stderr_array = stderr.split("\n");
                vscode.window.showErrorMessage(stderr_array[stderr_array.length - 2])
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

    let t2_erase = vscode.commands.registerCommand('extension.t2_erase', () => {
        // The code you place here will be executed every time your command is executed
        console.log("vscode.workspace.textDocuments",vscode.workspace.textDocuments);
        const child = execFile('t2', ['erase'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                let stderr_array = stderr.split("\n");
                vscode.window.showErrorMessage(stderr_array[stderr_array.length - 2])
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

    let t2_version = vscode.commands.registerCommand('extension.t2_version', () => {
        // The code you place here will be executed every time your command is executed
        console.log("vscode.workspace.textDocuments",vscode.workspace.textDocuments);
        const child = execFile('t2', ['version'], { timeout: 0 }, (error, stdout, stderr) => {
            if (error) {
                let stderr_array = stderr.split("\n");
                vscode.window.showErrorMessage(stderr_array[stderr_array.length - 2])
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

    let create_tesselfile = vscode.commands.registerCommand('extension.create_tesselfile', () => {
        // The code you place here will be executed every time your command is executed
        const options = {
            timeout: 5,
            key:'',
            name: '',
            lanPrefer: false,
            output: true,
            type:'ram'
        }

        fs.writeFile(vscode.workspace.rootPath+'/tesselfile.json', JSON.stringify(options, null, '\t'), (err) => {
            if (err) throw err;
            vscode.window.showInformationMessage('tesselfile.json created!');
        });
    });


    context.subscriptions.push(t2_list);
    context.subscriptions.push(t2_rename);
    context.subscriptions.push(t2_wifi_cofig);
    context.subscriptions.push(t2_wifi);
    context.subscriptions.push(t2_provision);
    context.subscriptions.push(t2_update);
    context.subscriptions.push(t2_init);
    context.subscriptions.push(t2_run);
    context.subscriptions.push(t2_push);
    context.subscriptions.push(t2_erase);
    context.subscriptions.push(create_tesselfile);
}

// this method is called when your extension is deactivated
export function deactivate() {
}