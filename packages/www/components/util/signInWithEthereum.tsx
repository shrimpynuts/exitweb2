import * as React from 'react'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { storeUserToken } from '../../lib/client/auth'
import Button from './button'
import toast from 'react-hot-toast'

interface IProps {
  onSuccess: (args: { address: string }) => void
  onError: (args: { error: Error }) => void
}

export default function SignInButton({ onSuccess, onError }: IProps) {
  const [state, setState] = React.useState<{ loading?: boolean; nonce?: string }>({})

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
      setState((x) => ({ ...x, nonce }))
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }))
    }
  }

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce()
  }, [])

  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  const signIn = async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) throw new Error('not connected to a wallet')

      setState((x) => ({ ...x, loading: true }))
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to ExitWeb2.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      const { token } = await verifyRes.json()
      storeUserToken(token)

      setState((x) => ({ ...x, loading: false }))
      onSuccess({ address })
    } catch (error: any) {
      toast.error(`Couldn't sign in, ${error.message}`)
      setState((x) => ({ ...x, loading: false, nonce: undefined }))
      onError({ error: error as Error })
      fetchNonce()
    }
  }

  return (
    <Button disabled={!state.nonce || state.loading} onClick={signIn}>
      Sign-In with Ethereum
    </Button>
  )
}
