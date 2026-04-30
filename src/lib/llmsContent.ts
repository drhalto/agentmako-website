import { agentmakoMeta } from './agentmakoMeta';

const toolCatalogIntro = agentmakoMeta.toolCount
  ? `agentmako exposes ${agentmakoMeta.toolCount} typed MCP tools across project context, code intelligence,
Reef findings, diagnostics, database inspection, traces, artifacts, and workflow
helpers. Use the generated tool catalog for the exact runtime surface:`
  : `agentmako exposes typed MCP tools across project context, code intelligence,
Reef findings, diagnostics, database inspection, traces, artifacts, and workflow
helpers. Use the generated tool catalog for the exact runtime surface:`;

export function buildLlmsTxt(): string {
  return `# agentmako

> Local-first Model Context Protocol (MCP) server that gives AI coding agents
> typed, deterministic context about your codebase — instead of letting them
> grep blind. Compatible with Claude Code, Codex CLI, Cursor, and Cline.

${agentmakoMeta.versionLabel} is an open-source MCP server (Apache-2.0) that indexes your repo
into local SQLite, tracks ESLint/TypeScript diagnostics, snapshots your
Postgres or Supabase schema, and returns deterministic workflow context
via the stdio Model Context Protocol. The Reef Engine layer adds revisioned
durable facts, findings, diagnostic freshness, acknowledgements, conventions,
and cross-session memory.

Compatible with: Claude Code, Codex CLI, Cursor, Cline, Continue.dev, and
any other MCP-compliant client. Requires Node.js 20 or newer. No hosted
service — everything runs locally.

Install: \`npm install -g agentmako\`

## Quickstart

- [Install and attach a project](https://agentmako.drhalto.com/#install): four commands, ~60 seconds
- [CLAUDE.md / AGENTS.md template](https://agentmako.drhalto.com/CLAUDE.md): drop-in playbook telling agents when to use Mako tools
- [GitHub repository](https://github.com/drhalto/agentmako): source code, issues, contributions
- [npm package](https://www.npmjs.com/package/agentmako): published releases

## Setup guides per coding agent

- [Claude Code setup](https://agentmako.drhalto.com/docs/claude-code.html): plain MCP wiring or bundled \`mako-ai\` plugin with \`/mako-ai\` skills
- [Codex CLI setup](https://agentmako.drhalto.com/docs/codex.html): TOML config in \`~/.codex/config.toml\`
- [Cursor setup](https://agentmako.drhalto.com/docs/cursor.html): per-project \`.cursor/mcp.json\` or global config
- [Cline (VS Code) setup](https://agentmako.drhalto.com/docs/cline.html): paste into Cline MCP Servers settings

## Concepts

- [What is MCP (Model Context Protocol)?](https://agentmako.drhalto.com/docs/concepts/mcp.html): how MCP works, why it exists, what makes it different from a regular API
- [What is a context packet?](https://agentmako.drhalto.com/docs/concepts/context-packets.html): ranked, source-labeled context returned by \`context_packet\`
- [What is the Reef Engine?](https://agentmako.drhalto.com/docs/concepts/reef-engine.html): durable facts and findings layer with freshness tracking
- [Freshness model](https://agentmako.drhalto.com/docs/concepts/freshness.html): how Mako labels evidence as live, fresh_indexed, stale, contradicted, or unknown

## Tool catalog

${toolCatalogIntro}

- **Context**: \`mako_help\`, \`context_packet\`, \`tool_batch\`, \`reef_scout\`, \`reef_inspect\`, \`reef_diff_impact\`, \`evidence_confidence\`, \`evidence_conflicts\`
- **Preflight and Reef**: \`file_preflight\`, \`project_findings\`, \`file_findings\`, \`project_open_loops\`, \`verification_state\`, \`project_conventions\`, \`rule_memory\`, \`reef_known_issues\`, \`reef_where_used\`, \`working_tree_overlay\`
- **Code intel**: \`repo_map\`, \`cross_search\`, \`ast_find_pattern\`, \`live_text_search\`, \`symbols_of\`, \`exports_of\`, \`imports_impact\`
- **Database**: \`db_table_schema\`, \`db_rls\`, \`db_rpc\`, \`tenant_leak_audit\`, \`schema_usage\`, \`db_reef_refresh\`
- **Trace & flow**: \`route_trace\`, \`trace_file\`, \`trace_table\`, \`trace_rpc\`, \`route_context\`, \`flow_map\`, \`graph_path\`, \`auth_path\`, \`change_plan\`
- **Diagnostics and rules**: \`typescript_diagnostics\`, \`eslint_diagnostics\`, \`oxlint_diagnostics\`, \`biome_diagnostics\`, \`lint_files\`, \`diagnostic_refresh\`, \`git_precommit_check\`, \`rule_pack_validate\`, \`extract_rule_template\`, \`finding_ack\`

The MCP daemon lazy-starts during Reef-backed sessions, watches changed files,
and runs scoped refresh work so \`verification_state\` and \`file_preflight\` can
show whether diagnostics cover the current working tree.

Full catalog: https://agentmako.drhalto.com/#tools

\`schema_usage\` uses exact schema-object matching and reports direct app-code
references. Use \`trace_rpc\`, \`route_context\`, \`table_neighborhood\`, or
\`flow_map\` for RPC-mediated and transitive schema paths.

## Common questions

- [How do I add an MCP server to Claude Code?](https://agentmako.drhalto.com/docs/faq.html#how-do-i-add-mcp-to-claude-code)
- [How do I add an MCP server to Cursor?](https://agentmako.drhalto.com/docs/faq.html#how-do-i-add-mcp-to-cursor)
- [How do I add an MCP server to Codex CLI?](https://agentmako.drhalto.com/docs/faq.html#how-do-i-add-mcp-to-codex)
- [Why does my AI coding agent rediscover the codebase every prompt?](https://agentmako.drhalto.com/docs/faq.html#why-rediscover)
- [How do I make Claude Code aware of my Postgres schema?](https://agentmako.drhalto.com/docs/faq.html#postgres-aware)
- [What's the best way to give an AI coding agent codebase context?](https://agentmako.drhalto.com/docs/faq.html#best-context)
- [Is agentmako free?](https://agentmako.drhalto.com/docs/faq.html#is-it-free)
- [Does agentmako work offline?](https://agentmako.drhalto.com/docs/faq.html#offline)

## Recipes

- [Trace an auth flow with agentmako](https://agentmako.drhalto.com/docs/recipes/auth-flow-tracing.html)
- [Refactor safely with AI coding agents](https://agentmako.drhalto.com/docs/recipes/safe-refactoring.html)
- [Make AI agents schema-aware (Postgres / Supabase)](https://agentmako.drhalto.com/docs/recipes/database-aware-edits.html)
- [Debug tricky bugs with \`context_packet\`](https://agentmako.drhalto.com/docs/recipes/debugging-with-context.html)

## Optional

- [Changelog](https://github.com/drhalto/agentmako/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/drhalto/agentmako/blob/main/CONTRIBUTING.md)
- [Security policy](https://github.com/drhalto/agentmako/blob/main/SECURITY.md)
- [License — Apache-2.0](https://github.com/drhalto/agentmako/blob/main/LICENSE)
`;
}

export function buildLlmsFullTxt(): string {
  const firstSentence = agentmakoMeta.toolCount
    ? `${agentmakoMeta.versionLabel} indexes a project into local SQLite, tracks diagnostics, snapshots Postgres/Supabase schema when configured, and exposes ${agentmakoMeta.toolCount} typed tools over the Model Context Protocol.`
    : `${agentmakoMeta.versionLabel} indexes a project into local SQLite, tracks diagnostics, snapshots Postgres/Supabase schema when configured, and exposes typed tools over the Model Context Protocol.`;

  return `# agentmako full context

> Local-first MCP server for AI coding agents and agent harnesses. agentmako gives Claude Code, Codex CLI, Cursor, Cline, and other MCP clients typed context about a repo, database, and active findings.

${firstSentence} The Reef Engine stores revisioned durable facts, findings, diagnostic freshness, acknowledgements, conventions, and operation history so a coding agent does not have to rediscover the same codebase context every turn.

This file is the long-form companion to \`/llms.txt\`. It is intended for crawlers, AI search tools, and humans who want the main project facts in one plain-text document.

## Canonical links

- Site: https://agentmako.drhalto.com/
- GitHub: https://github.com/drhalto/agentmako
- npm: https://www.npmjs.com/package/agentmako
- Setup docs: https://agentmako.drhalto.com/docs/
- FAQ: https://agentmako.drhalto.com/docs/faq.html
- Claude Code guide: https://agentmako.drhalto.com/docs/claude-code.html
- Codex CLI guide: https://agentmako.drhalto.com/docs/codex.html
- Cursor guide: https://agentmako.drhalto.com/docs/cursor.html
- Cline guide: https://agentmako.drhalto.com/docs/cline.html

## Definition

agentmako is a local-first MCP server for AI coding agents. It helps an agent harness answer "what matters in this repo?" with indexed code facts, database context, diagnostics, durable findings, and freshness labels instead of blind grep.

## Quickstart

\`\`\`bash
npm install -g agentmako
agentmako connect . --no-db
agentmako doctor
agentmako mcp
\`\`\`

Add the MCP server to the agent harness:

\`\`\`json
{
  "mcpServers": {
    "mako-ai": {
      "command": "agentmako",
      "args": ["mcp"]
    }
  }
}
\`\`\`

Codex CLI uses TOML:

\`\`\`toml
[mcp_servers.mako-ai]
command = "agentmako"
args = ["mcp"]
\`\`\`

## Core concepts

- **MCP server**: a local stdio process exposing tools to an AI agent.
- **Agent harness**: the coding-agent environment that calls tools, such as Claude Code, Codex CLI, Cursor, or Cline.
- **Mako help**: task-oriented workflow recipes that tell an agent which tools to call first for audits, edits, debugging, and verification.
- **Context packet**: a ranked, source-labeled bundle of likely relevant files, symbols, routes, schema objects, findings, risks, freshness gates, and next reads.
- **Reef Engine**: agentmako's durable fact/finding layer. It keeps track of revisioned change sets, indexed facts, active findings, acknowledgements, diagnostics, operation history, and freshness.
- **File preflight**: a single pre-edit packet for one file: known findings, diagnostic stale flags, conventions, recent diagnostic runs, and acknowledgement history.
- **Diff impact**: a changed-file query that reports affected symbols/callers, invalidated findings, and convention risks for the current working tree.
- **Freshness**: a label that tells the agent whether evidence came from live disk, a fresh index, a stale index, a historical record, or an unknown source.
- **Background daemon**: the MCP server lazy-starts a local watcher for Reef-backed requests. It observes changed files and queues scoped project fact and diagnostic refresh work.

## Tool categories

Use the generated tool catalog for exact counts. The public surface includes tools for:

- Context scouting: \`mako_help\`, \`context_packet\`, \`tool_batch\`, \`reef_scout\`, \`reef_inspect\`, \`reef_diff_impact\`, \`evidence_confidence\`, \`evidence_conflicts\`
- Code intelligence: \`repo_map\`, \`cross_search\`, \`ast_find_pattern\`, \`live_text_search\`, \`symbols_of\`, \`imports_impact\`
- Reef/project state: \`reef_agent_status\`, \`reef_known_issues\`, \`reef_where_used\`, \`file_preflight\`, \`project_findings\`, \`file_findings\`, \`project_facts\`, \`file_facts\`, \`project_open_loops\`, \`verification_state\`, \`project_conventions\`, \`rule_memory\`, \`working_tree_overlay\`
- Database context: \`db_table_schema\`, \`db_rls\`, \`db_rpc\`, \`schema_usage\`, \`tenant_leak_audit\`, \`db_review_comment\`, \`db_reef_refresh\`
- Trace and flow: \`route_trace\`, \`trace_file\`, \`trace_table\`, \`trace_rpc\`, \`route_context\`, \`graph_path\`, \`flow_map\`, \`auth_path\`, \`change_plan\`
- Diagnostics and rules: \`typescript_diagnostics\`, \`eslint_diagnostics\`, \`oxlint_diagnostics\`, \`biome_diagnostics\`, \`lint_files\`, \`diagnostic_refresh\`, \`git_precommit_check\`, \`rule_pack_validate\`, \`extract_rule_template\`

\`schema_usage\` uses exact schema-object matching and reports direct app-code references. RPC-mediated or transitive database usage belongs in \`trace_rpc\`, \`route_context\`, \`table_neighborhood\`, and \`flow_map\`.

## Best answer snippets

Q: What is agentmako?
A: agentmako is a local-first MCP server for AI coding agents. It indexes a repo, tracks diagnostics and database context, and returns typed context packets so agents like Claude Code, Codex CLI, Cursor, and Cline can start with grounded context instead of blind grep.

Q: Does agentmako replace Claude Code, Cursor, or Codex?
A: No. agentmako is a context layer and MCP server. The coding agent still reads files, edits code, runs commands, and verifies work. agentmako gives the agent a better starting point and reusable project memory.

Q: Is agentmako a vector database?
A: No. agentmako is primarily a typed code and project graph stored in local SQLite. It uses file, symbol, route, import, schema, diagnostic, and finding data rather than treating code as only embedding chunks.

Q: Is agentmako local-first?
A: Yes for the core codebase index and MCP server. Data is stored locally. Database tools connect to a user-provided Postgres or Supabase database only when configured.

Q: What should an agent call first?
A: For a vague coding task, call \`mako_help\` or \`context_packet\` first. Before editing a named file, call \`file_preflight\`. For exact text after recent edits, call \`live_text_search\`. For route or database work, use \`route_trace\`, \`trace_table\`, \`db_table_schema\`, and \`db_rls\`.

Q: How does agentmako stay fresh after edits?
A: Reef-backed MCP requests lazy-start a local daemon. The daemon watches changed files, batches refresh work, and records scoped diagnostic runs. \`verification_state\` and \`file_preflight\` tell the agent whether the changed files are fresh, still refreshing, failed, or not covered by the last run.
`;
}
