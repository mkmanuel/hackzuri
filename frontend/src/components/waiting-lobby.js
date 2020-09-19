import styled from "styled-components";
import React from "react";
import { StyledVideo } from "./video";
import { Button } from "./button";

const StyledWaitingLobby = styled.div`
  background-color: #f2c9b7;

  grid-column: 2;
  grid-row: 2;

  .title {
    display: flex;
    justify-content: center;
  }

  .back-to-lobby-section {
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
        <div className="back-to-lobby-section">
          <Button onClick={backToLobby}>Back to Lobby</Button>
        </div>
      )}
      {userInWaitingLobby && (
        <StyledVideo muted ref={userVideoRef} autoPlay playsInline>
          Yourself
        </StyledVideo>
      )}
    </StyledWaitingLobby>
  );
};
