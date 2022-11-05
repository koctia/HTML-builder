const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write(`\nThe bundle.css file has been created in project-dist.\n\n`);

const dirBundle = path.join(__dirname, 'project-dist');
const dirStyle = path.join(__dirname, 'styles');
const bundle = path.join(dirBundle, 'bundle.css');
const writeFile = fs.createWriteStream(bundle);

fs.readdir(dirStyle, (err, items) => {
   if (err) throw err;
   items.forEach(fileName => {
      const file = path.join(dirStyle, fileName);
      fs.stat(file, (errStat, status) => {
         if (errStat) throw errStat;
         if (status.isFile()) {
            if (path.extname(fileName).slice(1) === 'css') {
               console.log(fileName);
               const stream = fs.createReadStream(file);
               stream.on('data', data => {
                  writeFile.write(data.toString());
               });
            }
         }
      });
   });
})

process.on('exit', () => stdout.write('\nThe bundle.css file has been generated\n\n'));
