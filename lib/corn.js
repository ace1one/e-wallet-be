// lib/cron.js
import cron from 'node-cron';
import https from 'https';

const job = cron.schedule('*/14 * * * *', function () {
  https.get('https://e-wallet-be.onrender.com', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Cron job executed successfully');
    } else {
      console.error(`❌ Cron job failed: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('❌ Cron job error:', err.message);
  });
});


export default job;
