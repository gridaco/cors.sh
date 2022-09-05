import * as AWS from "@aws-sdk/client-ses";

const SENDER_EMAIL = "hello@grida.co";
const ses = new AWS.SES({});

interface EmailBody_Raw {
  subject: string;
  text: string;
}

interface EmailBody_Html {
  subject: string;
  html: string;
}

type EmailContent = EmailBody_Raw | EmailBody_Html;

export async function sendEmail(
  to: string,
  options: {
    template?: {
      templateId: string;
      data: {};
    };
    content?: EmailContent;
  }
): Promise<boolean> {
  if (options.template && options.template) {
    throw "provide only one option between template and rawContent";
  }

  let content: EmailContent;
  if (options.content) {
    content = options.content;
  } else if (options.template) {
    throw "using template is not supported yet.";
  }

  try {
    const sendResp = await ses.sendEmail({
      Destination: {
        ToAddresses: [to],
      },
      Source: SENDER_EMAIL,
      Message: {
        Subject: {
          Data: content.subject,
        },
        Body:
          "text" in content
            ? {
                Text: {
                  Data: content.text,
                },
              }
            : {
                Html: {
                  Data: content.html,
                },
              },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("failed while sending email");
  }
  return true;
}
