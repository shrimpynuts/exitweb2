import Lock from '../svg/lock'

interface IProps {
  message: string
}
export default function RestrictedCard({ message }: IProps) {
  return (
    <div>
      <div className="text-center text-2xl absolute z-10 w-60 md:w-96 mx-auto left-0 right-0 mt-32 select-none cursor-not-allowed">
        <div className="border border-gray-300 rounded-xl bg-gray-50 py-6 px-4 shadow-md text-gray-700 tracking-tighter">
          <div className="text-center mx-auto w-8 ">
            <Lock />
          </div>
          {message}
        </div>
      </div>
    </div>
  )
}
