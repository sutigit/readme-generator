import * as vscode from "vscode";
import generateContent from "./utils/generateContent";
import showMessage from "./utils/errorMessage";
import getPackageJsonData from "./utils/getPackageJsonData";
import getFolderStructure from "./utils/getFolderStructure";
import getMainFiles from "./utils/getMainFiles";

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
        showMessage(
          "information",
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
        showMessage(
          "warning",
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
        prompt:
          "Describe your project or the README content you want to generate",
        placeHolder: "My awesome project",
      });

      /**
       *
       * Validate user input
       *
       */
      const trimmedInput = userInput?.trim();
      if (!trimmedInput) {
        showMessage(
          "information",
          "Prompt was not entered. Operation canceled."
        );
        return;
      }
      if (trimmedInput.length > 500) {
        showMessage(
          "warning",
          "Input too long. Please shorten it. Max 500 characters."
        );
        return;
      }
      const safeInput = trimmedInput.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
      if (!/^[a-zA-Z0-9\s.,'-]+$/.test(safeInput)) {
        showMessage(
          "error","Input contains invalid characters.");
        return;
      }

      /**
       *
       *
       * Generate README.md content from user input, package.json, folder structure, and main files.
       *
       */
      const content = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification, // or .Window or .SourceControl
          title: "Generating README.md content...",
          cancellable: true,
        },
        async (progress) => {
          progress.report({ increment: 0 });

          /**
           *
           * Parse package.json
           */
          const packageJsonData = await getPackageJsonData();
          if (!packageJsonData) {
            showMessage(
              "error",
              "Failed to read package.json. Please ensure it exists in the workspace."
            );
            return;
          }
          progress.report({ increment: 10 });

          /**
           *
           * Parse folder structure
           */
          const folderStructure = await getFolderStructure();
          if (!folderStructure) {
            showMessage(
              "error",
              "Failed to read folder structure. Please ensure you have access to the workspace."
            );
            return;
          }
          progress.report({ increment: 30 });

          /**
           *
           * Parse main files
           */
          const mainFiles = await getMainFiles();
          if (!mainFiles) {
            showMessage(
              "error",
              "Failed to read main files. Please ensure you have access to the workspace."
            );
            return;
          }
          progress.report({ increment: 50 });

          /**
           *
           * Generate the content
           */
          const data = await generateContent({
            apiKey,
            packageJson: {},
            folderStructure: [],
            mainFiles: [],
            userInput: safeInput,
          });
          if (!data) {
            showMessage(
              "error",
              "Failed to generate content. Please try again."
            );
            return;
          }
          progress.report({ increment: 100 });

          
          return data;
        }
      );

      /**
       *
       * Generate text on the point of the cursor in the README.md file
       *
       */
      const position = editor.selection.active;
      editor.edit((editBuilder) => {
        editBuilder.insert(position, content!);
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when extension is deactivated
export function deactivate() {}
