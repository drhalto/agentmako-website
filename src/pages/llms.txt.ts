import { buildLlmsTxt } from '../lib/llmsContent';

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
