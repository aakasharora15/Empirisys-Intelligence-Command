import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Completely disable the login screen and instantly bounce the user to the dashboard
  redirect('/');
}
