function createChannel(datas) {

    // const res = web.auth.test()
    web.channels.create({
        name: datas.name,
        token: datas.token
    });

    console.log('Message posted!');
};

function addMember(datas) {
    web.channels.invite({
        name: datas.name,
        token: datas.token
    });
    console.log('Member added !');
}

export { createChannel, addMember };