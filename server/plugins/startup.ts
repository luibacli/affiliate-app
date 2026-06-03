export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  const checks: { key: keyof typeof config; label: string }[] = [
    { key: 'mongoUri', label: 'MONGO_URI' },
    { key: 'adminKey', label: 'ADMIN_KEY' },
  ]

  const missing = checks.filter(({ key }) => !config[key])

  if (missing.length) {
    console.error(
      `\n[WinRose] ⚠️  STARTUP WARNING — missing required env vars:\n` +
      missing.map(({ label }) => `  • ${label}`).join('\n') +
      `\n  Set these in your .env file or deployment environment.\n`
    )
  } else {
    console.log('[WinRose] ✓ All required env vars present.')
  }

  if (!config.redisUrl) {
    console.warn('[WinRose] ⚠️  REDIS_URL not set — caching disabled, using fallback.')
  }
})
