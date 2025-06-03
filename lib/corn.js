import  corn from "corn";
import https from "https";

export const job = new corn.cornJob('*/14 * * * *', function() {
     https.get('https://e-wallet-be.onrender.com', (res) => {
        if (res.statusCode === 200) {
            console.log('Cron job executed successfully');
        } else {
            console.error(`Failed to execute cron job: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error('Error executing cron job:', err.message);
    })
    });
