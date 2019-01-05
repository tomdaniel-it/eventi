const Event = require("../models/event");
const Comment = require("../models/comment");
const essentialisizer = require('../util/essentialisizer');

function createComment(currentUser, eventId, content) {
    return new Promise((resolve, reject) => {
        let tmpEvent;
        let tmpComment;

        Event.Event.findById(eventId)
        .then(event => {
            if (!event) {
                return Promise.reject(new Error('This event does not exist.'));
            }
            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => group.getUsers())
        .then(users => {
            if (users.map(user => user.username).indexOf(currentUser.username) === -1) { // user !belongsTo group
                return Promise.reject(new Error ('You do not belong to this group.'));
            }
            return Comment.Comment.create({
                content
            });
        }).then((comment) => {
            tmpComment = comment;
            return Promise.all([tmpEvent.addComment(comment), comment.setCreator(currentUser)]); // add comment to event & add comment to creator
        })
        .then(() => essentialisizer.essentializyComment(tmpComment))
        .then(resolve)
        .catch(reject);
    });
}

function updateComment(currentUser, commentId, content) {
    return new Promise((resolve, reject) => {
        let tmpComment;
        
        Comment.Comment.findById(commentId)
        .then(comment => {
            if (!comment) return Promise.reject(new Error('This comment does not exist.'));
            tmpComment = comment;
            return comment.getCreator();
        })
        .then(user => {
            if (user.username !== currentUser.username) return Promise.reject(new Error('Only the owner of the comment can edit the comment.'));
            tmpComment.content = content;
            return tmpComment.save();
        })
        .then(() => essentialisizer.essentializyComment(tmpComment))
        .then(resolve)
        .catch(error => reject(error));
    });
}

function deleteComment(currentUser, commentId) {
    return new Promise((resolve, reject) => {
        let tmpComment;

        Comment.Comment.findById(commentId)
        .then(comment => {
            if (!comment) return Promise.reject(new Error('This comment does not exist.'));
            tmpComment = comment;
            return comment.getCreator();
        })
        .then(user => {
            if (user.username !== currentUser.username) return Promise.reject(new Error('Only the owner of the comment can delete the comment.'));
            return tmpComment.destroy();
        })
        .then(() => {
            resolve();
        })
        .catch(error => reject(error));
    });
}

function getAllComments(currentUser) {
    return new Promise((resolve, reject) => {
        currentUser.getComments()
        .then(comments => Promise.all(comments.map(el => essentialisizer.essentializyComment(el))))
        .then(resolve)
        .catch(reject);
    });
}

function getCommentsOfEvent(currentUser, eventId) {
    return new Promise((resolve, reject) => {
        let tmpEvent;

        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));

            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => group.getUsers())
        .then(users => {
            if (users.map(user => user.username).indexOf(currentUser.username) === -1) { // user !belongsTo group
                return Promise.reject(new Error ('You do not belong to this group.'));
            }
            return tmpEvent.getComments();
        })
        .then(comments => Promise.all(comments.map(el => essentialisizer.essentializyComment(el))))
        .then(resolve)
        .catch(reject);
    });
}

module.exports = { createComment, updateComment, deleteComment, getAllComments, getCommentsOfEvent };