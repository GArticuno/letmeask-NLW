import toast from 'react-hot-toast';
import copy from '../../assets/images/copy.svg';

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
    <button className='room-code' onClick={copyRoomToClipboard}>
      <div id='img-container'>
        <img src={copy} alt="Copiar código" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}