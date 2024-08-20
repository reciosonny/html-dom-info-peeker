import React, { useState, useEffect, useRef } from 'react'
import { TextInputModel } from '../../../model/Shared';

const TextInput = ({ userInput = "", onChangeText, placeHolder = "Input Here" }: TextInputModel) => {
  const txtInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      txtInputRef.current.focus();
    }, 300);
    return () => { };
  }, []);

  return (
    <textarea
      className='text-area-panel'
      placeholder={placeHolder}
      ref={txtInputRef}
      value={userInput}
      onChange={onChangeText}
    />
  )
}

export default TextInput