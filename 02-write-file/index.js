const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write(`\nEnter your text. To complete the work, enter "exit".\n\n`);
const writeFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.on('data', data => {
   if (data.toString().trim() === 'exit' || data.toString().includes('exit')) {
      process.exit();
   }
   writeFile.write(data);
});

process.on('SIGINT', () => {
   process.exit();
});

process.on('exit', () => stdout.write('\nCome again!\n\n'));
