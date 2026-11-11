import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function commoditiesApiPlugin() {
  return {
    name: 'commodities-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/commodities', async (_req: any, res: any) => {
        try {
          const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
          const [silverRes, oilRes, goldRes] = await Promise.allSettled([
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=5d', { headers }).then(r => r.json()),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/CL=F?interval=1d&range=5d', { headers }).then(r => r.json()),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=5d', { headers }).then(r => r.json()),
          ]);

          const results: Record<string, any> = {};

          if (silverRes.status === 'fulfilled' && silverRes.value?.chart?.result?.[0]?.meta) {
            const m = silverRes.value.chart.result[0].meta;
            results['XAGUSD'] = {
              price: m.regularMarketPrice,
              high: m.regularMarketDayHigh || m.fiftyTwoWeekHigh || m.regularMarketPrice,
              low: m.regularMarketDayLow || m.fiftyTwoWeekLow || m.regularMarketPrice,
              change: m.regularMarketChangePercent || 0,
            };
          }

          if (oilRes.status === 'fulfilled' && oilRes.value?.chart?.result?.[0]?.meta) {
            const m = oilRes.value.chart.result[0].meta;
            results['USOIL'] = {
              price: m.regularMarketPrice,
              high: m.regularMarketDayHigh || m.fiftyTwoWeekHigh || m.regularMarketPrice,
              low: m.regularMarketDayLow || m.fiftyTwoWeekLow || m.regularMarketPrice,
              change: m.regularMarketChangePercent || 0,
            };
          }

          if (goldRes.status === 'fulfilled' && goldRes.value?.chart?.result?.[0]?.meta) {
            const m = goldRes.value.chart.result[0].meta;
            results['XAUUSD'] = {
              price: m.regularMarketPrice,
              high: m.regularMarketDayHigh || m.fiftyTwoWeekHigh || m.regularMarketPrice,
              low: m.regularMarketDayLow || m.fiftyTwoWeekLow || m.regularMarketPrice,
              change: m.regularMarketChangePercent || 0,
            };
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || String(err) }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), commoditiesApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
