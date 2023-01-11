import React, { useState } from "react";
import styled from "@emotion/styled";
import client from "@cors.sh/service-api";
import { toast } from "react-hot-toast";

export function OnboardingCta() {
  const [isBusy, setIsBusy] = useState(false);
  const [email, setEmail] = useState("");

  const onsend = async () => {
    // validate email
    if (!validateEmail(email)) {
      toast.error(<p>Invalid Email</p>);
      return;
    }

    // send email
    setIsBusy(true);

    client
      .onboardingWithEmail({ email: email })
      .then((data) => {
        toast.success(
          <p>
            API Key sent to your email.
            <br />
            Please check your <b>spam folder</b> as well
          </p>
        );
      })
      .catch((e) => {
        toast.error(<p>Something went wrong</p>);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  return (
    <RootWrapperCta>
      <InputGroup>
        <RequestInputAsInput
          type="email"
          autoComplete="email"
          placeholder="alice@acme.com"
          value={email}
          disabled={isBusy}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onsend();
            }
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </InputGroup>
      <ButtonAsButton disabled={isBusy} onClick={onsend}>
        Send me an API Key
      </ButtonAsButton>
    </RootWrapperCta>
  );
}

const RootWrapperCta = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 14px;
  box-sizing: border-box;
  height: 64px;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.12);
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const RequestInputAsInput = styled.input`
  width: 400px;
  background-color: white;
  border-radius: 4px;
  padding: 12px 21px;
  box-sizing: border-box;
  border: none;
  color: black;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  line-height: 98%;
  text-align: start;
  align-self: stretch;
  flex-shrink: 0;
  flex: 1;
  outline: none;

  ::placeholder {
    color: rgb(181, 181, 181);
    font-size: 18px;
    font-family: "Helvetica Neue", sans-serif;
    font-weight: 400;
  }
`;

const ButtonAsButton = styled.button`
  padding: 0 24px;
  box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.12);
  background-color: black;
  border: solid 1px rgb(210, 210, 210);
  border-radius: 4px;
  color: white;
  font-size: 18px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 98%;
  outline: none;
  cursor: pointer;
  align-self: stretch;
  flex-shrink: 0;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    opacity: 1;
  }

  :focus {
  }
`;

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
