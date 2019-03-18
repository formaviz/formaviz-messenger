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