import { ReactNode } from 'react'
import { BsArrowReturnRight } from 'react-icons/bs';

import './styles.scss'

type Props = {
  children?: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  answer?: string;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  children,
  content,
  author,
  answer,
  isAnswered = false, 
  isHighlighted = false
}: Props ) {
  return(
    <>
      <div 
        className={
          `question ${isAnswered ? 'answered':''} ${isHighlighted && !isAnswered ? 'highlighted' : ''} `
        }
      >
        <p>{content}</p>
        <footer>
          <div className="user-info">
            <img src={author.avatar} alt={author.name} />
            <span>{author.name}</span>
          </div>
          <div>
            {children}
          </div>
        </footer>
      </div>
      {isAnswered && (
        <div className='question-answered'>
          <BsArrowReturnRight className='icon'/>
          <div className='content'>  
            <p>{answer}</p>
          </div>
        </div>
      )}  
    </>
    
  )

}