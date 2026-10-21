import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import { IS_PAGES_DEMO } from '../services/requestService.js';

function AppLayout() {
  return (
    <div className="app-shell" data-testid="app-layout">
      <AppHeader />
      <main className="container page-content" id="main-content">
        <Outlet />
      </main>
      <footer className="site-footer"><div className="container">{IS_PAGES_DEMO ? 'GitHub Pages demo · บันทึกเฉพาะในเบราว์เซอร์นี้ · Reset Demo Data คืนข้อมูลตัวอย่าง 10 รายการ' : 'LAB environment · React + Express API + SQLite'}</div></footer>
    </div>
  );
}

export default AppLayout;
