import {FormEvent, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';

import illustration from '../assets/images/illustration.svg'
import logo from '../assets/images/logo.svg'

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/auth.scss';

export default function NewRoom(){
  const {user} = useAuth();

  const [newRoom, setNewRoom] = useState('');
  const [description, setDescription] = useState('');
  
  const history = useHistory();

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if(newRoom.trim() === '' || description.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      description: description,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return(
    <div id='page-auth'>
      <aside>
        <img src={illustration} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logo} alt="Letmeask" />
          <h2>Criar uma Nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder='Nome da sala'
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <textarea
              placeholder='Descreva o objetivo da sala'
              value={description}
              onChange={event => setDescription(event.target.value)}
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