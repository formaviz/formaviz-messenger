//const { WebClient } = require('@slack/client');
/*
const web = new WebClient(process.env.SLACK_TOKEN);
const currentTime = new Date().toTimeString();

(async () => {

    const res = await web.auth.test()

    const userId = res.user_id

    await web.chat.postMessage({
        channel: userId,
        text: `The current time is ${currentTime}`,
    });

    console.log('Message posted!');
})();
*/

function postNote(datas) {
    web.chat.postMessage({

        name: datas.name,
        token: datas.token

    });
    console.log('Message posted !');

}

export { createChannel, addMember };
