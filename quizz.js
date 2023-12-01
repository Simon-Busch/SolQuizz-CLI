import { readFileSync } from "fs";
import { confirm, checkbox } from "@inquirer/prompts";
const advancedQuestions = JSON.parse(readFileSync("data.json", "utf8"));
const basicQuestions = JSON.parse(readFileSync("basic.json", "utf8"));

const mapping = {
  "A": 0,
  "B": 1,
  "C": 2,
  "D": 3,
}

const askQuestion = async (choices) => {
  const answer = await checkbox({
    message:
      "Select the files you want in scope, press enter to validate selection",
    choices: choices,
  });
  return answer;
};

const continuePrompt = async () => {
  const play = await confirm({ message: "Do you want to continue?" });
  if (play) {
    await promptQuestion();
  }
};

async function promptQuestion(isBasic) {
  let questionDataSet = isBasic ? advancedQuestions : basicQuestions;
  const totalQuestions = questionDataSet.length;

  const randomIndex = Math.floor(Math.random() * questionDataSet.length);
  const question = questionDataSet[randomIndex];

  const choices = question.possibleAnswers.map((answer) => ({
    name: `${answer.choice}: ${answer.answer}`,
    value: answer.choice,
  }));
  console.log(question.context);
  console.log("\x1b[34m===========================");
  console.log("\x1b[1m\x1b[32m" + question.question);
  console.log("\x1b[34m===========================");
  console.log("\x1b[0m");

  let answer;
  answer = await askQuestion(choices);
  while (!answer || answer.length === 0) {
    answer = await askQuestion(choices);
  }

  const correctAnswers = question.correctAnswers;
  const isCorrect =
    answer.every((choice) => correctAnswers.includes(choice)) &&
    answer.length === correctAnswers.length;

  if (isCorrect) {
    console.log("\x1b[32mCorrect 🎉")
    console.log("\x1b[0m")

  } else {
    console.log("\x1b[31mIncorrect. The correct answer is: " + correctAnswers.join(", "));
    console.log(question.possibleAnswers[mapping[correctAnswers[0]]].answer)
    console.log("\x1b[0m")
  }
  await continuePrompt();
}

async function init() {
  console.log("\x1b[34m===========================");
  console.log("\x1b[1m\x1b[32m Welcome to");
  console.log("\x1b[1m\x1b[32m Sol Quizz");
  console.log("\x1b[34m===========================");
  const play = await confirm({ message: "Do you want to play?" });

  if (play) {
    const level = await checkbox({
      message: "Do you want basic or advanced questions ?",
      choices: [
        { name: "basic", value: "basic" },
        { name: "advanced", value: "advanced" },
      ],
    });
    await promptQuestion(level === "basic");
  }
}

init();
