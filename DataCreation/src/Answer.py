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
        return 'INSERT INTO "answer"("ansContent", "answeredOn", "user_id", "question_id") VALUES (%s, %s, %s, %s) RETURNING "id"'

    def getPayload(self):
        return (self.content, self.insertionDate, self.userId, self.questionId)

    def insert(self):
        return runQuery(self.getInsertTemplate(), self.getPayload())[0]
