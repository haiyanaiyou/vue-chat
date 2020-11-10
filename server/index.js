const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.get('/', function (req, res) {
    res.send('hello');
});

//在线用户
let onlineUsers = {};
//在线人数
let onlineCount = 0;
io.on('connection', function (socket) {
    socket.on('login', function (obj) {
        console.log(obj)
        socket.name = obj.userId;
        //筛选
        if (!onlineUsers.hasOwnProperty(obj.userId)) {
            onlineUsers[obj.userId] = obj.username;
            //在线人数+1
            ++onlineCount;
        }
        //登陆
        io.emit('login', {
            onlineUsers: onlineUsers,
            onlineCount: onlineCount,
            user: obj,
        });
        console.log(obj.username + '加入了聊天室');
        //退出
        socket.on('disconnect', function () {
            //退出的用户从在线列表中删除
            if (onlineUsers.hasOwnProperty(socket.name)) {
                //退出用户的信息
                var obj = { userId: socket.name, username: onlineUsers[socket.name] };
                //删除
                delete onlineUsers[socket.name];
                //在线人数-1
                onlineCount--;
                //向所有客户端广播用户退出
                io.emit('logout', {
                    onlineUsers: onlineUsers,
                    onlineCount: onlineCount,
                    user: obj,
                });
                console.log(obj.username + '退出了聊天室');
            }
        });
        //用户发布聊天内容
        socket.on('message', function (obj) {
            //向所有客户端广播发布的消息
            io.emit('message', obj);
            console.log(obj.username + '说：' + obj.content);
        });
    });
})


http.listen(3000, function () {
    console.log('server is running');
});
