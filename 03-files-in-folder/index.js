const fs = require('fs');
const path = require('path');
const { stdout } = process;

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, (err, items) => {
   if (err) throw err;
   stdout.write(`<file name> - <file extension> - <file size>\n`);
   for (let name of items) {
      const file = path.join(dir, name);
      fs.stat(file, (errStat, status) => {
         if (errStat) throw errStat;
         if (status.isFile()) {
            stdout.write(`${name.split('.').shift()} - ${path.extname(name).slice(1)} - ${status.size / 1024}kb \n`);
         }
      });
   }
});
