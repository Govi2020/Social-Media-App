const fs = require('fs');
const path = require('path');

function deleteFile(dir, fileName) {
    fs.readdirSync(dir).forEach(file => {
        const currPath = path.join(dir, file);
        if (fs.lstatSync(currPath).isDirectory()) {
            deleteFile(currPath, fileName);
        } else {
            if (file === fileName) {
                fs.unlinkSync(currPath);
            }
        }
    });
}

const dir = './';
const fileName = 'OneNote Table Of Contents.onetoc2';
deleteFile(dir, fileName);
