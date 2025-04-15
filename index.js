const express = require('express');
const UAParser = require('ua-parser-js');
const requestIp = require('request-ip');

const app = express();
const PORT = 3782;

app.set('view engine', 'ejs');
app.set('views',"./Views");

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceInfo = result.device.model
    ? `${result.device.vendor || 'Unknown'} ${result.device.model} (${result.device.type || 'device'})`
    : 'Unknown Device';

  const ip = requestIp.getClientIp(req);
  console.log('Device - ', deviceInfo);
  console.log('Ip - ', ip);
  res.render('index', {
    device: deviceInfo,
    ip: ip
  });
});

app.listen(PORT, () => {
  console.log(`Server Running On http://localhost:${PORT}`);
});
