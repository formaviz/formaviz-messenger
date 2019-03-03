// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);
const channelName = new String('nomChannelBACK');

(async () => {
    // Use the `auth.test` method to find information about the installing user
    const res = await web.auth.test()
    await web.channels.create({
        name: channelName,
    });

    console.log('Message posted!');
})();