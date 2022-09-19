const fsPromise = require('fs/promises');
const fs = require('fs');
const typesFolderPath = `${__dirname}/lib/types`
const IMPORT = 'import'
const EXPORT = 'export {}'
let finalContentFile = ''

const getRelevantFileContent = (fileContent, startIdx, endIdx) => {
    const fileContentBeforeImport = fileContent.substring(0, startIdx);
    const fileContentAfterImport = fileContent.substring(endIdx)
    return fileContentBeforeImport + fileContentAfterImport

}

const filterFileContent = (fileContent, target) => {
    for (let i = 0; i < fileContent.length; i++) {
        if (fileContent[i] === target.charAt(0) && fileContent.substring(i, i + target.length) === target) {
            const endIdx = fileContent.indexOf(';', i) + 1
            fileContent = getRelevantFileContent(fileContent, i, endIdx)
        }
    }
    return fileContent
}

const handleFile = (path) => {
    let fileContent = fs.readFileSync(path, 'utf-8')
    let importIdx = fileContent.indexOf(IMPORT)
    if (importIdx > -1) {
        fileContent = filterFileContent(fileContent, IMPORT)
    }
    const emptyExportIdx = fileContent.indexOf(EXPORT)
    if (emptyExportIdx > -1) {
        fileContent = filterFileContent(fileContent, EXPORT)
    }
    finalContentFile += fileContent
}

const handleFolder = (path) => {
    const res = fs.readdirSync(path);
    res.forEach(file => {
        const basePath = `${path}/${file}`
        if (fs.lstatSync(basePath).isDirectory()) {
            handleFolder(basePath);
        } else {
            handleFile(basePath)
        }
    })


}

const init = async () => {
    finalContentFile = fs.readFileSync(`${__dirname}/types/types.d.ts`)
    const typesFolder = await fsPromise.readdir(typesFolderPath, 'utf-8')
    typesFolder.forEach((name) => {
        const basePath = `${typesFolderPath}/${name}`
        if (fs.lstatSync(basePath).isDirectory()) {
            handleFolder(basePath);
        } else {
            handleFile(basePath)
        }
    })
    fs.unlinkSync(`${__dirname}/lib/server.js`)
    fs.writeFileSync(__dirname + '/lib/main.d.ts', finalContentFile)
}

init()