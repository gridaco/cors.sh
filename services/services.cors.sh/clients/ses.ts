import * as AWS from "@aws-sdk/client-ses";

const SENDER_EMAIL = "no-reply@cors.sh";
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

export function emailWithTemplate(to: string, template: string, data: object) {
  return ses.sendTemplatedEmail({
    Destination: {
      ToAddresses: [to],
    },
    Source: SENDER_EMAIL,
    Template: template,
    TemplateData: JSON.stringify(data),
  });
}

export async function email(
  to: string,
  content: EmailContent
): Promise<boolean> {
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
