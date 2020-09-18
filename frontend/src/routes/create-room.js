import React from "react";
import { v1 as uuid } from "uuid";
import { Button } from "../components";

export const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return <Button onClick={create}>Create room</Button>;
};
