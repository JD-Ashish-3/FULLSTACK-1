import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import Dashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/**Admin route */}
          <Route path = '/' element={<></>} />
          <Route path = '/admin-dashboard' element={<Dashboard />} />
          <Route path = '/all-appointments' element={<AllAppointments />} />
          <Route path = '/add-doctor' element={<AddDoctor />} />
          <Route path = '/doctor-list' element={<DoctorsList />} />
          {/**Doctor route */}
          <Route path = '/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path = '/doctor-appointments' element={<DoctorAppointments />} />
          <Route path = '/doctor-profile' element={<DoctorProfile />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login />
      <ToastContainer/>
    </>

  )
}

export default App
