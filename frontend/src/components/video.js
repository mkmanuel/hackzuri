import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

export const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};
