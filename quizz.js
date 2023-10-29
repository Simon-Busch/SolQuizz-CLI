import { readFileSync } from "fs";
import { confirm, checkbox } from "@inquirer/prompts";
const advancedQuestions = JSON.parse(readFileSync("data.json", "utf8"));
const basicQuestions = JSON.parse(readFileSync("basic.json", "utf8"));

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
  console.log("Welcome to Secureum Races quizz");
  let questionDataSet = isBasic ? advancedQuestions : basicQuestions;

  const randomIndex = Math.floor(Math.random() * questionDataSet.length);
  const question = questionDataSet[randomIndex];

  const choices = question.possibleAnswers.map((answer) => ({
    name: `${answer.choice}: ${answer.answer}`,
    value: answer.choice,
  }));
  console.log(question.context);
  console.log("===========================");
  console.log("===========================");
  console.log(question.question);
  console.log("===========================");
  console.log("===========================");

  console.log("correct:", question.correctAnswers);
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
    console.log("Correct!");
  } else {
    console.log(
      "Incorrect. The correct answer is: " + correctAnswers.join(", ")
    );
  }
  await continuePrompt();
}

async function init() {
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
