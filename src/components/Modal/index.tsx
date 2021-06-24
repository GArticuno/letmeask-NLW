import Modal from 'react-modal';
import { CgCloseO } from 'react-icons/cg';
import { AiOutlineDelete } from 'react-icons/ai';

import { Button } from "../Button";

import './styles.scss';

type Props = {
  isOpen: boolean;
  modalName: string;

  closeModal: () => void;
  handleCloseRoom: () => void;
  handleDeleteQuestion: () => void;
};

const Style = {
  content: {
    borderRadius: '.5rem',

    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',

    padding: '5rem',
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
  return (
    <Modal
      isOpen={props.isOpen}
      style={Style}
    >
      {props.modalName === 'clsRoom' ? (
        <div className='modal'>
          <CgCloseO className='big-icon'/>
          <h1>Encerrar sala</h1>
          <span>Tem certeza que você deseja encerrar esta sala?</span>
          <div>
            <Button id='cancel-button' onClick={props.closeModal}> Cancelar </Button>
            <Button id='agree-button' onClick={props.handleCloseRoom}> Sim, encerrar</Button>
          </div>
        </div>
      ):(
        <div className='modal'>
          <AiOutlineDelete className='big-icon'/>
          <h1>Excluir pergunta</h1>
          <span>Tem certeza que você deseja excluir esta pergunta?</span>
          <div>
            <Button id='cancel-button' onClick={props.closeModal}> Cancelar </Button>
            <Button id='agree-button' onClick={props.handleCloseRoom}> Sim, excluir</Button>
          </div>
        </div>
      )}

    </Modal>
  )
}