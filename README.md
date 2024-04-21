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