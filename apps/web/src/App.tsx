import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { Layout } from './components/Layout'
import { Feed } from './pages/Feed'
import { Thread } from './pages/Thread'
import { CreateQuestion } from './pages/CreateQuestion'
import { MyQuestions } from './pages/MyQuestions'
import { EditQuestion } from './pages/EditQuestion'

function RedirectToEdit() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={id ? `/edit/${id}` : '/mine'} replace />
}
function RedirectToThread() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={id ? `/q/${id}` : '/'} replace />
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/q/:id" element={<Thread />} />
            <Route path="/new" element={<CreateQuestion />} />
            <Route path="/mine" element={<MyQuestions />} />
            <Route path="/edit/:id" element={<EditQuestion />} />
            {/* Redirect old doctor/patient URLs to unified routes */}
            <Route path="/patient/new" element={<Navigate to="/new" replace />} />
            <Route path="/patient/mine" element={<Navigate to="/mine" replace />} />
            <Route path="/patient/edit/:id" element={<RedirectToEdit />} />
            <Route path="/doctor/respond/:id" element={<RedirectToThread />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
