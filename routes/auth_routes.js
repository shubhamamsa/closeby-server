let AuthController = require('../controller/auth_controller')

module.exports = function(router) {
    router.post('/token', AuthController.getAccessToken);
}