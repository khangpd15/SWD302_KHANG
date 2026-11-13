export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generate(questions, rng = Math.random) {
  const usage = Object.fromEntries(questions.map(q => [q.id, 0]));
  const chapters = [...new Set(questions.map(q => q.chapter))];
  return Array.from({ length: 20 }, (_, i) => {
    const ids = chapters.map(chapter => shuffle(questions.filter(q => q.chapter === chapter), rng)
      .sort((a, b) => usage[a.id] - usage[b.id])[0].id);
    ids.push(...shuffle(questions.filter(q => !ids.includes(q.id)).map(q => q.id), rng)
      .sort((a, b) => usage[a] - usage[b]).slice(0, 60 - ids.length));
    ids.forEach(id => usage[id]++);
    return { code: String(i + 1).padStart(2, '0'), ids: shuffle(ids, rng) };
  });
}

export function score(ids, answers, questions) {
  const map = new Map(questions.map(q => [q.id, q]));
  return {
    total: ids.length,
    answered: ids.filter(id => Number.isInteger(answers[id])).length,
    correct: ids.filter(id => answers[id] === map.get(id).answer).length,
    wrong: ids.filter(id => Number.isInteger(answers[id]) && answers[id] !== map.get(id).answer).length,
    blank: ids.filter(id => !Number.isInteger(answers[id])).length,
  };
}
