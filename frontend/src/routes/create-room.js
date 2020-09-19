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
`;

export const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <OverviewContainer>
      <Button onClick={create}>Create room</Button>
    </OverviewContainer>
  );
};
