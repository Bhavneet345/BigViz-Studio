import SignInForm from '../../../../components/sign-in-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | BigViz Studio',
  description: 'Sign in to your BigViz Studio account',
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <SignInForm />
    </div>
  )
}

