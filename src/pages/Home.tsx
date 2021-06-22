
import {useHistory} from 'react-router-dom';

import illustration from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export default function Home(){
  const {user, signInWithGoogle} = useAuth();
  const history = useHistory();
  
  async function handleCreateRoom(){
    if(!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

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
          <button className='create-room' onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Ícone Google" />
            Crie sua sala com o Google
          </button>
          <div className='separator'>
            Ou entre em uma sala
          </div>
          <form>
            <input 
              type="text"
              placeholder='Digite o código da sala' 
            />
            <Button type='submit'>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}