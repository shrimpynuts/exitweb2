import FadeIn from 'react-fade-in'

interface ISlowShowProps {
  step: number
}
export const SlowShow: React.FunctionComponent<ISlowShowProps> = ({ children, step }) => {
  const delayMilliseconds = 100 * step
  return <FadeIn delay={delayMilliseconds}>{children}</FadeIn>
}
