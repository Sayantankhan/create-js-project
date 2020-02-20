import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import figlet from'figlet';
import chalk from 'chalk';

function parseArgumentIntoOptions(args){
    const argObject = arg(
        {
            '--git' : Boolean,
            '--help' : Boolean,
            '--install' : Boolean,
            '--version' : Boolean,
            '--yes' : Boolean,
            '-g' : '--git',
            '-v' : '--version',
            '-i' : '--install'
        },
        {
            argv : args.slice(2)
        }
    );
    
    return {
        skipPrompts: argObject['--yes'] || false,
        git: argObject['--git'] || false,
        template: argObject._[0],
        projectName: argObject._[1],
        runInstall: argObject['--install'] || false,
      };

}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'JavaScript';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if(!options.projectName) {
        questions.push({
            type: 'input',
            name: 'projectName',
            message: 'Please give a project name',
            default: 'Dummy',
          });
    }

    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['JavaScript', 'TypeScript'],
        default: defaultTemplate,
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      projectName: options.projectName || answers.projectName,
      git: options.git || answers.git,
    };
}

export function cli(args){
    console.log(
      chalk.blue(
        figlet.textSync('JS/TS Project', { horizontalLayout: 'full' })
      )
    );
    let options = parseArgumentIntoOptions(args);
    var optionPromise = promptForMissingOptions(options);
    var projectPromise = optionPromise.then(option => {
      createProject(option);});
    projectPromise.then(data => console.log(data));
}