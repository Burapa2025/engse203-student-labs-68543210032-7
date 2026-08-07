export default function RequestCard({ request, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return { text: 'รอดำเนินการ', class: 'status-pending' };
      case 'in-progress': return { text: 'กำลังดำเนินการ', class: 'status-in-progress' };
      case 'completed': return { text: 'เสร็จสิ้น', class: 'status-completed' };
      default: return { text: status, class: '' };
    }
  };

  const statusInfo = getStatusBadge(request.status);

  return (
    <div className={`request-card ${request.priority === 'urgent' ? 'is-urgent' : ''}`}>
      <div className="card-header">
        <span className="req-id">{request.id}</span>
        <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
      </div>
      <div className="card-body">
        <h3>{request.requesterName}</h3>
        <p><strong>ประเภท:</strong> {request.requestType}</p>
        <p><strong>สถานที่:</strong> {request.location}</p>
        <p><strong>รายละเอียด:</strong> {request.details}</p>
        <p>
          <strong>ความสำคัญ:</strong>{' '}
          <span className={`priority-text ${request.priority}`}>
            {request.priority === 'urgent' ? '🚨 ด่วนที่สุด' : 'ปกติ'}
          </span>
        </p>
      </div>
      <div className="card-footer">
        <button
          type="button"
          className="btn btn-delete"
          onClick={() => onDelete(request.id)}
        >
          ลบรายการ
        </button>
      </div>
    </div>
  );
}