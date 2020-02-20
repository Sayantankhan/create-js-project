import chalk from 'chalk';
import ncp from 'ncp';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory + '/' +options.projectName, {
      clobber: false,
    });
}

export async function createProject(options) {

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../template',
        options.template.toLowerCase()
      );

    options.templateDirectory = templateDir;
    
    try {
        await access(templateDir, fs.constants.R_OK);
      } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
      }
     
    console.log('Copy project files');
    await copyTemplateFiles(options);
     
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}