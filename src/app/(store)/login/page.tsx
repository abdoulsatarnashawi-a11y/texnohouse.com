import { CustomerAuthForm } from "@/components/store/CustomerAuthForm";

export const metadata = { title: "Вход" };

export default function LoginPage() {
  return <CustomerAuthForm mode="login" />;
}
