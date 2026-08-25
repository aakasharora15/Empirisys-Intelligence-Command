const fs = require('fs');
let code = fs.readFileSync('app/marketing/market-analyst/page.tsx', 'utf8');

code = code.replace(
  `      const data = await response.json();`,
  `      if (response.status === 500) {
        const errData = await response.json().catch(() => null);
        if (errData?.error === 'ANTHROPIC_API_KEY_MISSING') {
          alert("Anthropic API Key is missing. The engine cannot run the real-time pipeline. Please set ANTHROPIC_API_KEY in your Vercel environment variables.");
          return;
        }
      }
      const data = await response.json();`
);

fs.writeFileSync('app/marketing/market-analyst/page.tsx', code);
