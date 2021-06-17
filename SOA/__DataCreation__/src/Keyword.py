import json
from connect import runQuery, cur

existingNames = set()

class Keyword:
    def __init__(self, name, userId = None):
        self.name = name
        self.userId = userId

    def getInsertTemplate(self):
        vals = '(%s, %s)' if self.userId is not None else '(%s, DEFAULT)'
        return 'INSERT INTO "keyword"("name", "user_id") VALUES {} RETURNING "id"'.format(vals)

    def getPayload(self):
        return (self.name, self.userId) if self.userId else (self.name,)

    def insert(self):
        return runQuery(self.getInsertTemplate(), self.getPayload())[0]

def getExisting():
    queryString = 'SELECT "name" FROM "keyword"'
    cur.execute(queryString)
    existing = cur.fetchall()
    for tup in existing:
        name = tup[0]
        existingNames.add(name)

    
# temp = Keyword('kostas')
# temp.getExisting()