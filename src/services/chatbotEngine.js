/* Rule-based matcher for the FandomVerse Guide chatbot (no external AI API). */

const FALLBACK = {
  text: 'I can help you explore FandomVerse! You can ask about our 7 hubs (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga), characters, trailers, merchandise cart, or search.',
  action: { label: 'Explore All Categories', route: '#home' }
};

export function matchChatQuery(rawQuery, knowledgeBase = {}) {
  const query = rawQuery.toLowerCase();

  // 1. Direct question match
  const exact = knowledgeBase.predefinedQuestions?.find(q =>
    query.includes(q.question.toLowerCase()) || q.question.toLowerCase().includes(query)
  );
  if (exact) return { text: exact.answer, action: exact.action };

  // 2. Keyword trigger matching
  for (const kw of knowledgeBase.keywords || []) {
    if (kw.words.some(w => query.includes(w))) return { text: kw.response, action: kw.action };
  }

  // 3. Fallback
  return FALLBACK;
}
