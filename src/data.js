import data from './data/questions.json';
import tips from './data/tips.json';
export const { questions, chapters } = data;
export const questionMap = new Map(questions.map(q => [q.id, q]));
export const tipFor = q => q.tip || tips[q.chapter]?.[q.number - 1] || '';
export const chapterTitle = id => chapters.find(c => c.id === id)?.title || '';
export function filterQuestions(list, search, chapter) {
  const query = search.trim().toLocaleLowerCase('vi');
  return list.filter(q => (!chapter || q.chapter === Number(chapter)) &&
    `${q.text} ${q.options.join(' ')} ${tipFor(q)}`.toLocaleLowerCase('vi').includes(query));
}
