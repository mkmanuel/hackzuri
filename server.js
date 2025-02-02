require("dotenv").config();
const { v4: uuid } = require("uuid");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

const socketToRoom = {};

const tablesInRoom = {};


// Rooms contain tables which themselves contain users. These get sent to frontend
const TableWithUsers = () => (
  {
      tableID: uuid(),
      users: [],
  }
);

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 9) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
      tablesInRoom[roomID] = [TableWithUsers(), TableWithUsers(), TableWithUsers()]; // tables are fixed at 3
    }
    socketToRoom[socket.id] = roomID;


    socket.emit("all tables",
      {
        tables: tablesInRoom[roomID],
        ownID: socket.id
      });
  });

  socket.on("join table", (roomID, newTable) => {
    console.log("newtableid" + newTable.tableID)

      // remove user from old table => find all tables in room and see if they are sat anywhere.
    let tablesInSpecificRooms = tablesInRoom[roomID];


    console.log(tablesInSpecificRooms);
    console.log(tablesInSpecificRooms.findIndex((table) => table.tableID === newTable.tableID))
      let oldTableIndex = tablesInSpecificRooms.findIndex((table) => table.users.includes(socket.id));
      let newTableIndex = tablesInSpecificRooms.findIndex((table) => table.tableID === newTable.tableID);

      console.log("oldTableIndex" + oldTableIndex);
      console.log("newTableIndex" + newTableIndex);
      console.log("tablesInSpecificRooms" + tablesInSpecificRooms)

    // remove user from table
    if (oldTableIndex > -1) {
        let filteredUsers = tablesInSpecificRooms[oldTableIndex].users.filter((user) => user !== socket.id);
        console.log("filtered users:" + filteredUsers);
        tablesInRoom[roomID][oldTableIndex].users = filteredUsers
    }

    if (newTableIndex > -1) {

        if (tablesInRoom[roomID][newTableIndex].users.length > 2) {
            socket.emit("table full");
            return;
        } else {
            tablesInRoom[roomID][newTableIndex].users.push(socket.id);
          console.log("tables in new config: " + tablesInRoom[roomID])
          socket.emit("all tables",
            {
              tables: tablesInRoom[roomID],
              ownID: socket.id
            }
          );

          return;
        }
    }
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
