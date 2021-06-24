import { ReactNode } from 'react'
import './styles.scss'

type Props = {
  children?: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function Question({children, ...props}: Props ) {
  return(
    <div className="question">
      <p>{props.content}</p>
      <footer>
        <div className="user-info">
          <img src={props.author.avatar} alt={props.author.name} />
          <span>{props.author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>    
  )

}