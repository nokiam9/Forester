# -*- coding: utf-8 -*-
import os 

MONGODB_SETTINGS = {'DB': 'cmccb2b',
                    'host': os.getenv('MONGODB_URI'),  # 0.0.0.0 for local | mongo for docker
                    'connect': False  # set for pymongo bug fix
                    }
SECRET_KEY = "flask+mongoengine=<3"     # flask-debug必须设置该参数，为session提供加密处理

# DEBUG_TB_INTERCEPT_REDIRECTS = False
