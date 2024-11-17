
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/competition',
        permanent: true,
      },
    ]
  },
}