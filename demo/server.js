import polka from 'polka';
import sirv from 'sirv';
import path from 'path';
import fs from 'fs';

const { PORT = 3001 } = process.env;

polka()
  .use(
    sirv(path.resolve(__dirname, '..'), {
      dev: true,
      setHeaders: (res) => {
        const baseUrl = `http://localhost:${PORT}`;
        return res
          .setHeader('AMP-Access-Control-Allow-Source-Origin', `http://localhost:${PORT}`)
          .setHeader(
            'Report-To',
            `{ group: "coep_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coep_report" }] }, { group: "coop_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coop_report" }] }`,
          )
          .setHeader('Cross-Origin-Embedder-Policy', 'require-corp; report-to="coep_report"')
          .setHeader('Cross-Origin-Opener-Policy', 'same-origin; report-to="coop_report"');
      },
    }),
  )
  .use(
    sirv(path.resolve(__dirname), {
      dev: true,
      setHeaders: (res) => {
        const baseUrl = `http://localhost:${PORT}`;
        return res
          .setHeader('AMP-Access-Control-Allow-Source-Origin', `http://localhost:${PORT}`)
          .setHeader(
            'Report-To',
            `{ group: "coep_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coep_report" }] }, { group: "coop_report", max_age: 86400, endpoints: [{ url: "${baseUrl}/___coop_report" }] }`,
          )
          .setHeader('Cross-Origin-Embedder-Policy', 'require-corp; report-to="coep_report"')
          .setHeader('Cross-Origin-Opener-Policy', 'same-origin; report-to="coop_report"');
      },
    }),
  )
  .get('/health', (req, res) => {
    res.end('OK');
  })
  .get('/slow/*', (req, res) => {
    const reqPath = req.path.substring('/slow/'.length);
    const file = fs.readFileSync(path.resolve(__dirname, reqPath));
    setTimeout(() => res.end(file), 6000);
  })
  .listen(PORT, (_) => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
