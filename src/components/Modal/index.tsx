import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import { CgCloseO } from 'react-icons/cg';
import { AiOutlineDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

import { Button } from "../Button";

import './styles.scss';




type Props = {
  modalName: string;
  roomId: string;
  questionId: string;
  handleCloseRoom: () => void;
};

type AnswerProps = {
  roomId: string;
  questionId: string;
  questionContent: string;
}

const Style = {
  content: {
    borderRadius: '.5rem',

    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',

    padding: '3rem',
    marginRight: '-50%',
    
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 23, 23, 0.498)'
  }
}

Modal.setAppElement('body');
export function ModalRoom(props: Props) {
  const { modalIsOpen, openAndCloseModal} = useAuth();

  async function handleDeleteQuestion() {
    await database.ref(`rooms/${props.roomId}/questions/${props.questionId}`).remove()
    openAndCloseModal()
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      style={Style}
    >
      {props.modalName === 'clsRoom' ? (
        <div className='modal'>
          <CgCloseO className='big-icon'/>
          <h1>Encerrar sala</h1>
          <span>Tem certeza que você deseja encerrar esta sala?</span>
          <div>
            <Button id='cancel-button' onClick={openAndCloseModal}> Cancelar </Button>
            <Button id='agree-button' onClick={props.handleCloseRoom}> Sim, encerrar</Button>
          </div>
        </div>
      ):(
        <div className='modal'>
          <AiOutlineDelete className='big-icon'/>
          <h1>Excluir pergunta</h1>
          <span>Tem certeza que você deseja excluir esta pergunta?</span>
          <div>
            <Button id='cancel-button' onClick={openAndCloseModal}> Cancelar </Button>
            <Button id='agree-button' onClick={handleDeleteQuestion}> Sim, excluir</Button>
          </div>
        </div>
      )}

    </Modal>
  )
}

export function ModalAnswered(props: AnswerProps) {
  const { isModalAnswerIsOpen, openAndCloseModalAnswer} = useAuth();
  const [answer, setAnswer] = useState('');

  async function submitAnswerQuestion(event: FormEvent) {
    event.preventDefault();

    if(answer.trim() === ''){
      return;
    }
    await database.ref(`rooms/${props.roomId}/questions/${props.questionId}`).update({
      isAnswered: true,
      answer: answer
    })  
    openAndCloseModalAnswer()
    toast.success('Resposta enviada')
  }

  return(
    <Modal
      isOpen={isModalAnswerIsOpen}
      style={Style}
    >
      <div className='modal answer'>
        <h1>Pergunta</h1>
        <p>{props.questionContent}</p>
        <form onSubmit={submitAnswerQuestion}>  
          <textarea
            value={answer}
            onChange={event => setAnswer(event.target.value)}
          />
          <div>
            <Button id='cancel-button' onClick={openAndCloseModalAnswer}> Cancelar </Button>
            <Button id='agree-button' type='submit'> Enviar resposta</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}