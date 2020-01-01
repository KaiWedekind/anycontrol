/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-lonely-if */

const AnyControl = function AnyControl() {
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  this.recognition = new SpeechRecognition();
  this.finalTranscript = '';
  this.commands = {};
  this.DEBUG = false;
  this.recognizing = false;
  this.recognition.onresult = (event) => {
    if (typeof (event.results) === 'undefined') {
      if (this.DEBUG) {
        console.info('undefined result');
      }

      this.recognition.stop();
      return;
    }

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      if (event.results[i].isFinal) {
        this.finalTranscript += event.results[i][0].transcript;
      }
    }

    if (this.finalTranscript !== '') {
      if (this.DEBUG) {
        console.info('received command:', this.finalTranscript);
      }

      this.finalTranscript = this.finalTranscript.toLowerCase().trim();
      const commands = this.commands;
      Object.keys(commands).forEach((command) => {
        if (typeof this.commands[command] === 'function') {
          if (this.finalTranscript.indexOf(command) > -1) {
            if (this.finalTranscript[command.length] === undefined) {
              if (this.DEBUG) {
                console.info('calling command', command);
              }
              this.commands[command]();
            } else if (this.finalTranscript[command.length] === ' ') {
              const param = this.finalTranscript
                .substring(command.length, this.finalTranscript.length).trim();
              this.commands[command](param);

              if (this.DEBUG) {
                console.info('calling command', command, 'with param:', param);
              }
            }
          }
        } else {
          if (this.commands[command].fragments && typeof this.commands[command].callback === 'function') {
            const snippets = this.commands[command].snippets;
            const keywords = this.commands[command].keywords;
            const startsWidthKeyword = this.commands[command].startsWidthKeyword;
            const finalTranscript = this.finalTranscript;
            let includes = true;
            const context = {};

            for (let k = 0; k < snippets.length; k += 1) {
              const snippet = snippets[k].toLowerCase().trim();
              if (finalTranscript.indexOf(snippet) === -1) {
                includes = false;
                break;
              }
            }

            let transcriptFromTo;

            if (includes) {
              if (startsWidthKeyword) {
                transcriptFromTo = finalTranscript
                  .substring(finalTranscript.indexOf(snippets[0]));
                const keyword = keywords[0];
                const keywordValue = finalTranscript
                  .substring(0, finalTranscript.indexOf(snippets[0]));

                if (keyword && keywordValue) {
                  context[keyword.replace('${', '').replace('}', '').trim()] = keywordValue.trim();
                }

                keywords.splice(0, 1);
              } else {
                transcriptFromTo = finalTranscript
                  .substring(finalTranscript.indexOf(snippets[0]));
              }

              let transcript = transcriptFromTo;
              for (let i = 0; i < snippets.length; i += 1) {
                const snippet = snippets[i].trim();
                const keyword = keywords[i];
                transcript = transcript.trim();
                transcript = transcript.replace(new RegExp(`^${snippet}`, 'gm'), '');
                let keywordValue;
                if (i + 1 < snippets.length) {
                  keywordValue = transcript
                    .substring(0, transcript.indexOf(snippets[i + 1]));
                } else {
                  keywordValue = transcript;
                }

                transcript = transcript.trim();
                transcript = transcript
                  .substring(transcript.indexOf(snippets[i + 1]));
                transcript = transcript.trim();

                if (keyword && keywordValue) {
                  context[keyword.replace('${', '').replace('}', '').trim()] = keywordValue.trim();
                }

                context.transcript = this.finalTranscript;
              }

              this.commands[command].callback(context);

              if (this.DEBUG) {
                console.info(`calling command: "${command}" with params: `, context);
              }
            }
          }
        }
      });

      this.finalTranscript = '';
    } else {
      if (this.DEBUG) {
        console.info('received empty command');
      }
    }
  };

  this.recognition.onerror = (event) => {
    if (this.DEBUG) {
      console.info('error occured', event);
    }
  };

  this.recognition.onstart = (event) => {
    if (this.DEBUG) {
      console.info('start', event);
    }

    this.recognizing = true;
  };

  this.recognition.onend = (event) => {
    if (this.DEBUG) {
      console.info('end', event);
    }

    this.recognizing = false;

    if (this.recognition.continuous) {
      if (this.DEBUG) {
        console.info('restarting', this.recognition.continuous);
      }

      this.recognition.start();
    }
  };

  return this;
};

AnyControl.prototype.isSupported = function isSupported() {
  return !!this.recognition;
};

AnyControl.prototype.addCommand = function addCommand(command, callback) {
  if (this.DEBUG) {
    console.info('added command:', command);
  }

  const keywords = command.match(/\${[a-zA-Z0-9_-]*}/gim);

  if (keywords) {
    const snippets = (command.split(/\${[a-zA-Z0-9_-]*}/gim) || []).filter(n => n).map(n => n.trim());
    const startsWidthKeyword = command.match(/^\${[a-zA-Z0-9_-]*}/gim) || false;
    const fragments = [];

    for (let i = 0; i < keywords.length; i += 1) {
      if (startsWidthKeyword) {
        fragments.push(keywords[i].trim());
        fragments.push(snippets[i].trim().toLowerCase());
      } else {
        fragments.push(snippets[i].trim().toLowerCase());
        fragments.push(keywords[i].trim());
      }
    }

    this.commands[command] = {
      startsWidthKeyword,
      snippets,
      keywords,
      fragments,
      callback,
    };
  } else {
    this.commands[command.toLowerCase()] = callback;
  }
};

AnyControl.prototype.removeCommand = function removeCommand(command) {
  if (this.DEBUG) {
    console.info('removed command:', command);
  }

  if (this.commands[command]) {
    delete this.commands[command];
    return true;
  }

  return false;
};

AnyControl.prototype.start = function start() {
  if (this.DEBUG) {
    console.info('started listening');
  }

  this.recognition.continuous = true;
  this.recognition.start();
};

AnyControl.prototype.stop = function stop() {
  if (this.DEBUG) {
    console.info('stopped listening');
  }

  this.recognition.continuous = false;
  this.recognition.stop();
};

AnyControl.prototype.getCommand = function getCommand() {
  let timeout = 1;

  if (this.isRecognizing()) {
    this.stop();

    timeout = 1000;
  }

  setTimeout(() => {
    if (this.DEBUG) {
      console.info('listening for single command');
    }

    this.recognition.continuous = false;
    this.recognition.start();
  }, timeout);
};

AnyControl.prototype.debug = function debug(mode) {
  this.DEBUG = !!mode;
};

AnyControl.prototype.isRecognizing = function isRecognizing() {
  return this.recognizing;
};

const main = AnyControl;
export default main;
module.exports = main; // for CommonJS compatibility
