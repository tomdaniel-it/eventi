const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

// Defines user model & links it to database
const User = connection.define('users', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    birthday: Sequelize.DATE,
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    password: Sequelize.STRING
});

function defineModels(items) {
    models = items;
    User.belongsToMany(models.Group.Group, { through: 'UserGroup' }); // Defines many to many relationship with table in between (also in Group model)
    User.hasMany(models.Group.Group, { as: 'CreatedGroups', constraints: false, foreignKey: 'creator_username' }); // ex: user.getCreatedGroups()
    User.belongsToMany(models.PollDate.PollDate, { through: 'UserPollDate' });
    User.belongsToMany(models.Group.Group, { through: 'UserBans', as: 'BannedGroups' });
    User.hasMany(models.Event.Event, { as: 'Events', constraints: false, foreignKey: 'creator_username' });
    User.hasMany(models.Comment.Comment, {
        as: 'Comments',
        constraints: false,
        foreignKey: 'comment_creator'
    });
    User.belongsToMany(models.Event.Event, { as: 'EventAttendances', through: models.Attendance.Attendance });
}

module.exports = { User, defineModels }