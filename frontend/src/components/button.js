import React from "react";
import styled from "styled-components";
import { ArrowBack } from "@styled-icons/boxicons-regular";
import classNames from "classnames";

const StyledButton = styled.button`
  height: 2rem;
  min-width: 10rem;

  font-size: 1.2rem;
  font-weight: bold;

  cursor: pointer;

  &.button--is-large {
    height: 3.5rem;
    font-size: 2rem;
    padding: 0 1rem;
  }

  &.primary-variant {
    color: white;
    background-color: #de7447;
    border: 2px solid #de7447;
    border-radius: 4px;

    &:hover {
      background-color: white;
      color: #de7447;
    }
  }

  &.quiet-variant {
    background-color: transparent;
    border: none;

    svg {
      margin-right: 1rem;
    }
  }
`;

export const Button = ({ onClick, children, variant = "primary", size }) => {
  return (
    <StyledButton
      className={classNames(`${variant}-variant`, {
        "button--is-large": size === "large",
      })}
      onClick={onClick}
    >
      {variant === "quiet" && <ArrowBack size={20} />}
      {children}
    </StyledButton>
  );
};
