import React from 'react'
import Navbar from './components/landing/Navbar'
import { Routes, Route } from 'react-router-dom'

// master pages link
import Landing from './pages/Landing'
import Footer from './components/landing/Footer'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'


// student routes
import StudentLayout from './components/layouts/Studentlayout'
import StudentDashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import EditProfile from './pages/student/EditProfile'
import BrowseSkills from './pages/student/BrowseSkills'
import ProtectedRoute from "./components/common/ProtectedRoute"
import FindMentors from './pages/student/FindMentors'
import Requests from './pages/student/Requests'
import Tests from './pages/student/Tests'
import Progress from './pages/student/Progress'
import Wallet from './pages/student/Wallet'
import StudentSessions from './pages/student/Sessions'
import Chat from './pages/student/Chat'
import Notifications from './pages/student/Notifications'
import AdminLayout from './components/layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMentors from './pages/admin/AdminMentors'
import AdminSkills from './pages/admin/AdminSkills'
import AdminSkillRequests from './pages/admin/AdminSkillReq'
import AdminReviews from './pages/admin/AdminReviews'
import AdminMembership from './pages/admin/AdminMembership'
import AdminReports from './pages/admin/AdminReports'
import MentorLayout from './components/layouts/Mentorlayout'
import MentorDashboard from './pages/mentor/MentorDashboard'
import MentorSessions from './pages/mentor/MentorSessions'
import MentorStudents from './pages/mentor/MentorStudents'
import CreateTests from './pages/mentor/CreateTests'
import MentorProfile from './pages/mentor/Profile'
import MentorEditProfile from './pages/mentor/EditProfile'
import MentorReviews from './pages/mentor/Reviews'
import MentorEarnings from './pages/mentor/Earnings'
import MentorVerification from './pages/mentor/Verification'
import MentorRequests from './pages/mentor/Requests'
import MentorWallet from './pages/mentor/Wallet'
import BecomeMentor from "./pages/student/BecomeMentor"
import MentorChat from './pages/mentor/Chat';

// Admin routes



const App = () => {
  return (
    <div className=''>
      {/* <Navbar /> */}
      <div className="flex-1">
        <Routes>

          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* ── Student routes (role: student) ── */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<StudentLayout />}>
              <Route path="/dashboard"      element={<StudentDashboard />} />
              <Route path="/profile"        element={<Profile />} />
              <Route path="/profile/edit"   element={<EditProfile />} />
              <Route path="/browse-skills"  element={<BrowseSkills />} />
              <Route path="/find-mentors"   element={<FindMentors />} />
              <Route path="/requests"       element={<Requests />} />
              <Route path="/tests"          element={<Tests />} />
              <Route path="/progress"       element={<Progress />} />
              <Route path="/wallet"         element={<Wallet />} />
              <Route path="/sessions"       element={<StudentSessions />} />
              <Route path="/chat"           element={<Chat />} />
              <Route path="/notifications"  element={<Notifications />} />
              <Route path="/become-mentor" element={<BecomeMentor />}/>    
            </Route>
          </Route>

          {/* ── Admin routes (role: admin) ── */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index              element={<AdminDashboard />} />
              <Route path='users'       element={<AdminUsers />} />
              <Route path='mentors'     element={<AdminMentors />} />
              <Route path='skills'      element={<AdminSkills />} />
              <Route path='requests'    element={<AdminSkillRequests />} />
              <Route path='reviews'     element={<AdminReviews />} />
              <Route path='membership'  element={<AdminMembership />} />
              <Route path='reports'     element={<AdminReports />} />
              <Route path='notifications' element={<Notifications />} />
            </Route>
          </Route>

          {/* ── Mentor routes (role: mentor) ── */}
          <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
            <Route path="/mentor" element={<MentorLayout />}>
              <Route index                         element={<MentorDashboard />} />
              <Route path='/mentor/sessions'       element={<MentorSessions />} />
              <Route path='/mentor/students'       element={<MentorStudents />} />
              <Route path='/mentor/tests'          element={<CreateTests />} />
              <Route path='/mentor/profile'        element={<MentorProfile />} />
              <Route path='/mentor/profile/edit'   element={<MentorEditProfile />} />
              <Route path='/mentor/reviews'        element={<MentorReviews />} />
              <Route path='/mentor/earnings'       element={<MentorEarnings />} />
              <Route path='/mentor/verification'   element={<MentorVerification />} />
              <Route path='/mentor/requests'       element={<MentorRequests />} />
              <Route path='/mentor/wallet'         element={<MentorWallet />} />
              <Route path='/mentor/chat'           element={<MentorChat />} />
              <Route path='/mentor/notifications'  element={<Notifications />} />
            </Route>
          </Route>

        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default App

