require('dotenv').config();
const express = require('express');
const UAParser = require('ua-parser-js');
const requestIp = require('request-ip');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3782;

app.set('view engine', 'ejs');
app.set('views', 'Views');

app.get('/', async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceInfo = result.device.model
    ? `${result.device.vendor || 'Unknown'} ${result.device.model} (${result.device.type || 'device'})`
    : 'Unknown Device';

  const ip = requestIp.getClientIp(req);

  const message = `👀 New Visitor!\nDevice: ${deviceInfo}\nIP: ${ip}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id:  process.env.TELEGRAM_CHAT_ID,
      text: message
    });
  } catch (error) {
    console.error('Failed To Send Telegram Notification:', error.response ? error.response.data : error.message);
  }

  res.render('index', { device: deviceInfo, ip: ip });
});

app.listen(PORT, () => {
  console.log(`Server Running On http://localhost:${PORT}`);
});
