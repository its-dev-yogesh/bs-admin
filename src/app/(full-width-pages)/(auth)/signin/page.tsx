import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | BS-Admin",
  description: "Sign in to the Broker-Social admin panel",
};

export default function SignIn() {
  return <SignInForm />;
}
