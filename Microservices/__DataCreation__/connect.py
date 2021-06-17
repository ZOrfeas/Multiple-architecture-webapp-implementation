import psycopg2

databases = ["ms-questions", "ms-answers", "ms-keywords", "ms-auth"]

def readConfig(db_name, filename='config.prm'):
    params = {}
    with open(filename, 'r') as openFile:
        lines = openFile.readlines()
        for line in lines:
            [key,val] = line.split("=")
            params[key] = val.strip()
    params["database"] = db_name
    for key in ['host', 'database', 'user', 'password', 'port']:
        if key not in params:
           raise Exception('{} key is missing'.format(key))
    return params

configs = {db_name:readConfig(db_name) for db_name in databases}

print('Connecting to the PostgreSQL database...')
try:
    # conns = {db_name:(configs[db_name]) for db_name in configs}
    conns = {db_name:psycopg2.connect(**configs[db_name]) for db_name in configs}
    curs = {db_name:conns[db_name].cursor() for db_name in conns}
except(Exception, psycopg2.DatabaseError) as e:
    print(e)
    exit(1)
# for key,val in conns.items():
#     print(key,":",val)

def runQuery(db_name, queryString, params = None):
    try:
        if params is None: curs[db_name].execute(queryString)
        else: curs[db_name].execute(queryString, params)
        return curs[db_name].fetchone()
    except (Exception, psycopg2.DatabaseError) as e:
        print(e)
        exit(1)

def runManyQueries(db_name, queryString, paramList):
    try:
        curs[db_name].executemany(queryString, paramList)
        # return curs[db_name].fetchall()
    except (Exception, psycopg2.DatabaseError) as e:
        print(e)
        exit(1)

def commit(db_name):
    conns[db_name].commit()
    return

def closeConn(db_name):
    conns[db_name].commit()
    curs[db_name].close()
    conns[db_name].close()
    return

def closeAllCons():
    for db_name in conns:
        closeConn(db_name)
