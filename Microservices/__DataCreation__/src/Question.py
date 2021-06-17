import datetime
import json
from connect import runManyQueries, runQuery

class Question:
    def __init__(self, title, content, userId, keywordsList, insertionDate):
        """insertionDate should be a datetime object"""
        self.title = title
        self.content = content
        self.userId = userId
        self.keywordsList = keywordsList
        self.insertionDate = insertionDate

    @staticmethod
    def getInsertQTemplate():
        return 'INSERT INTO "questions"("title", "questContent", "createdAt", "user_id", "updatedAt") VALUES (%s, %s, %s, %s, %s) RETURNING "id"' 
    @staticmethod
    def getInsertRelTemplate():
        return 'INSERT INTO "question_keywords_keyword"("questionId", "keywordId") VALUES (%s, %s)'
    @staticmethod
    def getSecondInsertRelTemplate():
        return 'INSERT INTO "question_keywords_keywords"("questionId", "keywordId") VALUES (%s, %s)'

    def getPayload(self):
        return (self.title, self.content, self.insertionDate, self.userId, datetime.datetime.now())

    def insert(self):
        q_id = runQuery("ms-questions", self.getInsertQTemplate(), self.getPayload())[0]
        if self.keywordsList:
            paramList = [(q_id, k_id) for k_id in self.keywordsList]
            runManyQueries("ms-questions", self.getInsertRelTemplate(), paramList)
            runManyQueries("ms-keywords", self.getSecondInsertRelTemplate(), paramList)
        return q_id
