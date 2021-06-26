import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseRooms = Record<string, {
  id: string,
  authorId: string,
  description: string,
  title: string,
  closedAt: string
}>

type RoomProps = {
  id: string,
  authorId: string,
  description: string,
  title: string,
  closedAt: string | undefined;
}

export default function OpenRooms(){

  const [rooms, setRooms] = useState<RoomProps[]>([]);

  useEffect(()=> {
    database.ref().child('rooms').get().then((snapshot) => {
      const firebaseRooms: FirebaseRooms = snapshot.val();
      const parsedRooms = Object.entries(firebaseRooms ?? {}).map(([key, value]) => {
        return {
          id: key,
          authorId: value.authorId,
          description: value.description,
          title: value.title,
          closedAt: value.closedAt,
        }
      })
      setRooms(parsedRooms)
      console.log(parsedRooms)
    }).catch((error) => {
      console.error(error);
    })
    
  },[])

  return (
    <div id='open-rooms'>
      <h1>Salas abertas</h1>
      {rooms.map(room => {
        return(
          <button key={room.id}>
            {room.id}
          </button>              
        )
      })}
    </div>
  )
}