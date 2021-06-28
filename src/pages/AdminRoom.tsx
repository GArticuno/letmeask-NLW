import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineCheckCircle, AiFillCheckCircle } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import logo from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { QuestionProps, useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { EmptyQuestion } from '../components/EmptyQuestion';
import { ModalAnswered, ModalRoom } from '../components/Modal';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function AdminRoom(){
  const { openAndCloseModal, openAndCloseModalAnswer } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, closedAt, closeDate, description } = useRoom(roomId);

  const [modalName, setModalName] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [isShowAnswer, setIsShowAnswer] = useState(false);

 
  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: format(new Date(), 'dd-MM-yyyy, kk:mm:ss', {
        locale: ptBR
      })
    })
    openAndCloseModal();
  }

  async function openModalAnswer(questionId: string, questionContent: string) {
    setQuestionId(questionId);
    setQuestionContent(questionContent)
    openAndCloseModalAnswer();
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
        <p className='description'>Descrição: {description}</p>       
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
                  {!question.isAnswered ? (
                    <>
                      <button
                        className={'icon-button'}
                        type='button'
                        aria-label='Marcar pergunta como respondida'
                        title='Marcar como respondida'
                        onClick={() => openModalAnswer(question.id, question.content)}
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
                  ):( <AiFillCheckCircle className='icon answered-icon' title={'Pergunta respondida'}/>)}
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
      <ModalAnswered 
        roomId={roomId}
        questionId={questionId}
        questionContent={questionContent}
      />
    </div>
  )
}