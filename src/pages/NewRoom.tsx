import { Link } from 'react-router-dom';

import illustration from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export default function NewRoom(){
  const { user } = useAuth();

  return(
    <div id='page-auth'>
      <aside>
        <img src={illustration} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logo} alt="Letmeask" />
          <h2>Criar uma Nova sala</h2>
          <form>
            <input 
              type="text"
              placeholder='Nome da sala' 
            />
            <Button type='submit'>
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}