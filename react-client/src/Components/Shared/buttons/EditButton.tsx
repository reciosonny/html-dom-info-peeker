import React from 'react'
import { RiPencilFill } from 'react-icons/ri';
import { EditButtonModel } from '../../../model/Shared';

const EditButton = ({ dataID, onClickEdit }: EditButtonModel) => {
  return (
    <button data-id={dataID} onClick={() => onClickEdit()}>
      <RiPencilFill color="#607D8B" />
    </button>
  )
}

export default EditButton