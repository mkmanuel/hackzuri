require('dotenv').config();
const {v1: uuid} = require('uuid');
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

const socketToRoom = {};

const tablesInRoom = {};

const tableToUser = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 9) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
            tablesInRoom[roomID] = [uuid(), uuid(), uuid()] // tables are fixed at 3 and with a fixed id (1, 2, 3)
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
        socket.emit("all tables", usersInThisRoom);
    });

    socket.on("join table", (roomID, tableID) => {
        // remove user from old table => find all tables in room and see if they are sat anywhere.
        let oldTable = tablesInRoom[roomID].filter(table => !tableToUser[{roomID, table}].contains(socket.id));
        let oldUsers = tableToUser[{roomID, oldTable}].filter(id => id !== socket.id);
        tableToUser[{roomID, oldTable}] = oldUsers;

        if (tableToUser[{roomID, tableID}]) {
            const length = tableToUser[{roomID, tableID}].length;
            if (length === 3) {
                socket.emit("table full");
                return;
            }
            tableToUser[{roomID, tableID}].push(socket.id);
        } else {
            tableToUser[{roomID, tableID}] = [socket.id];
        }
        const usersOnThisTable = tableToUser[{roomID, tableID}].filter(id => id !== socket.id);

        socket.emit("table users", usersOnThisTable);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', {signal: payload.signal, callerID: payload.callerID});
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', {signal: payload.signal, id: socket.id});
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


