import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { Layout } from './components/Layout'
import { Feed } from './pages/Feed'
import { Thread } from './pages/Thread'
import { CreateQuestion } from './pages/CreateQuestion'
import { MyQuestions } from './pages/MyQuestions'
import { DoctorInbox } from './pages/DoctorInbox'
import { DoctorRespond } from './pages/DoctorRespond'
import { EditQuestion } from './pages/EditQuestion'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/q/:id" element={<Thread />} />
            <Route path="/patient/new" element={<CreateQuestion />} />
            <Route path="/patient/mine" element={<MyQuestions />} />
            <Route path="/patient/edit/:id" element={<EditQuestion />} />
            <Route path="/doctor/inbox" element={<DoctorInbox />} />
            <Route path="/doctor/respond/:id" element={<DoctorRespond />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
