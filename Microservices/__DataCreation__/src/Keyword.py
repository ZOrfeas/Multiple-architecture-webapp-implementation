import datetime
import json
from connect import runQuery, curs

existingNames = set()

class Keyword:
    def __init__(self, name):
        self.name = name

    def getInsertTemplate(self):
        vals = '(%s)'
        return 'INSERT INTO "keywords"("name") VALUES {} RETURNING "id"'.format(vals)

    def getSecondInsertTemplate(self):
        vals = '(%s, %s)'
        return 'INSERT INTO "keywords"("id", "name") VALUES {} RETURNING "id"'.format(vals)

    def getPayload(self):
        return (self.name,)
    
    def getSecondPayload(self, id):
        return(id, self.name)

    def insert(self):
        idInserted = runQuery("ms-keywords", self.getInsertTemplate(), self.getPayload())[0]
        runQuery("ms-questions", self.getSecondInsertTemplate(), self.getSecondPayload(idInserted))
        return idInserted

def getExisting():
    queryString = 'SELECT "name" FROM "keywords"'
    curs["ms-keywords"].execute(queryString)
    existing = curs["ms-keywords"].fetchall()
    for tup in existing:
        name = tup[0]
        existingNames.add(name)

    
# temp = Keyword('kostas')
# temp.getExisting()