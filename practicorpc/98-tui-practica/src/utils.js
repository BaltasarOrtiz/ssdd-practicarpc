import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TUI_DIR = path.resolve(__dirname, '..');
export const PROJECT_ROOT = path.resolve(TUI_DIR, '..', '..');
export const PRACTICO_ROOT = path.join(PROJECT_ROOT, 'practicorpc');
export const VENV_DIR = path.join(PROJECT_ROOT, '.venv');
export const VENV_PYTHON = path.join(VENV_DIR, 'bin', 'python');
export const NODE_CLIENT_DIR = path.join(
  PRACTICO_ROOT,
  '05-grpc',
  '02-java-rmi-b-y-d-en-grpc',
  'node-client'
);
export const GRPC_PYTHON_SERVER_DIR = path.join(
  PRACTICO_ROOT,
  '05-grpc',
  '02-java-rmi-b-y-d-en-grpc',
  'python-server'
);
export const GRPC_GENERATED_DIR = path.join(GRPC_PYTHON_SERVER_DIR, 'generated');

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fileExists(targetPath) {
  return fs.existsSync(targetPath);
}

export function shEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

export function normalizeInteger(input) {
  const trimmed = String(input).trim();
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error('Debe ser un número entero válido.');
  }

  return Number.parseInt(trimmed, 10);
}

export function truncateOutput(output, maxLines = 48) {
  const normalized = String(output ?? '').replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return 'Sin salida.';
  }

  const lines = normalized.split('\n');
  if (lines.length <= maxLines) {
    return normalized;
  }

  return `${lines.slice(0, maxLines).join('\n')}\n... (${lines.length - maxLines} líneas más)`;
}

export function parseOsRelease() {
  const osReleasePath = '/etc/os-release';
  if (!fileExists(osReleasePath)) {
    return {id: 'unknown', prettyName: 'unknown'};
  }

  const raw = fs.readFileSync(osReleasePath, 'utf8');
  const data = {};

  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, value] = match;
    data[key] = value.replace(/^"|"$/g, '');
  }

  return {
    id: data.ID ?? 'unknown',
    prettyName: data.PRETTY_NAME ?? data.NAME ?? 'unknown'
  };
}

export function section(title, content) {
  return `## ${title}\n${String(content ?? '').trim()}`.trim();
}

export function formatCommandBlock(command, cwd) {
  return [cwd ? `cwd: ${cwd}` : null, `command: ${command}`].filter(Boolean).join('\n');
}
