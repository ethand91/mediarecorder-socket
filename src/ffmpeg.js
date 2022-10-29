const child_process = require('child_process');
const { EventEmitter } = require('events');

const recordFilesPath = './files';

module.exports = class Ffmpeg {
  constructor() {
    this._process = undefined;
    this._observer = new EventEmitter();
    this._createProcess();
  }

  _createProcess() {
    console.log('ffmpeg::create');

    this._process = child_process.spawn('ffmpeg', this._commandArgs);
  }

  parseData(data) {
    this._process.stdin.pipe(new Buffer(data));
  }

  kill() {
    this._process.kill('SIGINT');
  }

  get _commandArgs() {
    let commandArgs = [
      '-loglevel',
      'debug',
      '-protocol_whitelist',
      'pipe,udp',
      '-fflags',
      '+genpts',
      '-i',
      'pipe:0'
    ];

    commandArgs = commandArgs.concat(this._videoArgs);
    commandArgs = commandArgs.concat(this._audioArgs);

    const date = new Date();
    commandArgs = commandArgs.concat([
      `${recordFilePath}/${date.getTime()}.webm`
    ]);

    return commandArgs();
  }

  get _videoArgs() {
    return [
      '-map',
      '0:v:0',
      '-c:v',
      'libvpx'
    ];
  }

  get _audioArgs() {
    return [
      '-map',
      '0:a:0',
      '-strict',
      '-2',
      '-c:a',
      'libvorpis'
    ];
  }
};
