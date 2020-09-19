import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button, Table, Video } from "../components";
import { WaitingLobby } from "../components/waiting-lobby";

const PageContainer = styled.div`
  margin: 5rem 1rem;

  @media only screen and (min-width: 768px) {
    margin-left: 4rem;
    margin-right: 4rem;
  }
`;

const RoomContainer = styled.div`
  box-shadow: 0 1px 2px #ccc;

  min-height: 20rem;

  display: grid;
  grid-template-columns: 3fr 3fr;
  grid-gap: 1rem;
  grid-auto-rows: 3fr 3fr;

  > div {
    height: 100%;
  }

  .table {
    background-color: #b7e0f2;

    align-self: center;
    justify-self: center;
    width: 100%;
    min-height: 15rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 10rem;
    }
  }

  .table-1 {
    grid-column: 1;
    grid-row: 1;
  }

  .table-2 {
    grid-column: 2;
    grid-row: 1;
  }

  .table-3 {
    grid-column: 1;
    grid-row: 2;
  }
`;

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const [tables, setTables] = useState([]);
  const [tablePeers, setTablePeers] = useState([]); // these need to be louder than all the others

  // undefined means the user is currently in waiting lobby.
  // When a table is selected it should contain an object of table and bubble indexes.
  const [yourPosition, setYourPosition] = useState(undefined);

  const socketRef = useRef();
  const userVideoRef = useRef();
  const peersRef = useRef([]);
  const tablePeersRef = useRef([]);
  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);

        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("table users", (users) => {
          console.log(users);
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            tablePeersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setTablePeers(peers);
        });

        socketRef.current.on("all tables", (tables) => {
          setTables(tables);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const onBubbleClick = (tableIndex, bubbleIndex) => {
    let uuid = tables[tableIndex];
    socketRef.current.emit("join table", roomID, uuid);
    setYourPosition({ tableIndex, bubbleIndex });
  };

  const goBackToLobby = () => {
    socketRef.current.emit("join table", roomID, 0);
    setYourPosition(undefined);
  };

  return (
    <PageContainer>
      <Button onClick={() => props.history.push(`/`)} variant="quiet">
        Back to overview
      </Button>
      <h1>Your room</h1>
      <RoomContainer>
        {tables.map((tableUUID, index) => (
          <Table
            key={index}
            yourPosition={yourPosition}
            tableIndex={index}
            onBubbleClick={onBubbleClick}
            userVideoRef={userVideoRef}
          />
        ))}
        <WaitingLobby
          userInWaitingLobby={!yourPosition}
          userVideoRef={userVideoRef}
          backToLobby={goBackToLobby}
        />
      </RoomContainer>

      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </PageContainer>
  );
};
