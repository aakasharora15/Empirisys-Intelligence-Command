const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  const jwt = require('jose');
  const token = await new jwt.SignJWT({}).setProtectedHeader({alg: 'HS256'}).sign(new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development-do-not-use-in-prod'));
  await page.setCookie({name: 'eih_auth', value: token, domain: 'localhost'});
  await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
