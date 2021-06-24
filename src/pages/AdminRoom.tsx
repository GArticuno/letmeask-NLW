import { Link, useHistory, useParams } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
// import toast from 'react-hot-toast';

import logo from '../assets/images/logo.svg';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useState } from 'react';
import { ModalRoom } from '../components/Modal';

type RoomParams = {
  id: string;
}

export default function AdminRoom(){
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  const [modalIsOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
 
  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja encerrar esta sala?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()   
    }
  }

  function openModal(modalName: string){
    setModalName(modalName);
    setIsModalOpen(true);
  }

  function closeModal(){
    setIsModalOpen(false);
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
            <Button isOutlined onClick={() => openModal('clsRoom')}>Encerrar sala</Button> 
          </div>
        </div>
      </header>
      <main className='content'>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length !== 0 && <span>{questions.length} pergunta(s)</span>}
        </div>    
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
                    className={'delete-button'}
                    type='button'
                    aria-label='Deletar pergunta'
                    onClick={() => openModal('clsQuestion')}
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
        isOpen={modalIsOpen}
        modalName={modalName}
        closeModal={closeModal}
        handleCloseRoom={handleCloseRoom}
        handleDeleteQuestion={() => handleDeleteQuestion(roomId)}
      />
    </div>
  )
}