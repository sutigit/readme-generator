import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "readme-generator.generate",
    async () => {

      /**
       * 
       * Check if the active text editor is open and if the file is a README.md
       * 
       */
      const editor = vscode.window.activeTextEditor;
      if (!editor || !editor.document.fileName.endsWith("README.md")) {
        vscode.window.showInformationMessage(
          "Open a README.md file to use this command."
        );
        return;
      }

      /**
       * 
       * Check if the OpenAI API key is set in the workspace settings
       * 
       */
      const config = vscode.workspace.getConfiguration("readme-generator");
      const apiKey = config.get<string>("openaiApiKey");
      if (!apiKey) {
        vscode.window.showWarningMessage(
          "Please set your OpenAI API key in settings to use this feature."
        );
        return;
      }

      /**
       * 
       * Prompt the user for input to generate the README.md content
       * 
       */
      const userInput = await vscode.window.showInputBox({
        prompt: "Enter some descriptive prompt to start generating README.md",
        placeHolder: "My awesome project",
      });
      if (!userInput) {
        vscode.window.showInformationMessage(
          "Prompt was not entered. Operation canceled."
        );
        return;
      }


      /**
       * 
       * Generate text on the point of the cursor in the README.md file
       * 
       */
      const position = editor.selection.active;
      editor.edit((editBuilder) => {
        editBuilder.insert(position, `\n\n${userInput}`);
      });
    }
  );

  context.subscriptions.push(disposable);
}
