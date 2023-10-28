import fs from 'fs';
// import marked from 'marked';

const inputFilePath = './races/RACE-0.md';
const outputFilePath = 'output.json';

const markdownContent = fs.readFileSync(inputFilePath, 'utf8');
const sections = markdownContent.split('---\n');

const questions = sections.map((section, index) => {
  const question = { PossibleAnswers: [] };
  const lines = section.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('**[Q')) {
      question.Question = line
    } else if (line.startsWith('**Context**')) {
      let context = '';
      while (i + 1 < lines.length && !lines[i + 1].startsWith('**[')) {
        context += lines[i + 1] + '\n';
        i++;
      }
      question.ContractSnippet = context.trim();
    } else if (line.startsWith('**[Answers]')) {
      const answers = line.replace(/\*\*\[Answers\]\s+/g, '').split(', ');
      question.CorrectAnswers = answers;
    } else if (line.startsWith('**Explanation**')) {
      let explanation = '';
      while (i + 1 < lines.length && !lines[i + 1].startsWith('**[')) {
        explanation += lines[i + 1] + ' ';
        i++;
      }
      question.Explanation = explanation.trim();
    } else if (line.startsWith('(')) {
      const choice = line.match(/\(([^)]+)\)/)[1];
      const answer = line.replace(/^\([^)]+\):\s/, '');
      question.PossibleAnswers.push({ choice, answer });
    }
  }

  return question;
});

fs.writeFileSync(outputFilePath, JSON.stringify(questions, null, 2));

console.log('Markdown content converted to JSON and saved in ' + outputFilePath);
