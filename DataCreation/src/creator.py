import random
import datetime
from faker import Faker
from faker.providers import profile
##
from src.Keyword import Keyword, getExisting, existingNames
from src.Question import Question
from src.Answer import Answer
from src.User import User
from connect import runQuery,closeConn,commit

## Instantiate Faker
fakeGenerator = Faker()
fakeGenerator.add_provider(profile)

def addUsers(count):
    addedUsers = []
    with open("usernames_passwords.txt", "a") as outFile:
        outFile.write("=============={}==============\n".format(datetime.datetime.now()))
        for __ in range(count):
            displayName = fakeGenerator.profile(fields=['username'])["username"]
            email = fakeGenerator.safe_email()
            password = bytes(fakeGenerator.pystr(), 'ascii')
            id = User(displayName, email, password).insert()
            addedUsers.append(id)
            outFile.write(str(id) + '\t' + email + '\t' + password.decode('utf-8') + '\n')
    return addedUsers
def addKeywords(count, userIds):
    addedKeywords = []
    temp = min(len(userIds)//10, count//10) 
    usersWithKeywords = random.sample(userIds, temp + 1)
    index = 0
    for __ in range(count):
        name = fakeGenerator.word()
        while name in existingNames:
            name = fakeGenerator.word()
        existingNames.add(name)
        if index < len(usersWithKeywords): 
            id = Keyword(name, usersWithKeywords[index]).insert()
            index += 1
        else:
            id = Keyword(name).insert()
        addedKeywords.append(id)
    return addedKeywords
def addQuestions(count, userIds, keywordIds):
    addedQuestions = []
    for __ in range(count):
        title = fakeGenerator.sentence()
        content = ' '.join(fakeGenerator.sentence() for __ in range(random.randint(10,15)))
        userId = random.choice(userIds)
        keywordList = random.sample(keywordIds,random.randint(0,5))
        insertionDate = fakeGenerator.date_time_between(start_date='-7y')
        id = Question(title, content, userId, keywordList, insertionDate).insert()
        addedQuestions.append(id)
    return addedQuestions
def addAnswers(count, userIds, questionIds):
    addedAnswers = []
    for __ in range(count):
        content = ' '.join(fakeGenerator.sentence() for __ in range(random.randint(15,19)))
        userId = random.choice(userIds)
        questionId = random.choice(questionIds)
        insertionDate = fakeGenerator.date_time_between(start_date='-7y')
        id = Answer(content, userId, questionId, insertionDate).insert()
        addedAnswers.append(id)
    return addedAnswers

def main(args = [20, 40, 30, 50], debug = False):
    entities = ['user', 'keyword', 'question', 'answer']
    amounts = {entity: args[i] for i,entity in enumerate(entities)}
###
    print('=============================================')
    print("Adding users...")
    addedUserIds = addUsers(amounts['user'])
    print("Added {} users with ids:".format(len(addedUserIds)))
    print(addedUserIds)
###
    print('=============================================')
    print("Adding keywords...")
    getExisting()
    addedKeywordIds = addKeywords(amounts['keyword'], addedUserIds)
    print("Added {} keyword with ids:".format(len(addedKeywordIds)))
    print(addedKeywordIds)
###
    print('=============================================')
    print("Adding questions...")
    addedQuestionIds = addQuestions(amounts['question'], addedUserIds, addedKeywordIds)
    print("Added {} questions with ids:".format(len(addedQuestionIds)))
    print(addedQuestionIds)
###
    print('=============================================')
    print("Adding answers...")
    addedAnswerIds = addAnswers(amounts['answer'], addedUserIds, addedQuestionIds)
    print("Added {} answers with ids:".format(len(addedAnswerIds)))
    print(addedAnswerIds)
###
    ## commit changes and close connection
    closeConn()

# def main(args = [20, 40, 30, 50], debug = False):
#     temp = Keyword('kostas')
#     temp.getExisting()