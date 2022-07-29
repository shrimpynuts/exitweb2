import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { SiweMessage } from 'siwe'
import { generateUserToken } from '../../lib/server/auth'
import { ironOptions } from '../../lib/server/iron-session-config'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)

        if (fields.nonce !== req.session.nonce) return res.status(422).json({ message: 'Invalid nonce.' })

        console.log('Verified "Sign-In with Ethereum" from', fields.address)

        req.session.siwe = fields
        await req.session.save()

        const token = generateUserToken(fields.address)

        res.json({ ok: true, token })
      } catch (error) {
        console.log({ error })
        res.json({ ok: false })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withIronSessionApiRoute(handler, ironOptions)
