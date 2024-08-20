import React, { useState, useEffect, memo } from "react";
import MainModal from "../../Shared/modals/MainModal";
import SubmitButton from "../../Shared/buttons/SubmitButton";
import { v4 as uuidv4 } from "uuid";
import useLocalStorageStore from "../../../hooks/useLocalStorageStore";
import * as domUtils from "../../../utils/domUtils";
import TextInput from "../../Shared/inputs/TextInput";

const AnnotationPanel = memo(({ onRemoveAnnotation, onUpdatedAnnotation, targetElement }: AnnotationPanelModel) => {
  const [txtInput, setTxtInput] = useState("");
  const [annotationStore, setAnnotationStore] = useLocalStorageStore(
    "annotation",
    []
  );
  const [displayInput, setDisplayInput] = useState(false);

  useEffect(() => {
    const hasExistingAnnotations = domUtils.hasAnnotations(
      annotationStore,
      targetElement
    );
    if (hasExistingAnnotations) {
      const domIdentifier =
        domUtils.getUniqueElementIdentifierByTagAndIndex(targetElement);

      let existingAnnotation = annotationStore.filter(
        (obj: any) =>
          obj.domIndex === domIdentifier.index &&
          obj.elem === domIdentifier.elType
      );
      setTxtInput(existingAnnotation[0].title);
      setDisplayInput(hasExistingAnnotations);
    }

    return () => { };
  }, [annotationStore]);

  const onSubmitAnnotation = async (e: any) => {
    e.preventDefault();
    const domIdentifier =
      domUtils.getUniqueElementIdentifierByTagAndIndex(targetElement);
    const elId = targetElement.id;
    const randomCode = uuidv4();
    const duplicateIndex = annotationStore.findIndex(
      (obj: any) =>
        obj.domIndex === domIdentifier.index &&
        obj.elem === domIdentifier.elType
    );

    if (duplicateIndex !== -1) {
      if (txtInput.trim() !== "") {
        updateAnnotation(duplicateIndex, e);
      } else {
        removeAnnotation(duplicateIndex, e);
      }
    } else {
      addAnnotation(domIdentifier, randomCode, elId, e);
    }
    if (txtInput.trim() !== "") setDisplayInput(true);
  };

  const addAnnotation = async (domIdentifier: any, randomCode: string, elId: any, e: any) => {
    e.preventDefault();
    let annotationObj = {
      id: randomCode,
      title: txtInput || "",
      elem: domIdentifier.elType,
      elId,
      domIndex: domIdentifier.index,
      // link: window.location.href,
    };

    const newAnnotation = [...annotationStore, annotationObj];
    setAnnotationStore(newAnnotation);
    await onUpdatedAnnotation();
  };

  const updateAnnotation = async (duplicateIndex: number, e: any) => {
    e.preventDefault();
    const duplicateAnnotation = annotationStore.find(
      (idx: number) => idx === duplicateIndex
    );
    duplicateAnnotation.title = txtInput;

    setAnnotationStore(annotationStore);
    await onUpdatedAnnotation();
  };

  const removeAnnotation = async (duplicateIndex: number, e: any) => {
    e.preventDefault();
    const filteredAnnotation = annotationStore.filter(
      (idx: number) => idx !== duplicateIndex
    );

    setAnnotationStore(filteredAnnotation);
    await onRemoveAnnotation();
  };

  const onClickAnnotation = () => {
    setDisplayInput(false);
  };

  const onChangeText = (e: any) => {
    setTxtInput(e.target.value);
  };

  return (
    <MainModal type="annotation" onClose={() => { }}>
      {displayInput ? (
        <label className="annotation-header" onClick={() => onClickAnnotation()}>
          {txtInput}
        </label>
      ) : (
        <form>
          <TextInput
            userInput={txtInput}
            onChangeText={(e: any) => onChangeText(e)}
            placeHolder="The comment goes here"
          />
          <SubmitButton display="Submit" onClickSubmit={(e: any) => onSubmitAnnotation(e)} />
        </form>
      )}
    </MainModal>
  );
}
);

export default AnnotationPanel;
