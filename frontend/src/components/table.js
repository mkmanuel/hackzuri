import React from "react";
import styled from "styled-components";
import { PlusCircle } from "@styled-icons/boxicons-regular";

import coffeeTable from "../images/coffee-table.png";
import {StyledVideo, Video} from "./video";

const StyledBubbles = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  height: 40%;
  width: 100%;

  svg {
    cursor: pointer;
  }

  .bubbles__spot {
  }
`;

export const Table = ({
                          tableIndex,
                          onBubbleClick,
                          yourPosition,
                          userVideoRef,
                          peers,
                      }) => {
  return (
    <div className={`table table-${tableIndex + 1}`}>
      <img src={coffeeTable} />
      <StyledBubbles>
        {[...Array(3)].map((item, bubbleIndex) => (
          <div
            key={bubbleIndex}
            className="bubbles__spot"
            onClick={() => onBubbleClick(tableIndex, bubbleIndex)}
          >
            {yourPosition &&
            yourPosition.tableIndex === tableIndex &&
            yourPosition.bubbleIndex === bubbleIndex ? (
                <StyledVideo muted ref={userVideoRef} autoPlay playsInline>
                    Yourself
                </StyledVideo>
            ) : (
                <PlusCircle size={24}/>
            )}
          </div>
        ))}
          {peers.map((peer, index) => {
              console.log(index)
              return <Video key={index} peer={peer}/>;
          })}
      </StyledBubbles>
    </div>
  );
};
