#!/usr/bin/env -S PYTHONPATH=. python3

from lib.tele import *
from lib.brain import *
from lib.log import *

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

sleep(2000)
close_log()
