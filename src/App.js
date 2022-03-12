import './App.css';
import {useReducer, useEffect} from 'react'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

const INTERGER_FORMATTER = new Intl.NumberFormat('en-us', {maximumFractionDigits:0})


function App() {
  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {})
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  },[])

  return (
    <div className="App">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)}{operation == '/' ? '÷' : (operation == '*' ? '×' : operation)}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={()=>dispatch({type:'ALL_CLEAR'})}>AC</button>
      <button onClick={()=>dispatch({type:'DELETE'})}>DEL</button>
      <OperationButton operation='/' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className="span-two" onClick={()=>dispatch({type:'CALCULATE'})}>=</button>
    </div>
  );

  function handleKeydown(e){
    switch (e.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
      case '.':
        dispatch({ type: "INPUT_DIGIT", payload: { digit: e.key } })
        break
      case '+':
      case '-':
      case '/':
      case '*':
        dispatch({ type: "INPUT_OPERATION", payload: { operation: e.key } })
        break
      case '=':
        dispatch({type:'CALCULATE'})
        break
      case 'Backspace':
        dispatch({type:'DELETE'})
        break
      case 'Escape':
        dispatch({type:'ALL_CLEAR'})
        break
      default:
        return
    }
  }
}

function reducer(state, {type, payload}) {
  switch (type){
    case 'INPUT_DIGIT':
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0') return state
      if(payload.digit === '.' && state.currentOperand.includes('.')) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case 'INPUT_OPERATION':
      if(state.currentOperand == null && state.previousOperand == null) return state
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null ) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: calculate(state),
        currentOperand: null
      }
    case 'ALL_CLEAR':   
      return {}
    case 'DELETE':
      if(state.overwrite) return {
        ...state,
        currentOperand: null,
        overwrite: false
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) return {
        ...state, 
        currentOperand: null
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case 'CALCULATE':
      if(state.previousOperand == null || state.currentOperand == null || state.operation == null) return state
      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: calculate(state),
        overwrite: true
      }
  }
}

function calculate({previousOperand, currentOperand, operation}){
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(curr)) return ''
  let result = ''
  switch(operation){
    case '+':
      result = prev + curr
      break
    case '-':
      result = prev - curr
      break
    case '*':
      result = prev * curr
      break
    case '/':
      result = prev / curr
      break
  }
  return result.toString()
}

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTERGER_FORMATTER.format(integer)
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}



export default App;
