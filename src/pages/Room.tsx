import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import logo from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RooCode';

import '../styles/room.scss'
import toast from 'react-hot-toast';

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: string,
  isHighlighted: string
}>

type Question = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: string,
  isHighlighted: string
}

type RoomParams = {
  id: string;
}

export default function Room(){
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  
  const roomId = params.id;
  
  useEffect(()=>{
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room =>{
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted
        }
      })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  },[roomId])
  
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    
    if(newQuestion.trim() === '') {
      return;
    }
    
    if(!user){
      toast.error("Você precisa estar logado.");
      throw new Error("You must be logged in.");
    }
    
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }
    
    await database.ref(`rooms/${roomId}/questions`).push(question);
    
    
    setNewQuestion('');
    toast.success("Mensagem enviada.")
  }
  
  return(
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logo} alt="Letmeask" title='Home' id='logo-room'/>
          </Link>
          <RoomCode code={roomId}/>
        </div>
      </header>
      
      <main className='content'>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length !== 0 && <span>{questions.length} pergunta(s)</span>}
        </div>    
        <form onSubmit={handleSendQuestion}>
          <textarea 
          placeholder='O que você quer perguntar?'
          value={newQuestion}
          onChange={event => setNewQuestion(event.target.value)}
          />
          <div className='form-footer'>
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
              ):
              (
                <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
              )
            }
            <Button type='submit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        {questions.map(question => { 
          return(
            <div className="questions">
              <p>{question.content}</p>
            </div>
            )
          })
        }
      </main>
    </div>
  )
}