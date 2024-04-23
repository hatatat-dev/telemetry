# SystemError Uses Python
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

# preprocessed.py
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

The challenge here, as mentioned above, is that the [VS Code extension](https://www.vexrobotics.com/vexcode/vscode-extension) only knows to copy a single file to the robot, so any additional files with separate models, like the `pid.py` with pid, will be left behind on the computer, and Python interpreter running on the robot will fail to import them.

One way to resolve that challenge is to use a microSD card: copy the `pid.py` onto one, insert it into robot's microSD card slot, and then have Python interpreter read it from there. That is not very convenient, as any changes to these shared modules now need to be copied to the robot manually, moving microSD card between computer and robot.

We decided to avoid use of microSD card, and instead "preprocess" the program on the computer before it is built and downloaded to the robot by VS Code extension. To do so, we wrote another Python program [preproces.py](https://github.com/hatatat-dev/telemetry/blob/main/preprocess.py) that
* takes the program filename, such as [shared/program_manual.py](https://github.com/hatatat-dev/telemetry/blob/main/shared/program_manual.py),
* parses it line-by-line, looking for `from <module> import *` statements,
* determines the filenames corresponding to the module names,
* substitutes the full content of the files for the import statements,
* writes the full "preprocessed" file into a separate program in shared/preprocessed.py

To use it, we have a zsh / bash terminal open in VS Code, where we first run something like
```
./preprocess.py shared/program_manual.py
```
that updates the shared/preprocessed.py file. It should be possible to run it on Windows, too, but we haven't tried that yet.

That file is listed as the main Python program in [vex_project_settings.json](https://github.com/hatatat-dev/telemetry/blob/main/.vscode/vex_project_settings.json), so once generated, it can be built and downloaded to the robot, and run there, as a single file.

This approach has some inconveniences:
* the required preprocessing step before the deployment, one can forget to run it and then don't realize the robot is still running the earlier version,
* even though the input programs have different names, like [shared/program_manual.py](https://github.com/hatatat-dev/telemetry/blob/main/shared/program_manual.py) or [shared/program_simple.py](https://github.com/hatatat-dev/telemetry/blob/main/shared/program_simple.py), the preprocessed program is always called the same, including on the robot, which causes confusion,
* the same code is copied from the original modules to that preprocessed.py file, and someone may accidentally be making changes to the preprocessed.py file instead of the original, in which case they will be overwritten (discarded) the next time they run the preprocessing.

To avoid or at least recognize the accidental changes to the preprocessed.py file, the preprocessing tool marks that file as read-only. Also it adds a hexadecimal signature for the content of the file at the very top, so that it knows when there have been any manual changes, and refuses to overwrite them, unless explicitly requested.

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