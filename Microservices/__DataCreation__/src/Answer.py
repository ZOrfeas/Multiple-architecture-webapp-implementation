import datetime
import json
from connect import runQuery

class Answer:
    def __init__(self, content, userId, questionId, insertionDate):
        """insertionDate should be a datetime object"""
        self.content = content
        self.userId = userId
        self.questionId = questionId
        self.insertionDate = insertionDate

    @staticmethod
    def getInsertTemplate():
        return 'INSERT INTO "answers"("ansContent", "createdAt", "user_id", "question_id", "updatedAt") VALUES (%s, %s, %s, %s, %s) RETURNING "id"'

    def getPayload(self):
        return (self.content, self.insertionDate, self.userId, self.questionId, datetime.datetime.now())

    def insert(self):
        return runQuery("ms-answers", self.getInsertTemplate(), self.getPayload())[0]
