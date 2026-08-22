import { spawn } from 'node:child_process';

const commands = [
  { name: 'api', args: ['run', 'dev:api'] },
  { name: 'web', args: ['run', 'dev:web'] },
];

const children = commands.map(({ name, args }) => {
  const child = spawn('npm', args, { stdio: 'inherit' });
  child.on('error', (error) => {
    console.error(`Unable to start the KrishiSetu ${name} service: ${error.message}`);
  });
  return { name, child };
});

let stopping = false;

function stopAll(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  for (const { child } of children) {
    if (!child.killed) child.kill(signal);
  }
}

for (const { name, child } of children) {
  child.on('exit', (code, signal) => {
    if (stopping) return;
    console.error(
      `KrishiSetu ${name} service stopped unexpectedly (${signal ?? `exit ${code ?? 1}`}).`
    );
    process.exitCode = code ?? 1;
    stopAll();
  });
}

process.on('SIGINT', () => stopAll('SIGINT'));
process.on('SIGTERM', () => stopAll('SIGTERM'));

await Promise.all(children.map(({ child }) => new Promise((resolve) => child.once('exit', resolve))));
