import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { StepLayout } from "../../layouts/step-layout";

// page redirected from stripe once the payment is successful
export default function PaymentSuccessPage({ session }: { session: string }) {
  const router = useRouter();
  return (
    <StepLayout
      title={"Thank you for your subscription"}
      description={
        <>
          You can have unlimited hourly rate limit to proxy.cors.sh. Plus, you
          can create as many projects as you want for your personal websites,
          developing sites, portfolio sites and so on.
          <br />
          <b>
            Let’s get started by creating your first project to get your api
            key.
          </b>
        </>
      }
      nextPromptLabel={"Okay. Create my first project"}
      onNextClick={() => {
        router.push("/console/new");
      }}
    >
      <section>
        <h4>In next steps,</h4>
        <ol>
          <LI>Create your first project</LI>
          <LI>Get your api key</LI>
          <LI>Modify your existing requests with ‘proxy.cors.sh’</LI>
        </ol>
        <pre
          style={{
            padding: 20,
            backgroundColor: "black",
            color: "white",
          }}
        >
          GET https://proxy.corsh.sh/ https://instragram.com/posts/123 -h
          api-key test_xxxxx-xxxx-xxxx
        </pre>
      </section>
      <div style={{ height: 40 }} />
      <section>
        <h4>When going production, </h4>
        <ol>
          <LI>
            When you are ready to publish website, add trusted origins (your
            website address)
          </LI>
          <LI>
            Replace api key with live key starting starting with `live_xxx`..
          </LI>
          <LI>
            Set your project’s mode to production to disable localhost requests.
          </LI>
          <LI>
            (Optional) Upgrade your subscription to pay-as-you-go to prevent
            blocked requests while in production.
          </LI>
        </ol>
      </section>
      {process.env.NODE_ENV === "development" && (
        <div>session id: {session}</div>
      )}
    </StepLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { session_id, onboarding_id } = context.query;
  if (!session_id) {
    // invalid entry
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session_id || null,
      onboarding_id,
    },
  };
}

const LI = styled.li`
  color: rgba(0, 0, 0, 0.7);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;
