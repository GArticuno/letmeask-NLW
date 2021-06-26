import toast from 'react-hot-toast';
import {FiCopy} from 'react-icons/fi';

import './styles.scss';

type Props = {
  code: string;
}

export function RoomCode(props: Props) {

  function copyRoomToClipboard() {
    navigator.clipboard.writeText(props.code);
    toast.success('Código da sala copiado!')
  }
  return(
    <button className='room-code' onClick={copyRoomToClipboard} title='Copiar código da sala'>
      <div id='img-container'>
        <FiCopy className='icon'/>
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}