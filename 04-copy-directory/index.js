const fs = require('fs');
const path = require('path');
const { stdout } = process;

const dirSource = path.join(__dirname, 'files');
const dirRecipient = path.join(__dirname, 'files-copy');

function dirDell(dir) {
   fs.readdir(dir, (err, items) => {
      if (err) throw err;
      for (let name of items) {
         fs.unlink(path.join(dir,name), err => {
            if (err) throw err;
         });
      }
   })
}

function dirCreated(dir) {
   fs.mkdir(dir, { recursive: true }, err => {
      if (err) throw err;
   });
}

function fileCopy(dirSource,dirRecipient) {
   fs.readdir(dirSource, (err, items) => {
      if (err) throw err;
      for (let name of items) {
         fs.copyFile(path.join(dirSource,name), path.join(dirRecipient,name), err => {
            if (err) throw err;
            stdout.write("file copy!\n");
         })
      }
   })
}

async function go() {
   await dirCreated(dirRecipient);
   await dirDell(dirRecipient);
   await fileCopy(dirSource,dirRecipient);
}

go();
