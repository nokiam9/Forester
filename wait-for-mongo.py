# -*- coding: utf-8 -*-

import argparse
import os
import time
import sys
import subprocess
import pymongo

DEFALUT_URI = os.getenv("MONGODB_URI", default="mongodb://localhost:27017")
DEFAULT_TIMELIMIT = 30


def get_parse():
    parser = argparse.ArgumentParser()

    parser.add_argument("--uri", type=str, default=DEFALUT_URI,
                        help=u"Mongodb URI, default get from $MONGODB_URI")
    parser.add_argument("-t", "--timeout", type=int, default=DEFAULT_TIMELIMIT,
                        help=u"set waiting time with seconds, default is {0}".format(DEFAULT_TIMELIMIT))
    parser.add_argument("-q", "--quiet", action="store_true",
                        help=u"set quiet mode without output, default is False")
    parser.add_argument("command", nargs="?",
                        help=u"Command should be excuted after starting Mongo")
    parser.add_argument("args", nargs=argparse.REMAINDER,
                        help=u"Arguments for this command, if existed")

    return parser


if __name__ == '__main__':
    mongo_ready = False
    start_time = time.time()

    parser = get_parse()
    args = parser.parse_args()
    uri = args.uri
    is_quiet = args.quiet
    time_limit = args.timeout
    cmd = args.command
    cmd_args = args.args

    if not is_quiet:
        print(args)
        
    if time_limit < 0:
        print(u"Error: parament timeout {0} is out of range.".format(
            str(time_limit)), file=sys.stderr)
        sys.exit(-2)

    client = pymongo.MongoClient(uri, connect=False)
    while time.time() < start_time + time_limit:
        if not is_quiet:
            print(u"Connect with {0}".format(uri))
        try:
            ret = client.admin.command('ismaster')
            if not is_quiet:
                print(ret)
            mongo_ready = True
            break
        except:
            if not is_quiet:
                print(u"Failed to connect MongoDB and retry after 3s...")
            time.sleep(3)

    if mongo_ready:
        if cmd is not None and len(cmd) > 0:
            if not is_quiet:
                print('Process to command line: {0}'.format([cmd] + cmd_args))
            try:
                subprocess.call([cmd] + cmd_args)
            except:
                pass
    else:
        if not is_quiet:
            print(u"Wait-for-mongo failed and exit with -1.", file=sys.stderr)
        sys.exit(-1)
