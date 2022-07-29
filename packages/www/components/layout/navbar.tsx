import Link from 'next/link'
import Emoji from '../util/emoji'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from '../util/button'

interface IProps {
  displayConnectButton?: boolean
  children?: React.ReactNode
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({ displayConnectButton = true, children }: IProps) => {
  return (
    <>
      <nav className="w-full px-4 pt-8 py-4 items-center border-b border-gray-300">
        <div className="max-w-screen-xl m-auto flex justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/" passHref>
              <a className="ml-1 transform hover:rotate-20 transition duration-200">
                <Emoji className="text-4xl cursor-pointer " label="logo" symbol="🚪" />
              </a>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Exit Web2</h1>
          </div>
          <div className="flex flex-row items-center space-x-4">
            {children}
            {displayConnectButton && <ConnectButton />}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
