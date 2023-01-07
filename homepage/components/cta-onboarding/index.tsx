import React, { useState } from "react";
import styled from "@emotion/styled";
import client from "@cors.sh/service-api";
import { toast } from "react-toastify";

function WarningIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_31_2300)">
        <path
          d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_31_2300">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function OnboardingCta() {
  const [email, setEmail] = useState("");

  const onsend = async () => {
    // validate email
    if (!validateEmail(email)) {
      toast.error(<p>Invalid Email</p>);
      return;
    }

    try {
      const data = await client.onboardingWithEmail({ email: email });
      toast.success(
        <p>API Key sent to {data?.email}. (Check your span folder as well)</p>
      );
    } catch (e) {
      toast.error(<p>Something went wrong</p>);
      return;
    }
  };

  return (
    <RootWrapperCta>
      <InputGroup>
        <RequestInputAsInput
          type="email"
          autoComplete="email"
          placeholder="alice@acme.com"
          value={email}
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
      <ButtonAsButton onClick={onsend}>Send me an API Key</ButtonAsButton>
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
