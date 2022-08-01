interface ISlowShowProps {
  step: number
}
export const SlowShow: React.FunctionComponent<ISlowShowProps> = ({ children, step }) => {
  const num = 2 * step
  return (
    <div className="animated fadeIn" style={{ animationDelay: `${num / 10}s` }}>
      {children}
    </div>
  )
}
