import { useState } from 'react';

export default function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState({
    requesterName: '',
    requestType: '',
    location: '',
    details: '',
    priority: 'normal'
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.requesterName.trim().length < 2) {
      newErrors.requesterName = 'ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    if (!formData.requestType) {
      newErrors.requestType = 'กรุณาเลือกประเภทบริการ';
    }
    if (formData.location.trim().length === 0) {
      newErrors.location = 'กรุณาระบุสถานที่';
    }
    if (formData.details.trim().length < 10) {
      newErrors.details = 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newReq = {
      id: `REQ-${String(Date.now()).slice(-4)}`,
      requesterName: formData.requesterName.trim(),
      requestType: formData.requestType,
      location: formData.location.trim(),
      details: formData.details.trim(),
      priority: formData.priority,
      status: 'pending'
    };

    onAddRequest(newReq);
    setSuccessMsg('บันทึกคำร้องเรียบร้อยแล้ว!');
    setFormData({
      requesterName: '',
      requestType: '',
      location: '',
      details: '',
      priority: 'normal'
    });
    setErrors({});
  };

  return (
    <section className="panel" aria-labelledby="form-title">
      <h2 id="form-title">สร้างคำร้องบริการ</h2>
      {successMsg && <p className="status-msg success" role="status">{successMsg}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input
            type="text"
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            className={errors.requesterName ? 'is-invalid' : ''}
            placeholder="ระบุชื่อ-นามสกุล"
          />
          {errors.requesterName && <span className="error-text">{errors.requesterName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="requestType">ประเภทบริการ</label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            className={errors.requestType ? 'is-invalid' : ''}
          >
            <option value="">-- เลือกประเภทบริการ --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="IT Support">IT Support</option>
            <option value="ทำความสะอาด">ทำความสะอาด</option>
            <option value="เรื่องทั่วไป">เรื่องทั่วไป</option>
          </select>
          {errors.requestType && <span className="error-text">{errors.requestType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">สถานที่</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'is-invalid' : ''}
            placeholder="เช่น ห้องปฏิบัติการ 301"
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="details">รายละเอียด</label>
          <textarea
            id="details"
            name="details"
            rows="3"
            value={formData.details}
            onChange={handleChange}
            className={errors.details ? 'is-invalid' : ''}
            placeholder="รายละเอียดเพิ่มเติม (อย่างน้อย 10 ตัวอักษร)"
          ></textarea>
          {errors.details && <span className="error-text">{errors.details}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">ความสำคัญ</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="normal">ปกติ (Normal)</option>
            <option value="urgent">ด่วนที่สุด (Urgent)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">ส่งคำร้อง</button>
      </form>
    </section>
  );
}