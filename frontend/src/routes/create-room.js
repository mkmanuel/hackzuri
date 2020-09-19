import React from "react";
import { v1 as uuid } from "uuid";
import styled from "styled-components";
import { Button } from "../components";

const OverviewContainer = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    margin-bottom: 5rem;
    font-size: 4rem;
  }
`;

export const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <OverviewContainer>
      <h1>BubbleCoffee</h1>
      <Button onClick={create}>Create room</Button>
    </OverviewContainer>
  );
};
