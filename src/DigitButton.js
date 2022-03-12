function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: "INPUT_DIGIT", payload: { digit } })}
    >
      {digit}
    </button>
  );
}

export default DigitButton;
