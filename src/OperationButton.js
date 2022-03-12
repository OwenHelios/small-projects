function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() => dispatch({ type: "INPUT_OPERATION", payload: { operation } })}
    >
      {operation == '/' ? '÷' : (operation == '*' ? '×' : operation)}
    </button>
  )
}

export default OperationButton