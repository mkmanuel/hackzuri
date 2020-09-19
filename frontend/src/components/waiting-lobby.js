import styled from "styled-components";
import React from "react";

const StyledWaitingLobby = styled.div`
  background-color: #f2c9b7;

  grid-column: 3;
  grid-row: 3;

  .title {
    display: flex;
    justify-content: center;
  }
`;

export const WaitingLobby = () => {
  return (
    <StyledWaitingLobby>
      <h2 className="title">Waiting lobby</h2>
    </StyledWaitingLobby>
  );
};
