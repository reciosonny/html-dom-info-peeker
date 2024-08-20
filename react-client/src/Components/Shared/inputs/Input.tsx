import React, { useEffect, useRef } from 'react'
import { InputModel } from '../../../model/Shared';

const Input = ({ userInput = "", onChangeText, placeHolder = "Input Here" }: InputModel) => {
  const txtInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      txtInputRef.current.focus();
    }, 300);
    return () => { };
  }, []);

  return (
    <input
      className='input-panel'
      placeholder={placeHolder}
      ref={txtInputRef}
      value={userInput}
      onChange={onChangeText}
    />
  )
}

export default Input