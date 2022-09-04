import { StepLayout } from "../../layouts/step-layout";

// page redirected from stripe once the payment is successful
export default function PaymentSuccessPage({ session }: { session: string }) {
  return (
    <StepLayout
      title={"Thank you for your subscription"}
      description={
        <>
          You can have unlimited hourly rate limit to proxy.cors.sh. Plus, you
          can create as many projects as you want for your personal websites,
          developing sites, portfolio sites and so on.{" "}
          <b>
            Let’s get started by creating your first project to get your api
            key.
          </b>
        </>
      }
      nextPromptLabel={"Okay. Create my first project"}
      onNextClick={function (): void {
        throw new Error("Function not implemented.");
      }}
    >
      <section>
        <h4>In next steps,</h4>
        <ol>
          <li>Create your first project</li>
          <li>Get your api key</li>
          <li>Modify your existing requests with ‘proxy.cors.sh’</li>
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
      <section>
        <h4>When going production, </h4>
        <ol>
          <li>
            When you are ready to publish website, add trusted origins (your
            website address)
          </li>
          <li>
            Replace api key with live key starting starting with `live_xxx`..
          </li>
          <li>
            Set your project’s mode to production to disable localhost requests.
          </li>
          <li>
            (Optional) Upgrade your subscription to pay-as-you-go to prevent
            blocked requests while in production.
          </li>
        </ol>
      </section>
      <div>session id: {session}</div>
    </StepLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { session_id } = context.query;
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
    props: { session: session_id || null },
  };
}
