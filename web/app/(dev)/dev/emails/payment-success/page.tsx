import { PaymentSuccessEmailTemplate } from "@/components/emails/payment-success";

export default function PaymentSuccessEmailDevPage() {
  return <PaymentSuccessEmailTemplate applicationName={"App"} codeTest={"test_xxxx"} codeLive={"live_xxxx"} />
}