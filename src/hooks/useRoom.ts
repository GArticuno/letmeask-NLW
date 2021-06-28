import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  answer: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likes: Record<string, {
    authorId: string
  }>
}>

export type QuestionProps = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  answer: string | undefined,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState<QuestionProps[]>([]);
  const [title, setTitle] = useState('');
  const [closedAt, setClosedAt] = useState(false);
  const [closeDate, setCloseDate] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(()=>{
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room =>{
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
      
      const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          answer: value.answer,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })

      setClosedAt(databaseRoom.closedAt ? true : false);
      setCloseDate(databaseRoom.closedAt ?? '');
      setAuthorId(databaseRoom.authorId);
      setTitle(databaseRoom.title);
      setDescription(databaseRoom.description);
      setQuestions(parsedQuestions);
      setQuestionsAnswered(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  },[roomId, user?.id]);

  return { closedAt, closeDate, questions, questionsAnswered, title, authorId, description };
}