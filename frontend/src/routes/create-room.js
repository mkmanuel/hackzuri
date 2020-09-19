import React from "react";
import { v1 as uuid } from "uuid";
import styled from "styled-components";
import { Coffee } from "@styled-icons/boxicons-regular";
import { ChatBubbleOutline } from "@styled-icons/material";

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
      <h1>
        BubbleCoffee <Coffee size={32} /> <ChatBubbleOutline size={32} />
      </h1>
      <Button onClick={create} size="large">
        Create room
      </Button>
    </OverviewContainer>
  );
};
