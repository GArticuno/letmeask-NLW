import {FormEvent, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

import illustration from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';

import '../styles/auth.scss';


export default function Home(){
  const {user, signInWithGoogle} = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const { closeDate } = useRoom(roomCode);
  
  const history = useHistory();
  
  async function handleCreateRoom(){
    if(!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      toast.error('Esta sala não existe.');
      return;
    }

    if(roomRef.val().closedAt){
      toast.error(`Esta sala foi fechada na data ${closeDate}`);
      return;
    }
    history.push(`/rooms/${roomCode}`);
  }

  function handleFindOpenRooms(){
    history.push(`/rooms/open`);
  }

  return(
    <div id='page-auth'>
      <aside>
        <img src={illustration} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas sobre qualquer assunto em tempo-real</p>
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
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder='Digite o código da sala' 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type='submit'>
              <FiLogIn className='icon login-icon'/>
              Entrar na sala
            </Button>
          </form>
        </div>
        <div className='rooms-button'>
          <Button type='button' onClick={handleFindOpenRooms}>
            Salas Abertas
         </Button>          
        </div>
      </main>
    </div>
  )
}