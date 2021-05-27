import psycopg2

def readConfig(filename='config.prm'):
    params = {}
    with open(filename, 'r') as openFile:
        lines = openFile.readlines()
        for line in lines:
            [key,val] = line.split("=")
            params[key] = val.strip()
    for key in ['host', 'database', 'user', 'password', 'port']:
        if key not in params:
           raise Exception('{} key is missing'.format(key))
    return params

print('Connecting to the PostgreSQL database...')
try:
    conn = psycopg2.connect(**readConfig())
    cur = conn.cursor()
except(Exception, psycopg2.DatabaseError) as e:
    print(e)
    exit(1)

def runQuery(queryString, params = None):
    try:
        if params is None: cur.execute(queryString)
        else: cur.execute(queryString, params)
        return cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as e:
        print(e)
        exit(1)

def runManyQueries(queryString, paramList):
    try:
        cur.executemany(queryString, paramList)
        # return cur.fetchall()
    except (Exception, psycopg2.DatabaseError) as e:
        print(e)
        exit(1)

def commit():
    conn.commit()
    return

def closeConn():
    conn.commit()
    cur.close()
    conn.close()
    return
