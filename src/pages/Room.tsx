import { FormEvent, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {AiOutlineLike, AiFillLike, AiOutlineShareAlt} from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';
import toast from 'react-hot-toast';

import logo from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { QuestionProps, useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { EmptyQuestion } from '../components/EmptyQuestion';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function Room(){
  const params = useParams<RoomParams>();
  const roomId = params.id;  
  const history = useHistory();
  const [newQuestion, setNewQuestion] = useState('');
  const [isShowAnswer, setIsShowAnswer] = useState(false);

  const { user, signInWithGoogle } = useAuth();
  const { 
    closedAt, 
    questions, 
    title, 
    authorId, 
    closeDate, 
    description, 
  } = useRoom(roomId);

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

  function pushToAdminRoom(){
    history.push(`/admin/rooms/${roomId}`)
  }

  function copyUrlRoomToClipboard() {
    navigator.clipboard.writeText(window.location.href);
    toast.success('URL da sala copiada!')
  }

  function filterQuestions(question: QuestionProps) {
    if(isShowAnswer) {
      return question.isAnswered === true 
    }else {
      return question;
    }
  }

  function filterQuestionsLabel(question: QuestionProps) {
    return question.isAnswered === true
  }
  
  return(
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logo} alt="Letmeask" title='Home' id='logo-room'/>
          </Link>
          <div>
            {user?.id === authorId && (
              <button 
                className='admin-button'
                aria-label='Sala do Admin'
                title='Sala de administração'
                onClick={pushToAdminRoom}
              >
                <GrUserAdmin className='icon'/>
              </button>              
            )}
            <RoomCode code={roomId}/>
          </div>  
        </div>
      </header>
      
      <main className='content'>
        <div className='room-title'>
          <div>
            <h1>{title}</h1>
            {questions.length !== 0 && (
              <span 
                onClick={() => setIsShowAnswer(false) }
                title='Veja todas as perguntas'
              >
                {questions.length} pergunta(s)
              </span>)}
              {questions.length !== 0 && (
              <span 
                className='answered-span' 
                onClick={() => setIsShowAnswer(true) }
                title='Veja somente as perguntas respondidas'
              >
                {questions.filter(filterQuestionsLabel).length} respondida(s)
              </span>)}
            {!closedAt && 
            (<AiOutlineShareAlt 
                className='icon share-icon'
                title='Compartilhar sala'
                onClick={copyUrlRoomToClipboard}
              /> 
            )}     
          </div>
          {closedAt && (
            <div className='div-ended'>
              <span>
                Sala encerrada dia:
              </span>
              <span>{closeDate}</span>
            </div>
          )} 
        </div> 
        <p className='description'>Descrição: {description}</p>   
        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder='O que você quer perguntar?'
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
            disabled={closedAt}
          />
          <div className='form-footer'>
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
              ):
              (
                <span>Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button>.</span>
              )
            }
            <Button type='submit' disabled={!user || closedAt}>Enviar pergunta</Button>
          </div>
        </form>
        <div className="question-list">
          {questions.length === 0 && <EmptyQuestion/>}
          {questions.slice(0).reverse().filter(filterQuestions).map(question => 
            { 
              return(
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  answer={question?.answer}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  <button
                    className={`icon-button ${question.likeId ? 'marked' : ''}`}
                    type='button'
                    aria-label='Marcar como gostei.'
                    onClick={()=> handleLikeQuestion(question.id, question.likeId)}
                    disabled={closedAt || question.isAnswered}
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    {question.likeId ? 
                      (<AiFillLike className='icon' />) :
                      (<AiOutlineLike className='icon' />)
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