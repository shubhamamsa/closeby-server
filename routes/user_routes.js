let UserController = require('../controller/user_controller')
let AuthStateController = require('../controller/auth_controller')
const AuthController = require("../controller/auth_controller");

module.exports = function(router) {
    router.post('/register', UserController.register, AuthStateController.getAuthorizationCode);
    router.get('/login', AuthController.getAuthorizationCode);
    router.get('/info', AuthStateController.authenticateUser, UserController.info);
    router.post('/location', AuthStateController.authenticateUser, UserController.updateLocation);
}