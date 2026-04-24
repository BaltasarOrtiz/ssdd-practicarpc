import {spawn} from 'node:child_process';
import {section, sleep, truncateOutput} from './utils.js';

function mergeEnv(extraEnv = {}) {
  return {...process.env, ...extraEnv};
}

function spawnBash(command, {cwd, env = {}, detached = false, stdio = ['ignore', 'pipe', 'pipe']} = {}) {
  return spawn('bash', ['-lc', command], {
    cwd,
    env: mergeEnv(env),
    detached,
    stdio
  });
}

function makeErrorResult(error) {
  return {
    success: false,
    code: -1,
    signal: null,
    stdout: '',
    stderr: error.message,
    output: `Error al lanzar el comando: ${error.message}`
  };
}

export async function runCapturedCommand(command, {cwd, env = {}} = {}) {
  return new Promise(resolve => {
    const child = spawnBash(command, {cwd, env});

    let stdout = '';
    let stderr = '';
    let settled = false;

    child.on('error', error => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(makeErrorResult(error));
    });

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('close', (code, signal) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve({
        success: code === 0,
        code: code ?? -1,
        signal,
        stdout,
        stderr,
        output: [stdout.trim(), stderr.trim()].filter(Boolean).join('\n')
      });
    });
  });
}

export async function runTerminalCommand(command, {cwd, env = {}, setRawMode} = {}) {
  if (typeof setRawMode === 'function') {
    setRawMode(false);
  }

  try {
    return await new Promise(resolve => {
      const child = spawnBash(command, {cwd, env, stdio: 'inherit'});
      let settled = false;

      child.on('error', error => {
        if (settled) {
          return;
        }

        settled = true;
        resolve(makeErrorResult(error));
      });

      child.on('close', (code, signal) => {
        if (settled) {
          return;
        }

        settled = true;
        resolve({
          success: code === 0,
          code: code ?? -1,
          signal,
          output: 'La orden se ejecutó usando la terminal interactiva.'
        });
      });
    });
  } finally {
    if (typeof setRawMode === 'function') {
      setRawMode(true);
    }
  }
}

function killDetachedProcess(child) {
  if (!child?.pid) {
    return;
  }

  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    return;
  }

  setTimeout(() => {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      // no-op
    }
  }, 1200);
}

export async function runServerClientRecipe({title, server, client, waitMs = 1600}) {
  return new Promise(resolve => {
    const serverChild = spawnBash(server.command, {
      cwd: server.cwd,
      env: server.env,
      detached: true
    });

    let serverStdout = '';
    let serverStderr = '';
    let serverExit = null;
    let settled = false;

    serverChild.on('error', error => {
      if (settled) {
        return;
      }

      settled = true;
      resolve({success: false, output: section('Error servidor', makeErrorResult(error).output)});
    });

    serverChild.stdout?.on('data', chunk => {
      serverStdout += chunk.toString();
    });

    serverChild.stderr?.on('data', chunk => {
      serverStderr += chunk.toString();
    });

    serverChild.on('close', (code, signal) => {
      serverExit = {code, signal};
    });

    sleep(waitMs).then(async () => {
      if (settled) {
        return;
      }

      if (serverExit && serverExit.code !== 0) {
        settled = true;
        resolve({
          success: false,
          output: [
            section('Servidor', truncateOutput([serverStdout, serverStderr].join('\n'))),
            section('Error', `${title}: el servidor terminó antes de ejecutar el cliente.`)
          ].join('\n\n')
        });
        return;
      }

      const clientResult = await runCapturedCommand(client.command, {
        cwd: client.cwd,
        env: client.env
      });

      killDetachedProcess(serverChild);
      settled = true;
      resolve({
        success: clientResult.success,
        output: [
          section('Cliente', truncateOutput(clientResult.output)),
          section('Servidor', truncateOutput([serverStdout, serverStderr].join('\n')))
        ].join('\n\n')
      });
    });
  });
}

export async function runFailureRecipe({title, server, client, killAfterMs = 1000, startupWaitMs = 1600}) {
  return new Promise(resolve => {
    const serverChild = spawnBash(server.command, {
      cwd: server.cwd,
      env: server.env,
      detached: true
    });

    let serverStdout = '';
    let serverStderr = '';
    let settled = false;

    serverChild.on('error', error => {
      if (settled) {
        return;
      }

      settled = true;
      resolve({success: false, output: section('Error servidor', makeErrorResult(error).output)});
    });

    serverChild.stdout?.on('data', chunk => {
      serverStdout += chunk.toString();
    });

    serverChild.stderr?.on('data', chunk => {
      serverStderr += chunk.toString();
    });

    sleep(startupWaitMs).then(async () => {
      if (settled) {
        return;
      }

      const clientPromise = runCapturedCommand(client.command, {
        cwd: client.cwd,
        env: client.env
      });

      await sleep(killAfterMs);
      killDetachedProcess(serverChild);

      const clientResult = await clientPromise;

      if (settled) {
        return;
      }

      settled = true;
      resolve({
        success: clientResult.success,
        output: [
          section('Cliente', truncateOutput(clientResult.output)),
          section('Servidor', truncateOutput([serverStdout, serverStderr].join('\n'))),
          section('Observación', `${title}: se forzó la caída del servidor durante la invocación.`)
        ].join('\n\n')
      });
    });
  });
}
