const readline = require('readline');
const util = require('util');
const cliDebug = util.debuglog('cli');
const event = require('events');
class Events extends event {}
const e = new Events();


const iniStarted = () => {
    console.log('\x1b[32m%s\x1b[0m','********************************************************************');
    console.log('\x1b[32m%s\x1b[0m','*                                                                  *');
    console.log('\x1b[32m%s\x1b[0m','*                  Site Checker Started                            *');
    console.log('\x1b[32m%s\x1b[0m','*                                                                  *');
    console.log('\x1b[32m%s\x1b[0m','********************************************************************');
    console.log('                                                                    ');
};

e.on('clear',() => {
   console.log(process.stdout.columns)
});

const processInput = (str) => {
    const uniqueInputs = [
        'help',
        'exit',
        'stats',
        'list users',
        'list checks',
        'list logs',
        'clear'
    ];
    let matchedCommand = false;
    const command = typeof str === 'string' && str.trim().length > 0 ? str:false;
    if(command){
        uniqueInputs.some((sysCommands) => {
            if(command.toLowerCase().indexOf(sysCommands) > -1){
                matchedCommand = true;
                e.emit(sysCommands,command);
            }
        });

        if(!matchedCommand)
            console.log('\x1b[31m%s\x1b[0m','Command not found');
    }
};

const init = () => {
    iniStarted();

    const cliInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> '
    });
    cliInterface.prompt();
    cliInterface.on('line', (str) => {
        processInput(str);
        cliInterface.prompt();
    });
};

init();
