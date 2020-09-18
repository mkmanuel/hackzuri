import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { StyledVideo, Video } from "../components";
import coffeeTable from "../images/coffee-table.png";

const PageContainer = styled.div`
  margin: 0.5rem 1rem;

  @media only screen and (min-width: 768px) {
    margin-left: 4rem;
    margin-right: 4rem;
  }
`;

const RoomContainer = styled.div`
  border: 1px solid black;
  min-height: 20rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(200px, auto);

  .table {
    align-self: center;
    justify-self: center;

    img {
      width: 10rem;
    }
  }

  .table-1 {
    grid-column: 1;
    grid-row: 1;
  }

  .table-2 {
    grid-column: 3;
    grid-row: 2;
  }

  .table-3 {
    grid-column: 1;
    grid-row: 3;
  }
`;

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
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

  return (
    <PageContainer>
      <h1>Your room</h1>
      <RoomContainer>
        <div className="table table-1">
          <img src={coffeeTable} />
        </div>
        <div className="table table-2">
          <img src={coffeeTable} />
        </div>
        <div className="table table-3">
          <img src={coffeeTable} />
        </div>
      </RoomContainer>

      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </PageContainer>
  );
};
