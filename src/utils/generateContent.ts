const generateContent = async ({
  packageJson,
  folderStructure,
  mainFiles,
  userInput,
}: {
  packageJson: Record<string, any>;
  folderStructure: string[];
  mainFiles: string[];
  userInput: string;
}) => {
    // create new promise and resolve it after 2 seconds
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            // Simulate content generation based on the provided data
            const content = 'lol';
            return resolve(content);
        }, 2000);
    });

    
};

export default generateContent;
