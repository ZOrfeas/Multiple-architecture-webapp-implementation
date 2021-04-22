export class Dummies {
  static user = {
    displayName: 'Kostas',
    email: 'kost.kost@kost.com',
    password: 'testpasswordhaha',
  };

  static keywordOfUser1 = {
    name: 'Test keyword with user',
    user: { id: 1 },
  };

  static keywordSimple = {
    name: 'Simple Keyword',
  };

  static question = {
    title: 'Test question',
    questContent: 'Does this work ?',
    user: { id: 1 },
    keywords: [{ id: 1 }, { id: 2 }],
  };

  static questionWithoutKeywords = {
    title: 'Test without keywords',
    questContent: 'I was wondering whether this works or not',
    user: { id: 1 },
  };

  static answer = {
    ansContent: 'I think it works, at least from my experience',
    user: { id: 1 },
    question: { id: 1 },
  };
}
