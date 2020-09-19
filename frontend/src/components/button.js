import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  height: 2rem;
  min-width: 10rem;

  font-size: 1.2rem;
  font-weight: bold;

  color: white;
  background-color: #de7447;
  border: 2px solid #de7447;
  border-radius: 4px;
`;

export const Button = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
