import React from "react";
import styled from "styled-components";
import { ArrowBack } from "@styled-icons/boxicons-regular";

const StyledButton = styled.button`
  height: 2rem;
  min-width: 10rem;

  font-size: 1.2rem;
  font-weight: bold;

  cursor: pointer;

  &.primary {
    color: white;
    background-color: #de7447;
    border: 2px solid #de7447;
    border-radius: 4px;
  }

  &.quiet {
    background-color: transparent;
    border: none;

    svg {
      margin-right: 1rem;
    }
  }
`;

export const Button = ({ onClick, children, variant = "primary" }) => {
  return (
    <StyledButton className={variant} onClick={onClick}>
      {variant === "quiet" && <ArrowBack size={20} />}
      {children}
    </StyledButton>
  );
};
