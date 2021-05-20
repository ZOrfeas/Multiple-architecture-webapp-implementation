import requests
import json

hostname = 'saas-15.ddns.net'
port = 3000
debug = False

# https://httpbin.org/post
def post(url, payload):
    if not debug:
        print(json.dumps(payload))
        res = requests.post(url, data=json.dumps(payload), headers={"content-type":"application/json"})
    else:
        res = requests.post('https://httpbin.org/post', data=json.dumps(payload), headers={"content-type":"application/json"})
    return res

class User:
    def __init__(self, displayName, email, password):
        self.displayName = displayName
        self.email = email
        self.password = password
        global hostname
        global port
        self.url = "http://" + hostname + ":" + str(port) + "/user"

    def createPayload(self):
        return dict(
            displayName = self.displayName,
            email = self.email,
            password = self.password
        )

    def insert(self):
        return post(self.url, self.createPayload())

class Question:
    def __init__(self, title, content, userId, keywordsList):
        self.title = title
        self.content = content
        self.userId = userId
        self.keywordsList = keywordsList
        global hostname
        global port
        self.url = "http://" + hostname + ":" + str(port) + "/question"

    def createPayload(self):
        return dict(
            title = self.title,
            questContent = self.content,
            user = dict( id = self.userId ),
            keywords = [dict( id = i ) for i in self.keywordsList]
        )

    def insert(self):
        return post(self.url, self.createPayload())

class Answer:
    def __init__(self, content, userId, questionId):
        self.content = content
        self.userId = userId
        self.questionId = questionId
        global hostname
        global port
        self.url = "http://" + hostname + ":" + str(port) + "/answer"

    def createPayload(self):
        return dict(
            ansContent = self.content,
            user = dict( id = self.userId ),
            question = dict( id = self.questionId ),
        )

    def insert(self):
        return post(self.url, self.createPayload())

class Keyword:
    def __init__(self, name, userId = None):
        self.name = name
        self.userId = userId
        global hostname
        global port
        self.url = "http://" + hostname + ":" + str(port) + "/keyword"

    def createPayload(self):
        if not self.userId:
            return dict( name = self.name )
        else:
            return dict(
                name = self.name,
                user = dict( id = self.userId ),
            )

    def insert(self):
        return post(self.url, self.createPayload())

temp = Question("its a title", "its some question", 1, [1,2,3,4])
res = temp.insert()
print(res.text)