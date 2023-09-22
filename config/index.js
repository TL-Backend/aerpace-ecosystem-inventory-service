const fs = require('fs');

const { NODE_ENV = 'development' } = process.env;

const CONFIG_FILE_PATH = `${__dirname}/${NODE_ENV}.config.json`;

exports.getConfig = () => {
  const fileData = fs.readFileSync(CONFIG_FILE_PATH, {
    encoding: 'utf8',
    flag: 'r',
  });
  const config = JSON.parse(fileData);
  return config;
};

exports.initConfig = async () => {
  const fileData = fs.readFileSync(CONFIG_FILE_PATH, {
    encoding: 'utf8',
    flag: 'r',
  });
  const config = JSON.parse(fileData);
  return config;
};
