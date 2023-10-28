import fs from "fs";
const directoryPath = "./races";

try {
  const files = fs.readdirSync(directoryPath).sort();
  console.log("List of files in the directory:", files);
  let data = [];
  files.forEach((file, index) => {
    const markdownContent = fs.readFileSync(`races/${file}`, "utf8");
    const sections = markdownContent.split("---\n");
    let note = null;
    if (sections[0].startsWith("**Note")) {
      note = sections[0].split("---")[0];
    }
    const questions = sections.map((section, index) => {
      const question = {  question: "", context: "", possibleAnswers: [], correctAnswers: [] };
      const lines = section.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // If there is a note --> global context
        if (note) {
          question.context = note;
        }
        // get the question
        if (line.startsWith("**[Q")) {
          console.log(line)
          question.question = line;
          // get the context
        } else if (line.startsWith("**Context**")) {
          let context = "";
          while (i + 1 < lines.length && !lines[i + 1].startsWith("(")) {
            context += lines[i + 1] + "\n";
            i++;
          }
          question.context = context.trim();
          // get the answer
        } else if (line.startsWith("**[Answers]")) {
          const answers = line
            .replace(/\*\*\[Answers\]\s+/g, "")
            .split(", ")
            .map((el) => el.replace("**", ""));
          question.correctAnswers = answers;
        } else if (line.match(/\D[A-Z]\D:/)) {
          const choice = line.match(/\(([^)]+)\)/)[1];
          const answer = line.replace(/^\([^)]+\):\s/, "");
          question.possibleAnswers.push({ choice, answer });
        } else {
          continue;
        }
      }
      if (question.question === "" || question.context === "" || question.possibleAnswers.length === 0 || question.correctAnswers.length === 0) {
        console.log(question, file)
        return null;
      }
      return question;
    }).filter(el => el!== null);
    data = [...data, ...questions];
  });
  console.log(`There are ${data.length} questions`)
  fs.writeFileSync(`data.json`, JSON.stringify(data, null, 2));
} catch (err) {
  console.error("Error reading directory:", err);
}
