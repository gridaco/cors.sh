import styled from "@emotion/styled";

export const FormPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  height: 100vh;

  h1 {
    text-align: center;
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
