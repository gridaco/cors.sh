// send message to slack for telementry

import axios from "axios";
const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;

export const blocks = ({
  title,
  data,
}: {
  title: string;
  data: { [key: string]: any };
}) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*`,
      },
    },
    ...Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      if (value === undefined) {
        return acc;
      }

      const valuetext = pretty_value(value);
      const keytext = pretty_key(key);

      return [
        ...acc,
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${keytext}: ${valuetext}`,
          },
        },
      ];
    }, []),
  ];
};

const pretty_value = (value: any) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "object":
    default:
      return JSON.stringify(value);
  }
};

/**
 * pretty print the key string
 *
 * - replace `_` and `-` with ` `
 * - capitalize the first letter
 *
 * e.g.
 * - total_users_so_far -> Total users so far
 */
function pretty_key(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function slack({ blocks }: { blocks: Array<object> }) {
  return axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      blocks: blocks,
      // env Channel Id
      channel: channel,
    },
    {
      headers: {
        // env TOKEN
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
