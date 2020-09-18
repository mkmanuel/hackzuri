import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  color: blue;
`;

export const Button = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
