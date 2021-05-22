from faker import Faker
##
from src.Keyword import Keyword
from src.Question import Question
from src.Answer import Answer
from src.User import User
from connect import runQuery,closeConn,commit

## Instantiate Faker
fakeGenerator = Faker()

def addUsers(count):
    return [1]
def addKeywords(count, userIds):
    return [2]
def addQuestions(count, userIds, keywordIds):
    return [3]
def addAnswers(count, userIds, questionIds):
    return [4]

def main(args = [20, 30, 40, 50], debug = False):
    entities = ['user', 'question', 'keyword', 'answer']
    amounts = {entity: args[i] for i,entity in enumerate(entities)}

    print("Adding users...")
    addedUserIds = addUsers(amounts['user'])
    print("Adding keywords...")
    addedKeywordIds = addKeywords(amounts['keyword'], addedUserIds)
    print("Adding questions...")
    addedQuestionIds = addQuestions(amounts['question'], addedUserIds, addedKeywordIds)
    print("Adding answers...")
    addedAnswerIds = addAnswers(amounts['answer'], addedUserIds, addedQuestionIds)

    print("Added users with ids:")
    print(addedUserIds)
    print("Added keyword with ids:")
    print(addedKeywordIds)
    print("Added questions with ids:")
    print(addedQuestionIds)
    print("Added answers with ids:")
    print(addedAnswerIds)
    ## commit changes and close connection
    closeConn()

################################################################################################

# temp = Question("its a title", "its some question", 1, [1,2,3,4])
# res = temp.insert()
# print(res.text)