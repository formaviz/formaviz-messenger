function postNote(datas) {
    web.chat.postMessage({

        name: datas.name,
        token: datas.token

    });
    console.log('Message posted !');

}

export { createChannel, addMember };