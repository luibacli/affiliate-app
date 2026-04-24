export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig()
  setHeader(event, 'content-type', 'text/plain')
  return [
    'User-agent: *',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Allow: /',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')
})
