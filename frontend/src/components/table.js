import React from "react";
import styled from "styled-components";
import { PlusCircle } from "@styled-icons/boxicons-regular";

import coffeeTable from "../images/coffee-table.png";

const StyledBubbles = styled.div`
  display: flex;
  justify-content: space-around;

  width: 100%;

  svg {
    cursor: pointer;
  }
`;

export const Table = ({ index }) => {
  return (
    <div className={`table table-${index}`}>
      <img src={coffeeTable} />
      <StyledBubbles>
        {[...Array(3)].map(() => (
          <div className="bubbles__spot">
            <PlusCircle size={24} />
          </div>
        ))}
      </StyledBubbles>
    </div>
  );
};
