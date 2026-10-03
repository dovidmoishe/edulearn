// Mock os module with signals support for browser
const os = require('os-browserify/browser');

// Add missing constants.signals that human-signals expects
if (!os.constants) {
  os.constants = {};
}

if (!os.constants.signals) {
  os.constants.signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGILL: 4,
    SIGTRAP: 5,
    SIGABRT: 6,
    SIGBUS: 7,
    SIGFPE: 8,
    SIGKILL: 9,
    SIGUSR1: 10,
    SIGSEGV: 11,
    SIGUSR2: 12,
    SIGPIPE: 13,
    SIGALRM: 14,
    SIGTERM: 15,
  };
}

module.exports = os;
