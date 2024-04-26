# SystemError uses Python
SystemError is the name of [a team from Silicon Valley](https://www.robotevents.com/teams/VRC/21919A) competing at [VEX Robotics Competitions](https://www.vexrobotics.com/v5/competition/vrc-current-game). Besides designing and building a robot like the [Hero Bots](https://www.vexrobotics.com/v5/downloads/build-instructions#vexv5) from VEX, the team needs to program it for both manual control by a human driver with a [joystick](https://www.vexrobotics.com/276-4820.html), and for autonomous driving by the program alone.

The robot can be programmed in a variety of ways:
* in Blocks visual programming language (that resembles [Scratch](https://scratch.mit.edu/)) in a browser at [VEXcode V5](https://codev5.vex.com/),
* in [(Micro)Python](https://micropython.org/) with an [extension](https://www.vexrobotics.com/vexcode/vscode-extension) in [VS Code](https://code.visualstudio.com/) IDE (Integrated Development Environment),
* in C++ with the same extension in VS Code IDE.

We started with Blocks because it conveniently integrates robot sensors and controls, supports event-based logic, and does not require installation. It however has some downsides: lack of version control or ability for multiple people to work on the program together, and also developing more complex logic with visual programming is not as convenient as simply writing and copy-pasting the code.

Because of that, we switched to Python, and you can see the program for our robot in 2023-2024 season competition [Over Under](https://www.vexforum.com/t/2023-2024-vex-robotics-competition-over-under/113861) in the [newrobot GitHub repository](https://github.com/abpa123/newrobot/blob/main/src/main.py), along with the [README.md](https://github.com/abpa123/newrobot/blob/main/README.md) explaining it in great detail. The effort that went into that README.md let us win a VEX Robotics Competition Design Award at an earlier competition and qualified our team for the [California Region-2 (Silicon Valley) Middle School Championship](https://www.robotevents.com/robot-competitions/vex-robotics-competition/RE-VRC-23-3487.html#teams).

We did not advance further to the [World Championship 2024](https://recf.org/vex-robotics-world-championship/), and started thinking about our current setup and what we could be doing differently. Several things come to mind:
* breaking down the single monolithic main.py into multiple specialized Python [modules](https://docs.python.org/3/tutorial/modules.html), so that they can be recombined and used for different programs,
* telemetry, or logging events and control actions to an [SD card](https://kb.vex.com/hc/en-us/articles/20676091646100-Data-Logging-with-a-VEX-Brain-and-Sensors-Using-Python),
* replaying and fine-tuning the control actions,
* replacing [Controllers and Loops](https://education.vex.com/stemlabs/v5/stem-labs/loop-there-it-is/controllers-and-loops-python) with event-based logic (something that Blocks does well), and
* integrating [Inertial](https://www.vexrobotics.com/276-4855.html), [GPS](https://www.vexrobotics.com/276-7405.html) and [Vision](https://www.vexrobotics.com/276-4850.html) sensors.

This [telemetry GitHub repository](https://github.com/hatatat-dev/telemetry) is where we try making these changes, and more.

# Python modules with preprocessed.py
VEX expects the entire Python program for the robot to be in a single Python file, such as [main.py](https://github.com/abpa123/newrobot/blob/main/src/main.py) we used for Over Under season. As the program got more complex, that file grew longer, and became difficult to read and update. Also, robot often needs different strategies for autonomous, and that requires either making and reverting changes in that single file, or creating a copy, but then common changes need to be done multiple times, in each copy.

Maintenance of a growing program is a common task, and Python programming language supports breaking it into [modules](https://docs.python.org/3/tutorial/modules.html) that implement some logic once, and then can be imported into the main program with a single statement like
```
from vex import *
```
telling Python interpreter to find a module named vex, likely a file named `vex.py`, run the code from there, and then make all entities available in the current program.

With a full Python interpreter, it would be possible to similarly create separate files, like `pid.py` with custom [PID controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) code, and then make it available to the main program by importing that module with
```
from pid import *
```

That would help to keep the main file shorter, easier to read and update, and also allow creating multiple program files, each only containing the unique logic, and importing the common logic from the same module files, without the need to keep multiple copies.

The challenge here, as mentioned above, is that the [VS Code extension](https://www.vexrobotics.com/vexcode/vscode-extension) only knows to copy a single file to the robot, so any additional files with separate models, like the `pid.py` with pid module, will be left behind on the computer, and Python interpreter running on the robot will fail to import them.

One way to resolve that challenge is to use a microSD card: copy the `pid.py` onto one, insert it into robot's microSD card slot, and then have Python interpreter read it from there. That is not very convenient, as any changes to these shared modules now need to be copied to the robot manually, moving microSD card between computer and robot.

We decided to avoid use of microSD card, and instead "preprocess" the program on the computer before it is built and downloaded to the robot by VS Code extension. To do so, we wrote another Python program [scripts/preproces.py](https://github.com/hatatat-dev/telemetry/blob/main/scripts/preprocess.py) that
* takes the program filename, such as [programs/program_manual.py](https://github.com/hatatat-dev/telemetry/blob/main/programs/program_manual.py),
* parses it line-by-line, looking for `from <module> import *` statements,
* determines the filenames corresponding to the module names,
* substitutes the full content of the files for the import statements,
* writes the full "preprocessed" file into a separate program in build/preprocessed.py

To use it, we have a zsh / bash terminal open in VS Code, where we first run something like
```
scripts/preprocess.py programs/program_manual.py
```
that updates the build/preprocessed.py file. It should be possible to run it on Windows, too, but we haven't tried that yet.

That file is listed as the main Python program in [vex_project_settings.json](https://github.com/hatatat-dev/telemetry/blob/main/.vscode/vex_project_settings.json), so once generated, it can be built and downloaded to the robot, and run there, as a single file.

This approach has some inconveniences:
* the required preprocessing step before the deployment, one can forget to run it and then don't realize the robot is still running the earlier version,
* even though the input programs have different names, like [programs/program_manual.py](https://github.com/hatatat-dev/telemetry/blob/main/programs/program_manual.py) or [programs/program_simple.py](https://github.com/hatatat-dev/telemetry/blob/main/programs/program_simple.py), the preprocessed program is always called the same, including on the robot, which causes confusion,
* the same code is copied from the original modules to that preprocessed.py file, and someone may accidentally be making changes to the preprocessed.py file instead of the original, in which case they will be overwritten (discarded) the next time they run the preprocessing.

To avoid or at least recognize the accidental changes to the preprocessed.py file, the preprocessing tool marks that file as read-only. Also it adds a hexadecimal signature for the content of the file at the very top, so that it knows when there have been any manual changes, and refuses to overwrite them, unless explicitly requested.

# Logging records to a CSV file
Part of robotics competition is developing a program that makes robot perform some tasks, including driving and moving objects, autonomously, without being controlled by a human driver. In the Over Under season, our program had several functions with predefined sequences of actions, such as driving, turning by specific amount, spinning "intake" or "flywheel" motors, e.g. [score_matchload_close](https://github.com/abpa123/newrobot/blob/main/src/main.py#L365-L373) and [triball_one_close](https://github.com/abpa123/newrobot/blob/main/src/main.py#L375-L394). These functions were then combined in different ways for different autonomous strategies, such as when robot is placed [close to a goal](https://github.com/abpa123/newrobot/blob/main/src/main.py#L500-L509) or [far from it](https://github.com/abpa123/newrobot/blob/main/src/main.py#L512-L517).

These functions, with fixed numbers for distances, angles and durations, worked OK and let us get some points during competitions, but were limiting in several ways. First, we had to find these numbers through trial and error: run the program with some initial guess, see the difference between expected and actual position, change the numbers slightly, and repeat, many times. Second, having found one set of numbers for some task, we still had to repeat the search for another, or if robot configuration changed by e.g. mounting the intake or flywheel differently. Finally, the numbers are only approximate, and the actual distances traveled by the robot may change if parts of it bend or wear out.

For a future robot, we wanted to
1. install various [VEX sensors](https://kb.vex.com/hc/en-us/articles/4401967256596-Overview-of-the-VEX-V5-Sensors) onto the robot to guide the autonomous program, and
2. when running a program on the robot, log (save to a file) sensor readings and control actions for analysis.

That analysis would help us understand the relation between requested actions and actual changes to robot state. That relation we can then reverse and use to find what action we need to request to get the robot to a state we want.

For the format of the log file, we decided to use CSV, or [Comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values) file format. Usually it has a header line, with a list of the "column" names, and then - multiple lines with records, each with values, corresponding to these columns. Lists of column names and values are separated (or delimited) by commas, hence the name of the format.

In our case, we realized that different sensors would have different types of values: [GPS sensor](https://www.vexrobotics.com/276-7405.html), for example, would have heading and position on the field, while [Distance sensor](https://www.vexrobotics.com/276-4852.html), would have distance to an object and its size. We now had three options for how to represent the readings in the logs:
1. use separate files for different types of sensors, with unambiguous columns in each, or
2. use one file, with super-set of all columns, where any sensor reading can still be captured, or
3. use single file with generic column names like `arg_0`, `arg_1` with meaning that would depend on the sensor type for the record.

We went with option 3, and now sensor readings, control actions, and some other events are logged to the same CSV file as records, one per line, and you can see an example in [csvs/gps.csv](https://github.com/hatatat-dev/telemetry/blob/main/csvs/gps.csv). That file has the following specific columns, from [RecordHeader namedtuple](https://github.com/hatatat-dev/telemetry/blob/main/lib/record.py#L7-L10):
* `timestamp`, integer number of milliseconds since the start of the program run,
* `thread`, name or other unique identifier of an execution thread, such as `main`,
* `cls`, class of the entity reporting the record, such as `Inertial`,
* `name`, name of the entity instance reporting the record, such as `motor_lf`,
* `tag`, optional tag or label for the record,

and then a variable list of generic columns, `arg_0`, `arg_1`, ... `arg_19`, that are all integer or floating-point numbers, with the meaning specific to the record entity class. For example, for `Inertial` that is
* `arg_0` => `installed`,
* `arg_1` => `timestamp`,
* `arg_2` => `heading`,
* `arg_3` => `rotation`,
* `arg_4` => `is_calibrating`,
* `arg_5` => `orientation_roll`,
* `arg_6` => `orientation_pitch`,
* `arg_7` => `orientation_yaw`,
* `arg_8` => `gyro_rate_xaxis`,
* `arg_9` => `gyro_rate_yaxis`,
* `arg_10` => `gyro_rate_zaxis`,
* `arg_11` => `acceleration_xaxis`,
* `arg_12` => `acceleration_yaxis`,
* `arg_13` => `acceleration_zaxis`,
* `arg_14` => `turn_type`.

Note that as different records may have different number of `arg_*` columns, some CSV file viewers or editors, like the one in GitHub, may complain about the inconsistencies. Others, like [Google Sheets](https://sheets.google.com/), [Apple Numbers](https://www.apple.com/numbers/), or [Rainbow CSV extension for VS Code](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) simply ignore the missing values.

# GPS Field Setup
[GPS Sensor](https://www.vexrobotics.com/276-7405.html) works by tracking black-and-white patterns on the perimeter of the field, installed following [the instructions](https://kb.vex.com/hc/en-us/articles/4402678201620-Mounting-the-GPS-Field-Code-Strips). The diagram below shows `(x_position, y_position), heading°` GPS readings for the four sides of the field in our garage:

```
                 garage door

              (-1800, 0), 270°

                      |
                      |
(0, -1800), 180°  ----+----  (0, 1800), 0°
                      |
                      |
 
               (1800, 0), 90°
```