const fs = require('fs');
let code = fs.readFileSync('app/marketing/market-analyst/page.tsx', 'utf8');

code = code.replace(
  `    } catch (e) {`,
  `    } catch (e: any) {
      if (e.message?.includes('ANTHROPIC_API_KEY_MISSING') || (e.response && e.response.status === 500)) {
        alert("Anthropic API Key is missing. The engine cannot run the real-time pipeline. Please set ANTHROPIC_API_KEY in your Vercel environment variables.");
      }`
);

fs.writeFileSync('app/marketing/market-analyst/page.tsx', code);
