import { buildLlmsFullTxt } from '../lib/llmsContent';

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
