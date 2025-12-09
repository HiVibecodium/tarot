/**
 * Vercel Serverless Function - VAPID Public Key
 */
module.exports = (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY || null;

  if (!publicKey) {
    return res.status(503).json({
      success: false,
      message: 'Push notifications not configured'
    });
  }

  res.json({
    success: true,
    data: { publicKey }
  });
};
