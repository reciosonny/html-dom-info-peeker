import React from 'react'
import { FaTrash } from 'react-icons/fa';
import { DeleteButtonModel } from '../../../model/Shared';

const DeleteButton = ({ dataID, onClickDelete }: DeleteButtonModel) => {
  return (
    <button data-id={dataID} onClick={(e: any) => onClickDelete(e)}>
      <FaTrash color="#607D8B" />
    </button>
  )
}

export default DeleteButton