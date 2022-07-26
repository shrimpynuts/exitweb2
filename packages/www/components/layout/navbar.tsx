import Link from 'next/link'
import Emoji from '../util/emoji'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface IProps {
  displayConnectButton?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({ displayConnectButton = true }: IProps) => {
  return (
    <>
      <nav className="w-full px-4 pt-8 md:py-6 items-center">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/" passHref>
              <div className="ml-1 transform hover:rotate-20 transition duration-200">
                <Emoji className="text-4xl cursor-pointer " label="logo" symbol="🚪" />
              </div>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Exit Web2</h1>
          </div>
          {displayConnectButton && <ConnectButton />}
        </div>
      </nav>
    </>
  )
}

export default Navbar
