const ts = require('ts-node')
ts.register({
  fast:true,
  cacheDirectory:".tmp"
})
require('./tests')
