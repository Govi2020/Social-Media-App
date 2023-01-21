const io = require("socket.io")(process.env.PORT || 8080, {
    cors: {
        origin: "*",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ socketId, userId });
    console.log(users)
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

// when connect
io.on("connection", (socket) => {
    console.log("user has connected");
    console.log(users)
    //* take user Id and socket Id from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log("going to do get users",users)
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log("user:", user);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
            createdAt: Date.now(),
        });
    });

    // when disconnect
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
