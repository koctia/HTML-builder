const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const dirProject = path.join(__dirname, 'project-dist');
const dirAssetsSource = path.join(__dirname, 'assets');
const dirAssets = path.join(dirProject, 'assets');
const dirStyles = path.join(__dirname, 'styles');
const dirComponents = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const index = path.join(dirProject, 'index.html');
const style = path.join(dirProject, 'style.css');

function dirCreated(dir) {
   fs.mkdir(dir, { recursive: true }, err => {
      if (err) throw err;
   });
}

function fileDell(dir) {
   fs.readdir(dir, (err, items) => {
      if (err) throw err;
      items.forEach(elements => {
         fs.unlink(path.join(dir, elements), () => {});
      });
   });
}

function fileCopy(dirAssetsSource,dirAssets) {
   dirCreated(dirAssets);
   fs.readdir(dirAssetsSource, (err, items) => {
      if (err) throw err;
      fileDell(dirAssets);
      items.forEach(elements => {
         const source = path.join(dirAssetsSource, elements);
         const recipient = path.join(dirAssets, elements);
         fs.stat(source, (err, status) => {
            if (err) throw err;
            if (status.isFile()) {
               fs.copyFile(source, recipient, err => {if (err) throw err;});
            } else {
               fileCopy(source,recipient);
            }
         });
      });
   });
}

function createdStyle(dir,writeStyle) {
   fs.readdir(dir, (err, items) => {
      if (err) throw err;
      items.forEach(fileName => {
         const file = path.join(dir, fileName);
         fs.stat(file, (err, status) => {
            if (err) throw err;
            if (status.isFile()) {
               if (path.extname(fileName).slice(1) === 'css') {
                  const stream = fs.createReadStream(file);
                  stream.on('data', data => {
                     writeStyle.write(data.toString());
                  });
               }
            }
         });
      });
   });
}

function createdIndex(dir,template,index) {
   fs.readdir(dir, (err, items) => {
      if (err) throw err;
      const stream = fs.createReadStream(template);
      stream.on('data', (data) => {
         let html = data.toString();
         items.forEach(file => {
            const source = fs.createReadStream(path.join(dir, file));
            source.on('data', (foleSource) => {
               html = html.replace(`{{${file.split('.').shift()}}}`, foleSource.toString());
               fs.createWriteStream(index).write(html);
            });
         });
      });
   });
}

async function go() {
   await dirCreated(dirProject);
   stdout.write(`\n+ Created folder project-dist`);
   await dirCreated(dirAssets);
   stdout.write(`\n+ Created folder assets`);
   await fileCopy(dirAssetsSource,dirAssets);
   stdout.write(`\n+ Copy files to assets`);
   const writeStyle = fs.createWriteStream(style);
   await createdStyle(dirStyles,writeStyle);
   stdout.write(`\n+ File style.css has been generated`);
   await createdIndex(dirComponents,template,index);
   stdout.write(`\n+ File index.html has been generated`);

   process.on('exit', () => stdout.write('\nProject created.\n\n'));
}
go();
