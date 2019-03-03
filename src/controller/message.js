//const { WebClient } = require('@slack/client');

//console.log('Getting started with Slack Developer Kit for Node.js');

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);
// The current date
const currentTime = new Date().toTimeString();

(async () => {
    // Use the `auth.test` method to find information about the installing user
    const res = await web.auth.test()

    const userId = res.user_id

    await web.chat.postMessage({
        channel: userId,
        text: `The current time is ${currentTime}`,
    });

    console.log('Message posted!');
})();