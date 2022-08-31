import React, { useState } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import Axios, { Method } from "axios";
import { toast } from "react-toastify";

type TMethod = "GET" | "POST" | "PUT" | "DELETE";

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

const options: { value: TMethod; label: string }[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

const style = {
  control: (base: any) => ({
    ...base,
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
  }),
};

export function TestitCta() {
  const [url, setUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState({
    value: "GET",
    label: "GET",
  });

  const onsend = () => {
    Axios.request({
      method: selectedOption.value as Method,
      url: "https://proxy.cors.sh/" + url,
    })
      .then(() => {
        toast(
          <>
            Request {selectedOption.value} to {url} succeeded.
            <br />
            use{" "}
            <a
              href="/playground"
              style={{
                fontWeight: "bold",
                color: "blue",
              }}
            >
              playground
            </a>{" "}
            for more details
          </>
        );
      })
      .catch((e) => {
        toast(
          <>
            Request {selectedOption.value} to {url}{" "}
            <i
              style={{
                color: "red",
              }}
            >
              failed with {e.response.status}
            </i>
          </>,
          {
            icon: <WarningIcon />,
          }
        );
      });
  };

  return (
    <RootWrapperCta>
      <InputGroup>
        <MethodSelect>
          <Select
            styles={style}
            defaultValue={selectedOption}
            // @ts-ignore
            onChange={setSelectedOption}
            options={options}
          />
          {/* <Type>
              <Label>GET</Label>
            </Type>
            <Menu>
              <Line />
              <IconsMdiArrowDropDown src="grida://assets-reservation/images/31:2296" />
            </Menu> */}
        </MethodSelect>
        <RequestInputAsInput
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
      </InputGroup>
      <ButtonAsButton onClick={onsend}>Send</ButtonAsButton>
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

const MethodSelect = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-right: solid 1px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 4px;
  align-self: stretch;
  width: 123px;
  background-color: white;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const RequestInputAsInput = styled.input`
  width: 536px;
  background-color: white;
  border-top-left-radius: 0px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 0px;
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
  width: 151px;
  box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.12);
  background-color: black;
  border: solid 1px rgb(210, 210, 210);
  border-radius: 4px;
  color: white;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
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
