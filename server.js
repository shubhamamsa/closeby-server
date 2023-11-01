const dotenv = require('dotenv');
const express = require('express');
const UserRoutes = require('./routes/user_routes')
const FriendsRoutes = require('./routes/friends_routes')
const AuthRoutes = require('./routes/auth_routes')
const db = require('./db/database')

dotenv.config();

const PORT = process.env.PORT || 3000;

db._connect()

const app = express();
let authRouter = express.Router();
let userRouter = express.Router();
let friendsRouter = express.Router();

app.use(express.json());

app.use('/user', userRouter);
app.use('/friends', friendsRouter);
app.use('/auth', authRouter);

UserRoutes(userRouter);
FriendsRoutes(friendsRouter);
AuthRoutes(authRouter);

app.listen(PORT, (req, res) => {
    console.log(`Server is listening on port ${PORT}`);
})