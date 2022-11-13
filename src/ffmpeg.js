const child_process = require('child_process');
const { EventEmitter } = require('events');

const { convertStringToStream } = require('./utils');

const recordFilePath = './files';

module.exports = class Ffmpeg {
  constructor() {
    this._process = undefined;
    this._observer = new EventEmitter();
    this._createProcess();
  }

  _createProcess() {
    console.log('ffmpeg::create');

    this._process = child_process.spawn('ffmpeg', this._commandArgs);
    //this._process.stdin.pipe(this._stream);
    this._process.stdin.on('data', data => {
      console.log('data', data);
    });
    this._process.stdin.on('error', error => {
      console.error('error', error);
    });
    this._process.stdin.on('error', error => {
      console.error('error', error);
    });
    this._process.stdout.on('data', data => {
      console.log('stdout data', data);
    });
    this._process.on('message', message => {
      console.log('message', message);
    });
  }

  parseData(data) {
    this._process.stdin.write(data);
  }

  kill() {
    this._process.kill('SIGINT');
  }

  get _commandArgs() {
    let commandArgs = [
      '-loglevel',
      'debug',
      '-i',
      '-'
    ];

    commandArgs = commandArgs.concat(this._videoArgs);
    commandArgs = commandArgs.concat(this._audioArgs);

    const date = new Date();
    commandArgs = commandArgs.concat([
      `${recordFilePath}/${date.getTime()}.webm`
    ]);

    return commandArgs;
  }

  get _videoArgs() {
    return [
      '-c:v',
      'copy'
    ];
  }

  get _audioArgs() {
    return [
      '-strict',
      '-2',
      '-c:a',
      'copy'
    ];
  }
};
