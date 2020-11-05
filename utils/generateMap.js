const {v4} = require('uuid');
const path = require('path');
const fs = require('fs');

/**
 * @desc Generate random input map
 * @return {String} map filepath
 * @param {Number} width map width
 * @param {Number} height map height
 */
const generateFile = (width, height) => {
  return new Promise(function(resolve, reject) {
    try {
      const filename = v4() + '.txt';
      const filepath = path.resolve(
        global.__basedir,
        'python',
        'map',
        filename,
      );

      const {spawn} = require('child_process');
      const pyProg = spawn('python3',
        [
          path.resolve(global.__basedir, 'python', 'generateInput.py' ),
          filepath,
          height,
          width,
        ]);

      pyProg.on('exit', (code, signal) => {
        console.log(code, signal);
        resolve(filepath);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const parseInputFile = (filepath) => {
  return new Promise(function(resolve, reject) {
    try {
      fs.readFile(filepath, {encoding: 'utf-8', flag: 'r'}, (err, buffer) => {
        buffer = buffer.split('\n');
        const result = {
          points: [],
          tiled: [],
        };

        let r = 0;
        buffer[r] = buffer[r].split(' ');
        result.height = parseInt(buffer[r][0]);
        result.width = parseInt(buffer[r][1]);
        r++;

        // parse points maps
        // & init tiled maps
        for (let i = 0; i < result.height; i++) {
          buffer[r] = buffer[r].split(' ');

          const tmpArr = [];
          const initialTiled = [];

          for (let j = 0; j < result.width; j++) {
            tmpArr.push(parseInt(buffer[r][j]));
            initialTiled.push(0);
          }
          result.points.push(tmpArr);
          result.tiled.push(initialTiled);
          r++;
        }

        // read turn
        result.turns = parseInt(buffer[r++]);
        result.agentsNum = parseInt(buffer[r++]);

        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const generateMap = async (width, height) => {
  const filepath = await generateFile(width, height);
  const result = await parseInputFile(filepath);
  return result;
};

module.exports = {
  generateMap,
};
