#!/usr/bin/env node
import './helpers/lib.js';

function usage() {
  return [
    'Usage: node main.js <command>',
    '',
    'Commands:',
    '  info      Show project summary and common Truffle commands (default)',
    '  contracts List Solidity files under ./contracts',
    '  help      Show this message',
  ].join('\n');
}

function main() {
  const cmd = (process.argv[2] || 'info').toLowerCase();

  switch (cmd) {
    case 'help':
    case '-h':
    case '--help':
      process.stdout.write(`${usage()}\n`);
      break;
    default:
      process.stderr.write(`Unknown command: ${cmd}\n\n${usage()}\n`);
      process.exitCode = 1;
  }
}

main();
