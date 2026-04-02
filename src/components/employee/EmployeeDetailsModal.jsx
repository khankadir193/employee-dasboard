import Modal from '../common/Modal.jsx'

export default function EmployeeDetailsModal({ open, employee, onClose }) {
  return (
    <Modal
      open={open}
      title={employee?.name ? `Details: ${employee.name}` : 'Employee Details'}
      onClose={onClose}
    >
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(employee ?? {}, null, 2)}
      </pre>
    </Modal>
  )
}

