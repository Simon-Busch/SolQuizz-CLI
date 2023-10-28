import { createInterface } from 'readline';
import { readFileSync } from 'fs';

const inputFilePath = 'data.json';
const questions = JSON.parse(readFileSync(inputFilePath, 'utf8'));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  question.possibleAnswers.forEach((answer) => {
    console.log(`${answer.choice}: ${answer.answer}`);
  });

  console.log(question.correctAnswers)
  rl.question('Your choice: ', (userChoice) => {
    const correctAnswers = question.correctAnswers[0].split(',');
    const isCorrect = correctAnswers.includes(userChoice.toUpperCase());
    if (isCorrect) {
      console.log('Correct!');
    } else {
      console.log('Incorrect. The correct answer is: ' + correctAnswers.join(', '));
    }

    rl.question('Do you want to try another question? (yes/no): ', (answer) => {
      if (answer.toLowerCase() === 'yes') {
        promptQuestion();
      } else {
        console.log('Thank you for playing! Goodbye.');
        rl.close();
      }
    });
  });
}

promptQuestion();
