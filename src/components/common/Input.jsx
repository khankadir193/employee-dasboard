export default function Input({ label, value, onChange, placeholder = '', ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      {label ? <div style={{ marginBottom: 4 }}>{label}</div> : null}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </label>
  )
}

