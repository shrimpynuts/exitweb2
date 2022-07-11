// Button.jsx
import classnames from 'classnames'
import Spinner from './spinner'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  bgColor?: string
  darkBgColor?: string
  darkBgHoverColor?: string
  bgHoverColor?: string
  textColor?: string
  children: React.ReactElement | string
  isLoading?: boolean
  disabled?: boolean
  classOverrides?: string
}

const Button: React.FC<IButtonProps> = ({
  size = 'sm',
  bgColor = 'blue-600',
  darkBgColor = 'gray-700',
  darkBgHoverColor = 'gray-800',
  bgHoverColor = 'blue-900',
  textColor = 'white',
  isLoading = false,
  disabled = false,
  classOverrides,
  children = '',
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={classnames(
        `transition-all duration-200 text-white bg-${bgColor} dark:bg-${darkBgColor} dark:hover:bg-${darkBgHoverColor} py-2 px-4 rounded font-medium text-center`,
        {
          'text-xs': size === 'sm',
          'text-md': size === 'md',
          'text-xl': size === 'lg',
          [`bg-${bgColor}-600 hover:bg-${bgColor}-800`]: !isLoading,
          'bg-gray-400 cursor-not-allowed': isLoading || disabled,
          [`${classOverrides}`]: classOverrides?.length && classOverrides?.length > 0,
        },
      )}
      {...props}
    >
      <div className="relative">
        <div
          className={classnames('', {
            'opacity-0 h-0': isLoading,
          })}
        >
          {children}
        </div>
        {isLoading && <Spinner />}
      </div>
    </button>
  )
}

export default Button
