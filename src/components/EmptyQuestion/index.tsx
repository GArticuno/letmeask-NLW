import emptyQuestions from '../../assets/images/empty-questions.svg';

import './styles.scss';

export function EmptyQuestion() {
  return(
    <div id='empty-questions'>
      <img src={emptyQuestions} alt="Sem perguntas" />
      <h2>Nenhuma pergunta por aqui...</h2>
      <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
    </div>
  )
}

export function NotRooms() {
  return(
    <div id='empty-questions'>
      <img src={emptyQuestions} alt="Sem perguntas" />
      <h2>Nenhuma sala por aqui...</h2>
      <span>Crie uma sala e envie o dela código para seus amigos e comece a responder perguntas!</span>
    </div>
  )
}