import { createInterface } from 'readline';
import { readFileSync } from 'fs';

import select from "@inquirer/select";
import { input, confirm, checkbox } from "@inquirer/prompts";
// import { prompt } from "@inquirer";
const inputFilePath = 'data.json';
const questions = JSON.parse(readFileSync(inputFilePath, 'utf8'));

const askQuestion = async (choices) => {
  const answer = await checkbox({
    message: "Select the files you want in scope, press enter to validate selection",
    choices: choices,
  });
  return answer
}


async function promptQuestion() {
  console.log("Welcome to Secureum Races quizz");

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  const choices = question.possibleAnswers.map(answer => ({
    name: `${answer.choice}: ${answer.answer}`,
    value: answer.choice,
  }));
  console.log(question.context)
  console.log("===========================")
  console.log("===========================")
  console.log(question.question)
  console.log("===========================")
  console.log("===========================")

  console.log("correct:" , question.correctAnswers)
  let answer;
  answer = await askQuestion(choices)
  while (!answer|| answer.length === 0) {
    answer = await askQuestion(choices)
  }

  const correctAnswers = question.correctAnswers;
  const isCorrect = answer.every(choice => correctAnswers.includes(choice)) &&
  answer.length === correctAnswers.length;

  if (isCorrect) {
    console.log('Correct!');
  } else {
    console.log('Incorrect. The correct answer is: ' + correctAnswers.join(', '));
  }

  const play = await confirm({ message: 'Do you want to continue?' });
  if (play) {
    await promptQuestion()
  }
}


async function init() {
  const play = await confirm({ message: 'Do you want to play?' });
  if (play) {
    await promptQuestion()
  }
}

init();
