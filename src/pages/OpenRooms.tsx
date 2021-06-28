import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import logo from '../assets/images/logo.svg';

import { database } from "../services/firebase";

import { Button } from "../components/Button";
import { NotRooms } from "../components/EmptyQuestion";

import '../styles/room.scss';

type FirebaseRooms = Record<string, {
  id: string,
  authorId: string,
  description: string,
  title: string,
  closedAt: string
}>

type RoomProps = {
  id: string,
  title: string,
  closedAt: string | undefined;
}

export default function OpenRooms(){
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const history = useHistory();

  function closedCheck(room: RoomProps) {
    return room.closedAt === undefined;
  }

  function handleJoinRoom(roomId: string) {
    history.push(`/rooms/${roomId}`);
  }

  useEffect(()=> {
    database.ref().child('rooms').get().then((snapshot) => {
      const firebaseRooms: FirebaseRooms = snapshot.val();
      const parsedRooms = Object.entries(firebaseRooms ?? {}).map(([key, value]) => {
        return {
          id: key,
          title: value.title,
          closedAt: value.closedAt,
        }
      })
      setRooms(parsedRooms.filter(closedCheck))
    }).catch((error) => {
      console.error(error);
    })
    
  },[])

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logo} alt="Letmeask" title='Home' id='logo-room'/>
          </Link>
        </div>
        
      </header>
      
      <main className='content rooms'>
        <h1>Salas Abertas</h1>
        <div className='room-list'>
          {rooms.length === 0 && <NotRooms/>}
          {rooms.map(room => {
            return (
              <Button key={room.id} onClick={()=> handleJoinRoom(room.id)}>
                {room.title}
              </Button>
            )
          })}
        </div>
      </main>
    </div>
  )
}