#!/usr/bin/env python3

from tele import *
from brain import *
from log import *

open_log("threads.csv")


def func_a():
    sleep(100)
    print(456)


def func_b():
    sleep(50)
    print(321)
    sleep(100)
    print(654)


sleep(20)
thread_a = TeleThread(func_a, (), "thread_a")
sleep(30)
thread_b = TeleThread(func_b, (), "thread_b")
