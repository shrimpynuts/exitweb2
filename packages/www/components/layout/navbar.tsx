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
      <nav className="w-full p-4 items-center border-b border-gray-300">
        <div className="max-w-screen-xl m-auto flex justify-between">
          {/* Logo */}
          <Link href="/" passHref>
            <a className="flex items-center space-x-2">
              <a className="ml-1 transform hover:rotate-20 transition duration-200 flex items-center space-x-2">
                <Emoji className="text-4xl cursor-pointer " label="logo" symbol="🚪" />
              </a>
              <h1 className="text-xl font-bold tracking-tight">Exit Web2</h1>
            </a>
          </Link>
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
