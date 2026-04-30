import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const semverPattern = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

function cleanVersion(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && semverPattern.test(trimmed) ? trimmed : undefined;
}

function readPackageVersion(packagePath: string): string | undefined {
  if (!existsSync(packagePath)) return undefined;

  try {
    const parsed = JSON.parse(readFileSync(packagePath, 'utf8')) as { version?: string };
    return cleanVersion(parsed.version);
  } catch {
    return undefined;
  }
}

function detectLocalSourceVersion(): string | undefined {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, '../../../agentmako/apps/cli/package.json'),
    resolve(process.cwd(), '../agentmako/apps/cli/package.json'),
  ];

  for (const candidate of candidates) {
    const version = readPackageVersion(candidate);
    if (version) return version;
  }

  return undefined;
}

function detectPublishedVersion(): string | undefined {
  try {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const output = execFileSync(npmCommand, ['view', 'agentmako', 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    });
    return cleanVersion(output);
  } catch {
    return undefined;
  }
}

function parseToolCount(raw: string): number | undefined {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.length;

    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      if (Array.isArray(record.tools)) return record.tools.length;

      if (record.categories && typeof record.categories === 'object') {
        let total = 0;
        for (const value of Object.values(record.categories as Record<string, unknown>)) {
          if (Array.isArray(value)) total += value.length;
          else if (value && typeof value === 'object' && Array.isArray((value as { tools?: unknown }).tools)) {
            total += ((value as { tools: unknown[] }).tools).length;
          }
        }
        return total > 0 ? total : undefined;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function detectToolCount(): number | undefined {
  const fromEnv = Number.parseInt(process.env.AGENTMAKO_TOOL_COUNT ?? '', 10);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;

  try {
    const command = process.platform === 'win32' ? 'cmd.exe' : 'agentmako';
    const args = process.platform === 'win32'
      ? ['/d', '/s', '/c', 'agentmako tool list --json']
      : ['tool', 'list', '--json'];
    const output = execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 16 * 1024 * 1024,
      timeout: 10000,
    });
    return parseToolCount(output);
  } catch {
    return undefined;
  }
}

const version =
  cleanVersion(process.env.AGENTMAKO_VERSION) ??
  detectLocalSourceVersion() ??
  detectPublishedVersion();

const toolCount = detectToolCount();

export const agentmakoMeta = {
  version,
  versionLabel: version ? `agentmako ${version}` : 'agentmako',
  installPackageLabel: version ? `agentmako@${version}` : 'agentmako',
  toolCount,
  toolCountLabel: toolCount ? `${toolCount} typed tools` : 'typed tools',
  toolCountHeadline: toolCount ? `${toolCount} typed tools` : 'Typed tools',
  toolCountSentence: toolCount ? `${toolCount} typed MCP tools` : 'typed MCP tools',
};
