import React from 'react'
import { OptionsButtonModel } from '../../../model/Shared'

const OptionsButton = ({ children, onClick }: OptionsButtonModel) => {
  return (
    <button style={{ fontSize: "20px" }} onClick={() => onClick()}>
      {children}
    </button>
  )
}

export default OptionsButton