const path = require('path');
const fse = require('fs-extra');
const { execSync } = require('child_process');
const currentDir = path.join(__dirname, '../');
const ngElementsDir = path.join(__dirname, '../../raaghu-elements');
const ngComponentsDir = path.join(__dirname, '../projects/libs/rds-elements');
const filesToReplace = [
    '.storybook',
    '.editorconfig',
    '.gitignore',
    'tsconfig.json'
];
const dependentElements = [
    'rds-icon',
    'rds-badge'
];

function replaceFiles() {
    for (const fileName of filesToReplace) {
        fse.copySync(path.join(ngElementsDir, fileName), path.join(ngComponentsDir, fileName), { overwrite: true });
    }
}

function mergeTSConfigJson() {
    let changesDone = false;
    const ngElementsFile = JSON.parse(fse.readFileSync(path.join(currentDir, 'tsconfig.json')).toString());
    if (ngElementsFile.compilerOptions.paths["@libs/rds-elements"] == undefined) {
        ngElementsFile.compilerOptions.paths = {
            ...ngElementsFile.compilerOptions.paths,
            "@libs/rds-elements": [
                "projects/libs/rds-elements/src/root/public-api"
            ]
        };
        changesDone = true;
    };
    if (ngElementsFile.compilerOptions.paths["@libs/rds-icon"] == undefined) {
        ngElementsFile.compilerOptions.paths = {
            ...ngElementsFile.compilerOptions.paths,
            "@libs/rds-icon": [
                "rds-elements/rds-icon/public-api",
                "rds-elements/rds-icon"
            ]
        };
        changesDone = true;
    };
    if (ngElementsFile.compilerOptions.paths["@libs/rds-badge"] == undefined) {
        ngElementsFile.compilerOptions.paths = {
            ...ngElementsFile.compilerOptions.paths,
            "@libs/rds-badge": [
                "rds-elements/rds-badge/public-api",
                "rds-elements/rds-badge"
            ]
        };
        changesDone = true;
    };
    if (changesDone) {
        console.log('Updating tsconfig.json file...');
        fse.writeFileSync(path.join(currentDir, 'tsconfig.json'), JSON.stringify(ngElementsFile, null, 2));
    }
}

function getDirectories(source) {
    return fse.readdirSync(source, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);
}

function copyProjects() {
    const ngElementsDirectories = getDirectories(path.join(ngElementsDir, 'src'));
    for (const dir of ngElementsDirectories) {
        fse.copySync(path.join(ngElementsDir, 'src', dir), path.join(ngComponentsDir, 'src', dir), { overwrite: true });
    }
}

function buildDependentElements() {
    console.log('Building dependent \x1b[32m' + dependentElements.toString() + '\x1b[0m elements...');
    for (const element of dependentElements) {
        execSync(`npm run build ${element}`, { cwd: ngElementsDir, stdio: 'inherit' });
    }

    console.log("Coping element's build folder...");
    fse.copySync(path.join(ngElementsDir, 'rds-elements'), path.join(currentDir, 'rds-elements'), { overwrite: true });
}

try {

    buildDependentElements();

    console.log('Replacing config files...');
    replaceFiles();

    console.log('Merging tsconfig.json file...');
    mergeTSConfigJson();

    console.log('Copying over projects...');
    copyProjects();

} catch (error) {
    console.error(error);
}