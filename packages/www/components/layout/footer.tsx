import Image from 'next/image'

function Footer() {
  return (
    <footer className="bg-gray-100 mt-8">
      <div className="container mx-auto px-8 md:px-24">
        <div className="w-full flex flex-col md:flex-row py-8 justify-evenly">
          <div className="md:w-1/4 py-4">
            <Image src="/receipt-emoji.png" alt="me" width={60} height={60} />
            <p className="text-gray-800 hover:text-gray-700">
              NFT Accounting is a simple tool for generating receipts for NFT transactions.
            </p>
          </div>

          <div className="">
            <p className="uppercase text-gray-500 md:mb-6">Links</p>
            <ul className="list-reset mb-6">
              <li className="">
                <a href="/faq" className="no-underline hover:underline text-gray-800 hover:text-gray-700">
                  FAQ
                </a>
              </li>
              <li className="">
                <a href="/help" className="no-underline hover:underline text-gray-800 hover:text-gray-700">
                  Help
                </a>
              </li>
              <li className="">
                <a
                  href="https://forms.gle/5GxDYWiAo6aU3ZTK7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline text-gray-800 hover:text-gray-700"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <p className="uppercase text-gray-500 md:mb-6">Legal</p>
            <ul className="list-reset mb-6">
              <li className="">
                <a href="/terms-of-service" className="no-underline hover:underline text-gray-800 hover:text-gray-700">
                  Terms
                </a>
              </li>
              <li className="">
                <a href="/privacy-policy" className="no-underline hover:underline text-gray-800 hover:text-gray-700">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <p className="uppercase text-gray-500 md:mb-6">Social</p>
            <ul className="list-reset mb-6">
              <li className="">
                <a
                  href="https://twitter.com/jonathanmcai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline text-gray-800 hover:text-gray-700"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <p className="uppercase text-gray-500 md:mb-6">Company</p>
            <ul className="list-reset mb-6">
              <li className="">
                <a href="/about" className="no-underline hover:underline text-gray-800 hover:text-gray-700">
                  About
                </a>
              </li>
              <li className="">
                <a
                  href="mailto:caimjonathan@gmail.com"
                  className="no-underline hover:underline text-gray-800 hover:text-gray-700"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
