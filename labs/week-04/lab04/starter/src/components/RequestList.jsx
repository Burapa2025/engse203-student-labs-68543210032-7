import RequestCard from './RequestCard';

export default function RequestList({ requests, onDelete }) {
  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <p>ไม่พบรายการคำร้องบริการ</p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map(request => (
        <RequestCard key={request.id} request={request} onDelete={onDelete} />
      ))}
    </div>
  );
}