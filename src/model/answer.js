module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define(
        'Answer',
        {

            action: {
                type: DataTypes.STRING,
                comment: 'the action that should hae been executed',
                set(val) {
                    this.setDataValue(
                        'action',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            state: {
                type: DataTypes.STRING,
                comment: 'the action state',
                set(val) {
                    this.setDataValue(
                        'state',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            message: {
                type: DataTypes.STRING,
                comment: 'the return message',
                set(val) {
                    this.setDataValue(
                        'message',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }

            },
        },
    );
    paranoid: true;

    return Answer;
};