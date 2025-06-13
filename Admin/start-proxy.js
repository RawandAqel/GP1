// start-proxy.js
const corsAnywhere = require('cors-anywhere');

corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(8080, () => {
  console.log('CORS Anywhere proxy running on http://localhost:8080');
});
