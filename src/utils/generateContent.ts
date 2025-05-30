import OpenAI from "openai";

const generateContent = async ({
  apiKey,
  packageJson,
  folderStructure,
  mainFiles,
  userInput,
}: {
  apiKey: string;
  packageJson: Record<string, any>;
  folderStructure: string[];
  mainFiles: string[];
  userInput: string;
}) => {
  try {
    const client = new OpenAI({
      apiKey
    });
  
    const response: OpenAI.Responses.Response = await client.responses.create({
      model: "gpt-4.1",
      instructions:
        "You are a README.md generator. Use the provided information to create a comprehensive README.md file.",
      input: userInput,
    });

    return response.output_text;

  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

export default generateContent;
