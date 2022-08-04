import Link from 'next/link'
import Emoji from '../util/emoji'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import classNames from 'classnames'

interface IProps {
  displayConnectButton?: boolean
  children?: React.ReactNode
  border?: boolean
  white?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({ displayConnectButton = true, children, border = false, white = false }: IProps) => {
  return (
    <>
      <nav
        className={classNames('w-full p-4 items-center border-gray-300', {
          'border-b': border,
          'bg-white': white,
        })}
      >
        <div className="max-w-screen-xl m-auto flex justify-between">
          {/* Logo */}
          <Link href="/" passHref>
            <a className="flex items-center space-x-1">
              <span className="ml-1 transform hover:rotate-20 transition duration-200">
                <Emoji className="text-2xl cursor-pointer " label="logo" symbol="🚪" />
              </span>
              <h1 className="text-lg font-bold ">Exit Web2</h1>
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
