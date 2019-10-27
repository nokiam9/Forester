#!/usr/local/bin/python3

import os
import sys
import time
import subprocess
from pymongo import MongoClient

uri = os.getenv(str(sys.argv[1]), "mongodb://localhost:27017")
# uri = "mongdb://root:forester@forester-mongo:27017"

print('Get MONGODB_URI from envirment: ' + str(uri))
client = MongoClient(uri, connect=False) 

while 1:
    print(u"Connect with {0}".format(uri))
    try:
        client.admin.command('ismaster')
        break
    except:
        print(u"Failed and retry after 5s...")
        time.sleep(5)

command = sys.argv[2:]
print('Run command: ' + str(command))

# command必须是list类型，而非string
subprocess.call(command)

os._exit(0)