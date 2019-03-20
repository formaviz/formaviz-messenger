const addMember = (datas) => {
    web.channels.invite({
        name: datas.name,
        token: datas.token
    }).then(channel => {
        logger.info("Member added");
        return omit(
            channel.get({
                plain: true
            }
            )
        )
    });

}


const inviteUser = (datas,param) => {
    let content = JSON.parse(datas.content.toString());
    if (content.datas == null || content.datas.name == null || param.legacyToken == null || param.datas.email == null) return new Answer('EVAL_FORMATION', 'ERROR', 'Failed to post a note');
    return web.chat.({
        name: content.datas.name,
        textNote: content.datas.textNote

    }).then((response) => {
        logger.info("Note posted");
        return new Answer('EVAL_FORMATION', 'SUCCESS', 'Note posted')
    })
    .catch((err) => {
        logger.info("Post note failed",err);
        return new Answer('Eval_FORMATION', 'ERROR', err);
    });
};

