import styled from "styled-components";
import React from "react";
import { StyledVideo } from "./video";
import { Button } from "./button";

const StyledWaitingLobby = styled.div`
  background-color: #f2c9b7;

  grid-column: 3;
  grid-row: 3;

  .title {
    display: flex;
    justify-content: center;
  }
`;

export const WaitingLobby = ({
  userInWaitingLobby,
  userVideoRef,
  backToLobby,
}) => {
  return (
    <StyledWaitingLobby>
      <h2 className="title">Waiting lobby</h2>
      {!userInWaitingLobby && (
        <Button onClick={backToLobby}>Back to Lobby</Button>
      )}
      {userInWaitingLobby && (
        <StyledVideo muted ref={userVideoRef} autoPlay playsInline>
          Yourself
        </StyledVideo>
      )}
    </StyledWaitingLobby>
  );
};
