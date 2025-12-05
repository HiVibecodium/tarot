/**
 * Simple debug endpoint for Vercel
 */
module.exports = (req, res) => {
  const debug = {
    success: true,
    message: 'Debug endpoint works',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      USE_TURSO: process.env.USE_TURSO,
      HAS_TURSO_URL: !!process.env.TURSO_DATABASE_URL,
      HAS_TURSO_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      VERCEL: process.env.VERCEL
    },
    cwd: process.cwd(),
    dirname: __dirname
  };

  res.status(200).json(debug);
};
