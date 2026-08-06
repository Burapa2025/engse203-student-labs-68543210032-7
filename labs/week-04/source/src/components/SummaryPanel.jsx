// src/components/SummaryPanel.jsx
function SummaryPanel({ taskCount }) {
    return (
        <section className="panel">
            <h2>Starter พร้อมแล้ว</h2>
            <p>มีข้อมูลเริ่มต้น {taskCount} รายการ</p>
        </section>
    );
}
export default SummaryPanel;