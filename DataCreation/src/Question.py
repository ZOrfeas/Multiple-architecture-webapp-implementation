import json
from connect import runManyQueries, runQuery

class Question:
    def __init__(self, title, content, userId, keywordsList, insertionDate):
        self.title = title
        self.content = content
        self.userId = userId
        self.keywordsList = keywordsList
        self.insertionDate = insertionDate

    @staticmethod
    def getInsertQTemplate():
        return 'INSERT INTO "question"("title", "questContent", "askedOn", "user_id") VALUES (%s, %s, %s, %s) RETURNING "id"' 
    @staticmethod
    def getInsertRelTemplate():
        return 'INSERT INTO "question_keywords_keyword"("questionId", "keywordId") VALUES (%s, %s)'

    def getPayload(self):
        return (self.title, self.content, self.insertionDate, self.userId)

    def insert(self):
        q_id = runQuery(self.getInsertQTemplate(), self.getPayload())[0]
        if self.keywordsList:
            paramList = [(q_id, k_id) for k_id in self.keywordsList]
            runManyQueries(self.getInsertRelTemplate(), paramList)
        return q_id
