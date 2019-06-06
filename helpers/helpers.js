exports.addUser = (userList, newUser) => {
    const list = [...userList];
    const index = list.findIndex(user => user[0] === newUser[0]);
    if (index === -1) {
        list.push(newUser);
    } else {
        const socketId = newUser[1];
        list[index][1] = socketId;
    }
    return list;
};

exports.removeUser = (userList, username) => {
    const list = [...userList];
    const index = list.findIndex(user => user[0] === username);
    if (index !== -1) {
        list.splice(index, 1);
    }
    return list;
};

exports.getChatId = msg => JSON.parse(msg).chatId;
