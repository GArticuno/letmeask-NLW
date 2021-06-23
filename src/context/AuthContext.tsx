import React, {createContext, ReactNode, useEffect, useState} from 'react';
import { Toaster } from 'react-hot-toast';

import { firebase, auth } from '../services/firebase';

type Props= {
  children: ReactNode
}
type UserProps = {
  id: string;
  name: string;
  avatar: string;
}

type AuthProps = {
  user: UserProps | undefined;
  signInWithGoogle: () => Promise<void>;
}



export const AuthContext = createContext({} as AuthProps);

export function AuthContextProvider ({children}: Props){
  const [user, setUser]= useState<UserProps>();

  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider)

    if(result.user){
      const {displayName, photoURL, uid} = result.user

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }  
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const {displayName, photoURL, uid} = user

        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  },[])

  return(
    <AuthContext.Provider value={{user, signInWithGoogle}}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </AuthContext.Provider>
  )
}