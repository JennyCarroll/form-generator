import aliroLogo from './assets/aliro-logo.svg'
import DynamicForm from './components/DynamicForm'

function App() {

  return (
      <div style={{height: '100vh', width: '100vw'}}>
          <img src={aliroLogo} style={{display: 'flex'}} alt="Aliro logo" />
          <DynamicForm />
      </div>
  )
}

export default App
