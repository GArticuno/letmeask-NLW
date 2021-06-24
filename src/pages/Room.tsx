import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {AiOutlineLike, AiFillLike} from 'react-icons/ai';
import toast from 'react-hot-toast';

import logo from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function Room(){
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');

  const { user } = useAuth();
  const { questions, title } = useRoom(roomId);

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

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if(likeId){
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).remove()   
    }else{
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      })
    }
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
        <div className="question-list">
          {questions.map(question => 
            { 
              return(
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type='button'
                    aria-label='Marcar como gostei.'
                    onClick={()=> handleLikeQuestion(question.id, question.likeId)}
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    {question.likeId ? 
                      (<AiFillLike className='icon like-icon' />) :
                      (<AiOutlineLike className='icon like-icon' />)
                    }
                  </button>
                </Question>
              )
            }
          )}
        </div>
      </main>
    </div>
  )
}