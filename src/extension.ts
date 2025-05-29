import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('readme-generator.generate', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor || !editor.document.fileName.endsWith('README.md')) {
            vscode.window.showInformationMessage('Open a README.md file to use this command.');
            return;
        }

        // Ask user for input
        const userInput = await vscode.window.showInputBox({
            prompt: 'Enter the text to insert into the README.md',
            placeHolder: 'e.g., 🚀 Hello, world!',
        });

        // If user cancels or inputs nothing
        if (!userInput) {
            vscode.window.showInformationMessage('Prompt was not entered. Operation canceled.');
            return;
        }

        // Insert user input at the current cursor position
        const position = editor.selection.active;
        editor.edit(editBuilder => {
            editBuilder.insert(position, `\n\n${userInput}`);
        });
    });

    context.subscriptions.push(disposable);
}
