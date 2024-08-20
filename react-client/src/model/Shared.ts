//Buttons
export interface CloseButtonModel {
    onClickClose: () => void;
}

export interface DeleteButtonModel {
    dataID?: string;
    onClickDelete: (e: any) => void;
}

export interface EditButtonModel {
    dataID?: string;
    onClickEdit: () => void;
}

export interface OptionsButtonModel {
    children: any;
    onClick: () => void;
}

export interface SubmitButtonModel {
    display: any;
    onClickSubmit: (e: any) => void;
}

export interface SwitchButtonModel {
    display: any;
}

//Inputs
export interface InputModel {
    userInput: string;
    onChangeText: any;
    placeHolder: string;
}

export interface TextInputModel {
    userInput: string;
    onChangeText: any;
    placeHolder: string;
}

//Modals
export interface MainModalModel {
    children: any;
    type?: string;
    headerText?: string;
    onClose: () => void;
}
