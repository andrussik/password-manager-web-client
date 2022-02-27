import './style.scss'

interface Props {
  children: JSX.Element | string;
  className?: string;
  onClick?: () => any;
}

const LinkButton = ({ children, className, onClick }: Props) => {
  let classN = 'link-button';
  if (className != null)
    classN += ' ' + className;

  return <a className={classN} onClick={onClick}>{children}</a>
};

export default LinkButton