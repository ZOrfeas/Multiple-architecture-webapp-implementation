import json
from connect import runQuery

class User:
    def __init__(self, displayName, email, password):
        self.displayName = displayName
        self.email = email
        self.password = password
    
    @staticmethod
    def encode(password):
        return password

    @staticmethod
    def getInsertTemplate():
        return 'INSERT INTO "user"("displayName", "email", "password") VALUES (%s, %s, %s) RETURNING "id"' 

    def getPayload(self):
        return (self.displayName, self.email, self.encode(self.password))

    def insert(self):
        return runQuery(self.getInsertTemplate(), self.getPayload())[0]