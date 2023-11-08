"use client";
import styled from "@emotion/styled";

export const FormPageLayout = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  max-width: 320px;
  min-height: 100vh;

  h1,
  p {
    text-align: center;
  }

  .description {
    margin-top: 16px;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 21px;
    width: 100%;
  }

  .form {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 21px;
    width: 100%;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    margin: 0 !important;
    padding: 4px !important;
    background: none;
    border: none;
    cursor: pointer;
    color: #ccc;

    &:hover {
      color: black;
    }
  }
`;
