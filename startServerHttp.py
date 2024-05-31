
# -*- coding: utf-8 -*-
# !/usr/bin/python

import os
# 获取当前脚本所在的目录
curDir = os.path.dirname(os.path.realpath(__file__))
# 目标目录，即'server'目录
targetDir = os.path.join(curDir, 'server')
# 切换到目标目录
os.chdir(targetDir)
os.system("npm run http-start")