export default function handler(req, res) {
  const { title, desc, img, slug } = req.query

  const plantTitle = title ? decodeURIComponent(String(title)) : 'TOGA Pedia Desa'
  const plantDesc = desc
    ? decodeURIComponent(String(desc))
    : 'Platform edukasi kesehatan herbal desa untuk mengenal khasiat medis, takaran konsumsi aman, dan panduan budidaya tanaman obat keluarga.'
  const plantImg = img
    ? decodeURIComponent(String(img))
    : 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80'
  const targetSlug = slug ? decodeURIComponent(String(slug)) : ''
  const redirectUrl = targetSlug ? `/tanaman/${encodeURIComponent(targetSlug)}` : '/'

  const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>${plantTitle} | TOGA Pedia Desa</title>
    <meta name="title" content="${plantTitle} | TOGA Pedia Desa" />
    <meta name="description" content="${plantDesc}" />

    <!-- Open Graph / WhatsApp / Telegram Preview -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="TOGA Pedia Desa" />
    <meta property="og:title" content="${plantTitle}" />
    <meta property="og:description" content="${plantDesc}" />
    <meta property="og:image" content="${plantImg}" />

    <!-- Twitter Card Preview -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${plantTitle}" />
    <meta name="twitter:description" content="${plantDesc}" />
    <meta name="twitter:image" content="${plantImg}" />

    <!-- Instant Client Redirect -->
    <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
  </head>
  <body>
    <p>Mengarahkan ke ${plantTitle}...</p>
    <script>window.location.href = "${redirectUrl}";</script>
  </body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(html)
}
