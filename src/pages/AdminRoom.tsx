import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import logo from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { EmptyQuestion } from '../components/EmptyQuestion';
import { ModalRoom } from '../components/Modal';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function AdminRoom(){
  const { openAndCloseModal } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, closedAt, closeDate } = useRoom(roomId);

  const [modalName, setModalName] = useState('');
  const [questionId, setQuestionId] = useState('');
 
  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: format(new Date(), 'dd-MM-yyyy, kk:mm:ss', {
        locale: ptBR
      })
    })
    openAndCloseModal();
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })   
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })   
  }

  function openModal(modalName: string, questionId: string){
    setModalName(modalName);
    setQuestionId(questionId)
    openAndCloseModal();
  }

  return(
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logo} alt="Letmeask" title='Home' id='logo-room'/>
          </Link>
          <div>
            <RoomCode code={roomId}/>
            <Button 
              isOutlined 
              onClick={() => openModal('clsRoom', '')}
              disabled={closedAt}
            >Encerrar sala</Button> 
          </div>
        </div>
      </header>
      <main className='content'>
        <div className='room-title'>
          <div>
          <h1>{title}</h1>
            {questions.length !== 0 && <span>{questions.length} pergunta(s)</span>}        
          </div>
          {closedAt === true && (
            <div className='div-ended'>
              <span>
                Sala encerrada dia:
              </span>
              <span>{closeDate}</span>
            </div>
          )}
        </div>    
        <div className="question-list">
          {questions.length === 0 && <EmptyQuestion/>}
          {questions.slice(0).reverse().map(question => 
            { 
              return(
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        className={'icon-button'}
                        type='button'
                        aria-label='Marcar pergunta como respondida'
                        title='Marcar como respondida'
                        onClick={() => handleCheckQuestionAnswered(question.id)}
                        disabled={closedAt}
                      >
                        <AiOutlineCheckCircle className='icon'/>
                      </button>
                      <button
                        className={'icon-button'}
                        type='button'
                        aria-label='Dar destaque a pergunta'
                        title='Dar destaque'
                        onClick={() => handleHighlightQuestion(question.id)}
                        disabled={closedAt}
                      >
                        <BiMessageDetail className='icon'/>
                      </button>
                    </>
                  )}
                  <button
                    className={'icon-button'}
                    type='button'
                    aria-label='Deletar pergunta'
                    title='deletar'
                    onClick={() => openModal('deleteQuestion', question.id)}
                    disabled={closedAt}
                  >
                    <AiOutlineDelete className='icon delete-icon'/>
                  </button>
                </Question>
              )
            }
          )}
        </div>
      </main>
      
      <ModalRoom 
        modalName={modalName}
        handleCloseRoom={handleCloseRoom}
        roomId={roomId}
        questionId={questionId}
      />
    </div>
  )
}