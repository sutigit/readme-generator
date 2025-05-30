import * as vscode from 'vscode';

const showMessage = (type: 'error' | 'warning' | 'information' ,msg: string) => {
    switch (type) {
        case 'error':
            vscode.window.showErrorMessage(msg);
            break;
        case 'warning':
            vscode.window.showWarningMessage(msg);
            break;
        case 'information':
            vscode.window.showInformationMessage(msg);
            break;
        default:
            break;
    }
};

export default showMessage;