import {Routes, Route} from 'react-router-dom'
import Index from './components'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Uploads from './components/Uploads'
import Plans from './components/Plans'
import Success from './components/Success'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Index/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/Home' element={<Home/>}/>
      <Route path='/uploads' element={<Uploads/>}/>
      <Route path='/plans' element={<Plans/>}/>
      <Route path='/success' element={<Success/>}/>
    </Routes>
    </>
  )
}

export default App
