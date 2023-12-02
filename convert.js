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
      note = sections[0]
        .split("---")[0]
        .replace(
          "**Note:** All 8 questions in this RACE are based on the below contract. This is the same contract you will see for all the 8 questions in this RACE. The question is below the shown contract.",
          "*"
        )
        .replace(
          "**Note**: All 8 questions in this quiz are based on the _InSecureumToken_ contract shown below. This is the same contract you see for all the 8 questions in this quiz.",
          ""
        );
    }
    const questions = sections
      .map((section, index) => {
        const question = {
          question: "",
          context: "",
          possibleAnswers: [],
          correctAnswers: [],
          race: ""
        };
        const lines = section.split("\n");
        for (let i = 0; i < lines.length; i++) {
          question.race = file;
          const line = lines[i].trim();
          // If there is a note --> global context
          if (note) {
            question.context = note;
          }
          // get the question
          if (line.startsWith("**[Q")) {
            question.question = line.replace("**[Q", "").replace("**", "").replace("**", "");
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
            const answers = line.split("nswers]");

            const clean = answers[1]
              .replace(": ", "")
              .split(",")
              .map((el) => el.replace("**", "").trim());
            // TODO handle [ 'B', 'C or A', 'B', 'C or A', 'B', 'C', 'D or D' ]
            question.correctAnswers = clean;
          } else if (
            line.startsWith("(A):") ||
            line.startsWith("(B):") ||
            line.startsWith("(C):") ||
            line.startsWith("(D):")
          ) {
            const choice = line.match(/\(([^)]+)\)/)[1];
            let answer = line.replace(/^\([^)]+\):\s/, "");

            let j = i + 1;
            while (j < lines.length && !lines[j].startsWith("(")) {
                if (!lines[j].trim().includes("[Answers]")) {
                  answer += ' ' + lines[j].trim() + "\n";
                }
                j++;
            }

            question.possibleAnswers.push({ choice, answer });
          } else {
            continue;
          }
        }
        if (
          question.question === "" ||
          question.context === "" ||
          question.possibleAnswers.length === 0 ||
          question.correctAnswers.length === 0
        ) {
          return null;
        }
        return question;
      })
      .filter((el) => el !== null);
    data = [...data, ...questions];
  });
  console.log(`There are ${data.length} questions`)
  fs.writeFileSync(`data.json`, JSON.stringify(data, null, 2));
} catch (err) {
  console.error("Error reading directory:", err);
}
