let FriendsController = require('../controller/friends_controller')
let AuthController = require('../controller/auth_controller')

module.exports = function(router) {
    router.post('/add', AuthController.authenticateUser, FriendsController.addFriend);
    router.get('/location', AuthController.authenticateUser, FriendsController.getLocation);
}