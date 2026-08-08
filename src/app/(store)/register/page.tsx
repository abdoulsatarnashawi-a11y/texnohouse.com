import { CustomerAuthForm } from "@/components/store/CustomerAuthForm";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return <CustomerAuthForm mode="register" />;
}
