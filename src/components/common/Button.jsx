export default function Button({ children, onClick, type = 'button', ...rest }) {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}

