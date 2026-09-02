export function Loader({ label = 'Loading...' }) {
  return <p className="status status-loading">{label}</p>
}

export function ErrorMessage({ message = 'Something went wrong.' }) {
  return <p className="status status-error">{message}</p>
}
