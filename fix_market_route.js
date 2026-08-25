const fs = require('fs');
let code = fs.readFileSync('app/api/agent/market-analyst/route.ts', 'utf8');

code = code.replace(
  `    return new NextResponse('Pipeline execution failed', { status: 500 });`,
  `    if (error instanceof Error && error.message === 'ANTHROPIC_API_KEY_MISSING') {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY_MISSING' }, { status: 500 });
    }
    return new NextResponse('Pipeline execution failed', { status: 500 });`
);

fs.writeFileSync('app/api/agent/market-analyst/route.ts', code);
