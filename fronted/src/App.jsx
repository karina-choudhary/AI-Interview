import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 

// Saare pages sahi se imported hone chahiye
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume'; // Check karein yeh import sahi hai
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Question from "./pages/Question";
import InterviewHistory from "./pages/InterviewHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout waale routes */}
        <Route element={<Layout />}>
          {/* Yahan dhyan se check karein ki har path ke sath wahi element ho */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} /> 
          <Route path="/interview" element={<Interview />} />
          <Route path="/interview-history" element={<InterviewHistory />} />
          <Route path="/feedback/:id" element={<Feedback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/question/:id" element={<Question />} />
          </Route>
          

        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


