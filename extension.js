// Based on vexrobotics.vexcode-0.5.0/dist/extension.js
// Licensed under MIT License
// Original Copyright (c) 2022 VEX Robotics

var mi = Object.create;
var To = Object.defineProperty;
var ui = Object.getOwnPropertyDescriptor;
var gi = Object.getOwnPropertyNames;
var vi = Object.getPrototypeOf,
  fi = Object.prototype.hasOwnProperty;
var hi = (y, t) => {
    for (var e in t) To(y, e, { get: t[e], enumerable: !0 });
  },
  fs = (y, t, e, o) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let s of gi(t))
        !fi.call(y, s) &&
          s !== e &&
          To(y, s, {
            get: () => t[s],
            enumerable: !(o = ui(t, s)) || o.enumerable,
          });
    return y;
  };
var L = (y, t, e) => (
    (e = y != null ? mi(vi(y)) : {}),
    fs(
      t || !y || !y.__esModule
        ? To(e, "default", { value: y, enumerable: !0 })
        : e,
      y,
    )
  ),
  xi = (y) => fs(To({}, "__esModule", { value: !0 }), y);
var zi = {};
hi(zi, { activate: () => Hi, deactivate: () => Wi });
module.exports = xi(zi);
var Ys = L(require("vscode"));
var d = L(require("vscode"));
var g = L(require("vscode")),
  Uo = L(require("path"));
var Kt = L(require("vscode"));
var ct = L(require("fs")),
  Bt = L(require("child_process")),
  lt = L(require("path")),
  zo = L(require("os")),
  bi = "1.0.5",
  h = class {
    constructor(t, e, o) {
      (this._exeName = lt.basename(t)),
        (this._exePath = t),
        (this._exeParentPath = lt.dirname(t)),
        (this._devPath = e || ""),
        (this._queOptions = o || { active: !0, maxCmds: 0 }),
        this._checkFilePermissions();
    }
    vmDownload(t) {
      let e = "";
      if (t) {
        e = `--progress --python="${t}" ${this._devPath}`;
        let o = this.checkFile(t, e, h.CommandID.downloadPythonVM);
        if (o.exitCode !== h.ExitCode.vexSucess) return o;
      } else e = "--progress --python";
      return this._runVexcomCMD(e, h.CommandID.downloadPythonVM);
    }
    recoverFromDFU(t) {
      let e = "";
      return (
        (e = `--json --dfu=${t.toLowerCase()}`),
        this._runVexcomCMD(e, h.CommandID.recoverDFU)
      );
    }
    sytemUpdate(t, e = !1) {
      let o = "";
      e
        ? (o = `--quiet --progress --json --vexos-full --vexos "${t}" ${this._devPath}`)
        : (o = `--quiet --progress --json --vexos "${t}" ${this._devPath}`);
      let s = this.checkFile(t, o, h.CommandID.systemUpdate);
      return s.exitCode !== h.ExitCode.vexSucess
        ? new Promise((r) => r(s))
        : this._runVexcomCMD(o, h.CommandID.systemUpdate);
    }
    systemInfo() {
      let t = `--json ${this._devPath}`;
      return this._runVexcomCMD(t, h.CommandID.systemInfo);
    }
    controllerRadioFirmwareUpdate(t, e = !1) {
      let o = "";
      e
        ? (o = `--progress --json --ctrl-fw "${t}" ${this._devPath}`)
        : (o = `--progress --json --ctrl-fw "${t}" ${this._devPath}`);
      let s = this.checkFile(t, o, h.CommandID.controllerRadioUpdate);
      return s.exitCode !== h.ExitCode.vexSucess
        ? new Promise((r) => r(s))
        : this._runVexcomCMD(o, h.CommandID.controllerRadioUpdate);
    }
    controllerAtmelFirmwareUpdate(t) {
      let e = "";
      e = `--progress --json --atmel-fw "${t}" ${this._devPath}`;
      let o = this.checkFile(t, e, h.CommandID.controllerUsbUpdate);
      return o.exitCode !== h.ExitCode.vexSucess
        ? new Promise((s) => s(o))
        : this._runVexcomCMD(e, h.CommandID.controllerUsbUpdate);
    }
    systemStatus() {
      let t = `--status ${this._devPath}`;
      return this._runVexcomCMD(t, h.CommandID.systemStatus);
    }
    downloadUserProgram(
      t,
      e,
      o,
      s = h.SLOT.slot1,
      r = !1,
      n = !1,
      a = h.DownloadChannel.vexNoChannel,
    ) {
      let c = "";
      r
        ? (c = ` --name "${t}" --slot ${s} --write "${o}" --progress --json --run`)
        : (c = ` --name "${t}" --slot ${s} --write "${o}" --progress --json`),
        (c += ` ${a}`),
        n && (c += " --progress"),
        e &&
          (c += ` --description ${Buffer.from(e, "binary").toString("base64")}`),
        (c += ` ${this._devPath}`);
      let l = this.checkFile(o, c, h.CommandID.downloadUserProgram);
      return l.exitCode !== h.ExitCode.vexSucess
        ? new Promise((p) => p(l))
        : this._runVexcomCMD(c, h.CommandID.downloadUserProgram);
    }
    eraseUserProgram(t) {
      let e = `--erase "${t}" ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.erase);
    }
    downloadPythonVM(t) {
      let e;
      if (t) {
        e = `${this._devPath} --python="${t}" --json --progress`;
        let o = this.checkFile(t, e, h.CommandID.downloadPythonVM);
        if (o.exitCode !== h.ExitCode.vexSucess)
          return new Promise((s) => s(o));
      } else e = `${this._devPath} --python --json --progress`;
      return this._runVexcomCMD(e, h.CommandID.downloadPythonVM);
    }
    stop() {
      let t = `--stop ${this._devPath}`;
      return this._runVexcomCMD(t, h.CommandID.stop);
    }
    play(t = h.SLOT.slot1) {
      let e = `--slot ${t} --run ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.play);
    }
    screenGrab(t) {
      let e = `--screen "${t}" ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.screenGrab);
    }
    batteryMedic() {
      let t = `--medic ${this._devPath}`;
      return this._runVexcomCMD(t, h.CommandID.batteryMedic);
    }
    setRobotName(t) {
      let e = `--robot "${t}" ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.setName);
    }
    setTeamNumber(t) {
      let e = `--team "${t}" ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.setTeam);
    }
    uploadEventLog(t = 1e3) {
      let e = `--eventlog ${t} --progress --json ${this._devPath}`;
      return this._runVexcomCMD(e, h.CommandID.uploadEventLog);
    }
    openUserPort(t) {
      let e = `--quiet --user ${t}`;
      return this._runVexcomUserCMD(e, h.CommandID.userPort);
    }
    listUSB(t) {
      let e = "--usb",
        o = !!t;
      return this._runVexcomCMD(e, h.CommandID.listUSB, o, t);
    }
    custom(t) {
      return this._runVexcomCMD(t, h.CommandID.custom);
    }
    getVersion() {
      let t = "--version --json";
      return this._runVexcomCMD(t, h.CommandID.vexcomVersion);
    }
    apiVersion() {
      return bi;
    }
    static getErrorCodeDetails(t) {
      return hs.get(t) ? hs.get(t) : `(${t}) Unknown Error Code`;
    }
    checkFile(t, e, o) {
      let s = {
        cmdID: o,
        cmdStr: `${lt.basename(this._exeParentPath)} ${e}`,
        stderr: "",
        stdout: "",
        exitCode: h.ExitCode.vexSucess,
      };
      if (!ct.existsSync(t))
        return (s.exitCode = h.ExitCode.vexAPIErrorFilePath), s;
      let n = [];
      switch (o) {
        case h.CommandID.downloadPythonVM:
          n = ["bin"];
          break;
        case h.CommandID.downloadUserProgram:
          n = ["bin", "py"];
          break;
        case h.CommandID.systemUpdate:
          n = ["vexos"];
          break;
        case h.CommandID.controllerRadioUpdate:
        case h.CommandID.controllerUsbUpdate:
          n = ["vexos"];
          break;
        default:
          n = [];
          break;
      }
      let a = lt.basename(t).split("."),
        c = a[a.length - 1];
      return (
        n.includes(c) || (s.exitCode = h.ExitCode.vexAPIErrorFileExtension), s
      );
    }
    _checkFilePermissions() {
      if (zo.type() === "Linux") {
        let t = ct.statSync(this._exePath);
        (t.mode & 4095) !== 493 &&
          (console.log(
            "CHMOD",
            new TextDecoder().decode(
              Bt.spawnSync(`chmod 755 ${this._exePath}`, { shell: !0 }).stderr,
            ),
          ),
          (t = ct.statSync(this._exePath)),
          console.log("New File Permission", (t.mode & 4095).toString(8)));
      } else if (zo.type() === "Darwin") {
        let t = lt.dirname(this._exePath),
          e = ct.readdirSync(t),
          o = [];
        o.push(this._exePath),
          o.forEach((s) => {
            let r = ct.statSync(s);
            (r.mode & 4095) !== 493 &&
              (console.log(
                "CHMOD",
                new TextDecoder().decode(
                  Bt.spawnSync(`chmod 755 ${this._exePath}`, { shell: !0 })
                    .stderr,
                ),
              ),
              (r = ct.statSync(this._exePath)),
              console.log(
                `${lt.basename(s)}: Updated File Permission`,
                (r.mode & 4095).toString(8),
              ));
          });
      } else {
        let t = ct.statSync(this._exePath);
        (t.mode & 4095) !== 438 &&
          (console.log(
            "CHMOD",
            new TextDecoder().decode(
              Bt.spawnSync(`chmod +x ${this._exePath}`, { shell: !0 }).stderr,
            ),
          ),
          (t = ct.statSync(this._exePath)),
          console.log("New File Permission", (t.mode & 4095).toString(8)));
      }
    }
    _splitArgString(t) {
      let e = [];
      return (
        t.split(/\s/).forEach((o) => {
          (o !== "" || o !== "") && e.push(o);
        }),
        e
      );
    }
    _runVexcomCMD(t, e = h.CommandID.unknown, o = !1, s = void 0) {
      let r = this,
        n = this._exeParentPath;
      if (!ct.existsSync(this._exeParentPath)) {
        this._onErrorRecieved(
          e,
          Number(
            `${h.getErrorCodeDetails(h.ExitCode.vexAPIVexcomMissing)} ${n}`,
          ),
          r,
        ),
          this._onExitRecieved(e, h.ExitCode.vexAPIVexcomMissing, r);
        let c = {
          cmdID: e,
          cmdStr: `${this._exeName} ${t}`,
          stderr: "",
          stdout: "",
          exitCode: h.ExitCode.vexAPIVexcomMissing,
        };
        return new Promise((l) => {
          l(c);
        });
      }
      let a = (c, l) => {
        let p = e,
          f = `${this._exeName} ${t}`,
          U,
          P = "",
          x = "",
          $ = !1,
          N = {};
        (N.cwd = this._exeParentPath),
          (N.PATH = this._exeParentPath + lt.delimiter + process.env.PATH);
        let F = { cwd: this._exeParentPath, shell: !0, env: N };
        o
          ? (r._vexcomCP = Bt.spawn(
              "echo",
              this._splitArgString(`"${s}" | sudo -S ${this._exeName} ${t}`),
              F,
            ))
          : (r._vexcomCP = Bt.spawn(this._exeName, this._splitArgString(t), F)),
          r._vexcomCP.stdout.on("data", function (k) {
            (x += k), r._onDataRecieved(p, k, r);
          }),
          r._vexcomCP.stderr.on("data", function (k) {
            (P += new TextDecoder().decode(k)), r._onErrorRecieved(p, k, r);
          }),
          r._vexcomCP.on("exit", function (k) {
            p === h.CommandID.systemInfo &&
              console.log(`ON EXIT - exit code: ${k}
`),
              (U = setTimeout(() => {
                let W = {
                  cmdID: p,
                  cmdStr: f,
                  stderr: P,
                  stdout: x,
                  exitCode: h.ExitCode.vexCMDTimeoutNoCloseEventRecieved,
                };
                c(W);
              }, 2e3));
          }),
          r._vexcomCP.on("close", function (k) {
            clearTimeout(U),
              p === h.CommandID.systemInfo &&
                console.log(`ON Close - exit code: ${k}
`),
              r._onExitRecieved(p, k, r),
              c({ cmdID: p, cmdStr: f, stderr: P, stdout: x, exitCode: k });
          });
      };
      return this._queOptions.active
        ? ft.enqueue(() => new Promise((c, l) => a(c, l)), e, t)
        : new Promise((c, l) => a(c, l));
    }
    _runVexcomUserCMD(t, e = h.CommandID.unknown) {
      let o = this;
      o._vexcomUserCP = void 0;
      let s = this._exePath;
      if (!ct.existsSync(this._exePath)) {
        this._onErrorRecieved(
          e,
          Number(
            `${h.getErrorCodeDetails(h.ExitCode.vexAPIVexcomMissing)} ${s}`,
          ),
          o,
        ),
          this._onExitRecieved(e, h.ExitCode.vexAPIVexcomMissing, o);
        let a = {
          cmdID: e,
          cmdStr: `${this._exeName} ${t}`,
          stderr: "",
          stdout: "",
          exitCode: h.ExitCode.vexAPIVexcomMissing,
        };
        return [
          void 0,
          new Promise((c) => {
            c(a);
          }),
        ];
      }
      let r = (a, c, l) => {
          let p = {};
          (p.cwd = this._exeParentPath),
            (p.PATH = this._exeParentPath + lt.delimiter + process.env.PATH);
          let f = { cwd: this._exeParentPath, shell: !0, env: p },
            U = Bt.spawn(this._exeName, this._splitArgString(t), f);
          a(U);
        },
        n = async (a, c, l, p) => {
          let f = e,
            U = `${lt.basename(l._exePath)} ${t}`,
            P = "";
          (l._vexcomUserCP = await p),
            l._vexcomUserCP.stdout.on("data", function (x) {
              console.log(new TextDecoder().decode(x)),
                l._onUserDataRecieved(f, x, l);
            }),
            l._vexcomUserCP.stderr.on("data", function (x) {
              console.log(P),
                (P += new TextDecoder().decode(x)),
                l._onErrorRecieved(f, x, l);
            }),
            l._vexcomUserCP.on("exit", function (x) {
              l._onExitRecieved(f, x, l),
                a({ cmdID: f, cmdStr: U, stderr: P, stdout: "", exitCode: x });
            });
        };
      if (this._queOptions.active) {
        let a,
          c = ft.enqueueGeneric(
            () => new Promise((p, f) => r(p, f, o)),
            h.CommandID.userPortCPStart,
          ),
          l = ft.enqueue(() => new Promise((p, f) => n(p, f, o, c)), e, t);
        return [c, l];
      }
    }
    on(t, e) {
      switch (t) {
        case "UserRX":
          this.onUserRxFuncHandle = e;
          break;
        case "Data":
          this.onDataFuncHandle = e;
          break;
        case "Error":
          this.onErrorFuncHandle = e;
          break;
        case "Exit":
          this.onExitFuncHandle = e;
          break;
      }
    }
    _onUserDataRecieved(t, e, o) {
      o?.onUserRxFuncHandle && o.onUserRxFuncHandle(t, e);
    }
    _onDataRecieved(t, e, o) {
      o?.onDataFuncHandle && o?.onDataFuncHandle(t, e.toString());
    }
    _onErrorRecieved(t, e, o) {
      o?.onErrorFuncHandle &&
        o.onErrorFuncHandle(t, new TextDecoder().decode(e));
    }
    _onExitRecieved(t, e, o) {
      o?.onExitFuncHandle && o.onExitFuncHandle(t, e);
    }
    get activeCommand() {
      let t = {
        cmdID: h.CommandID.vexcom_doing_nothing,
        promiseFunc: () => {},
        reject: void 0,
        resolve: void 0,
      };
      return ft.activeCmd ? ft.activeCmd : t;
    }
  };
((s) => {
  let y;
  ((P) => (
    (P[(P.slot1 = 1)] = "slot1"),
    (P[(P.slot2 = 2)] = "slot2"),
    (P[(P.slot3 = 3)] = "slot3"),
    (P[(P.slot4 = 4)] = "slot4"),
    (P[(P.slot5 = 5)] = "slot5"),
    (P[(P.slot6 = 6)] = "slot6"),
    (P[(P.slot7 = 7)] = "slot7"),
    (P[(P.slot8 = 8)] = "slot8")
  ))((y = s.SLOT || (s.SLOT = {})));
  let t;
  ((Z) => (
    (Z.vexcom_doing_nothing = "Doing nothing"),
    (Z.unknown = "Unknown CMD"),
    (Z.custom = "Custom CMD"),
    (Z.play = "Play"),
    (Z.stop = "Stop"),
    (Z.erase = "Erase"),
    (Z.downloadUserProgram = "User Program Download"),
    (Z.downloadPythonVM = "Python VM Download"),
    (Z.systemUpdate = "Vexos Update"),
    (Z.controllerUsbUpdate = "Controller Usb Update"),
    (Z.controllerRadioUpdate = "Controller Radio Update"),
    (Z.recoverDFU = "Recover Brain in DFU Mode"),
    (Z.batteryMedic = "Battery Medic"),
    (Z.uploadEventLog = "Upload Event Log"),
    (Z.setName = "Set Robot Name"),
    (Z.setTeam = "Set Team Name"),
    (Z.vexcomVersion = "Vexcom Version"),
    (Z.systemInfo = "System Info"),
    (Z.systemStatus = "System Status"),
    (Z.listUSB = "List USB"),
    (Z.screenGrab = "Screen Grab"),
    (Z.userPortCPStart = "User Port - Start Child Process"),
    (Z.userPort = "User Port - Result")
  ))((t = s.CommandID || (s.CommandID = {})));
  let e;
  ((R) => (
    (R[(R.vexCMDTimeoutNoCloseEventRecieved = -11)] =
      "vexCMDTimeoutNoCloseEventRecieved"),
    (R[(R.vexCMDTimeout = -10)] = "vexCMDTimeout"),
    (R[(R.vexCMDQueueSize = -9)] = "vexCMDQueueSize"),
    (R[(R.vexCMDQueueDownloadActive = -8)] = "vexCMDQueueDownloadActive"),
    (R[(R.vexAPIErrorOS = -7)] = "vexAPIErrorOS"),
    (R[(R.vexAPIErrorFileExtension = -6)] = "vexAPIErrorFileExtension"),
    (R[(R.vexAPIErrorFilePath = -5)] = "vexAPIErrorFilePath"),
    (R[(R.vexAPIVexcomAlive = -4)] = "vexAPIVexcomAlive"),
    (R[(R.vexAPIVexcomMissing = -3)] = "vexAPIVexcomMissing"),
    (R[(R.vexcomPlaceHolder2 = -2)] = "vexcomPlaceHolder2"),
    (R[(R.vexcomPlaceHolder1 = -1)] = "vexcomPlaceHolder1"),
    (R[(R.vexSucess = 0)] = "vexSucess"),
    (R[(R.vexError = 1)] = "vexError"),
    (R[(R.vexErrorAlive = 2)] = "vexErrorAlive"),
    (R[(R.vexErrorVersion = 3)] = "vexErrorVersion"),
    (R[(R.vexErrorCmd = 4)] = "vexErrorCmd"),
    (R[(R.vexErrorDevice = 5)] = "vexErrorDevice"),
    (R[(R.vexErrorPort = 6)] = "vexErrorPort"),
    (R[(R.vexErrorParam = 7)] = "vexErrorParam"),
    (R[(R.vexErrorVEXOS = 8)] = "vexErrorVEXOS")
  ))((e = s.ExitCode || (s.ExitCode = {})));
  let o;
  ((c) => (
    (c.vexNoChannel = ""),
    (c.vexPitChannel = "--chan 0 "),
    (c.vexDownloadchannel = "--chan 1 ")
  ))((o = s.DownloadChannel || (s.DownloadChannel = {})));
})(h || (h = {}));
var hs = new Map([
    [-11, "Vexcom command timeout, No Stdio closed event recieved"],
    [-10, "Vexcom command timeout, Vexcom Command killed"],
    [-9, "Max command queue limit reach, Vexcom Command Dropped"],
    [-8, "Vexcom Download Command in progress, Vexcom Command Dropped"],
    [-7, "Vexcom is not supported on this OS"],
    [-6, "Passed file extension is not supported"],
    [-5, "Passed file does not exist at directory"],
    [-4, "Vexcom alive message timeout"],
    [-3, "Vexcom Utillity is missing"],
    [0, "VEX Success"],
    [1, "VEX Error"],
    [2, "VEX Alive Error"],
    [3, "VEX Version Error"],
    [4, "VEX Command Error"],
    [5, "VEX Device Error"],
    [6, "VEX Port Error"],
    [7, "VEX Parameter Error"],
    [8, "VEX VEXOS Error"],
  ]),
  Ne = class {
    static setOptions(t) {
      Ne.options = t;
    }
    static enqueue(t, e, o) {
      return Ne.options.maxCmds && this.queue.length >= this.options.maxCmds
        ? new Promise((s) =>
            s({ cmdID: e, cmdStr: o, stderr: "", stdout: "", exitCode: -9 }),
          )
        : Ne?.activeCmd?.cmdID === "Vexos Update" ||
            Ne?.activeCmd?.cmdID === "User Program Download" ||
            Ne?.activeCmd?.cmdID === "Python VM Download" ||
            Ne?.activeCmd?.cmdID === "Controller Radio Update" ||
            Ne?.activeCmd?.cmdID === "Controller Usb Update"
          ? new Promise((s) =>
              s({ cmdID: e, cmdStr: o, stderr: "", stdout: "", exitCode: -8 }),
            )
          : new Promise((s, r) => {
              Ne.queue.push({
                promiseFunc: t,
                resolve: s,
                reject: r,
                cmdID: e,
              }),
                Ne.dequeue();
            });
    }
    static enqueueGeneric(t, e) {
      return new Promise((o, s) => {
        Ne.queue.push({ promiseFunc: t, resolve: o, reject: s, cmdID: e }),
          Ne.dequeue();
      });
    }
    static dequeue() {
      if (Ne?.pendingPromise) return !1;
      let t = Ne.queue.length ? Ne.queue.shift() : void 0;
      if (((Ne.activeCmd = t), !t)) return !1;
      try {
        (Ne.pendingPromise = !0),
          t
            .promiseFunc(t.resolve, t.reject)
            .then((e) => {
              (Ne.pendingPromise = !1), t.resolve(e), Ne.dequeue();
            })
            .catch((e) => {
              (Ne.pendingPromise = !1), t.reject(e), Ne.dequeue();
            });
      } catch (e) {
        (Ne.pendingPromise = !1), t.reject(e), Ne.dequeue();
      }
      return !0;
    }
  },
  ft = Ne;
(ft.options = { active: !1, maxCmds: 0 }),
  (ft.queue = []),
  (ft.pendingPromise = !1),
  (ft.activeCmd = {
    cmdID: "Doing nothing",
    promiseFunc: () => {},
    reject: void 0,
    resolve: void 0,
  });
var J = L(require("vscode")),
  dt = L(require("os")),
  io = L(require("path")),
  rt = L(require("fs")),
  Cs = L(require("unzipper"));
var xs = L(require("crypto")),
  Co = L(require("fs")),
  ko = L(require("path"));
var A = class {
  constructor(t) {
    this._serialPort = t;
  }
  async restartTerminal() {
    let t;
    return (
      (t = await this._send3DAICMD(
        this.getRunCMD("systemctl restart serial-getty@ttyGS0.service", "") +
          `
`,
        A.Commands.run,
      )),
      t
    );
  }
  clearRxBufferCMD() {
    let t = { command: A.Commands.clear };
    return this._send3DAICMD(
      JSON.stringify(t) +
        `
`,
      A.Commands.clear,
    );
  }
  sendAlive() {
    let t = { command: A.Commands.isAlive };
    return this._send3DAICMD(
      JSON.stringify(t) +
        `
`,
      A.Commands.isAlive,
    );
  }
  setAccessPointSSID(t) {
    let e = { command: A.Commands.setSSID, name: `${t}` };
    return this._send3DAICMD(
      JSON.stringify(e) +
        `
`,
      A.Commands.setSSID,
    );
  }
  setAccessPointPassword(t) {
    let e = { command: A.Commands.setPassword, password: t };
    return this._send3DAICMD(
      JSON.stringify(e) +
        `
`,
      A.Commands.setPassword,
    );
  }
  getDeviceInfo(t) {
    let e = { command: A.Commands.deviceInfo, appList: t || [] };
    return this._send3DAICMD(
      JSON.stringify(e) +
        `
`,
      A.Commands.deviceInfo,
    );
  }
  getCheckElevateCMD() {
    let t = { command: A.Commands.checkElevate };
    return this._send3DAICMD(
      JSON.stringify(t) +
        `
`,
      A.Commands.checkElevate,
    );
  }
  getElevateCMD() {
    let t = { command: A.Commands.elevate };
    return this._send3DAICMD(
      JSON.stringify(t) +
        `
`,
      A.Commands.elevate,
    );
  }
  checkDirCMD(t) {
    let e = "",
      o = `[ -d "${t}" ]`;
    return this._send3DAICMD(
      this.getRunCMD(o, e) +
        `
`,
      A.Commands.run,
    );
  }
  installAppCMD(t) {
    let e = "",
      o = `dpkg -i ${t}`;
    return this._send3DAICMD(
      this.getRunCMD(o, e) +
        `
`,
      A.Commands.run,
    );
  }
  removeAppCMD(t) {
    let e = "",
      o = `dpkg -r ${t}`;
    return this._send3DAICMD(
      this.getRunCMD(o, e) +
        `
`,
      A.Commands.run,
    );
  }
  restartServiceCMD(t, e) {
    let o = "",
      s = `systemctl ${e} ${t}`;
    return this._send3DAICMD(
      this.getRunCMD(s, o) +
        `
`,
      A.Commands.run,
    );
  }
  rmCMD(t, e) {
    let o = e || "/",
      s = `rm ${t}`;
    return this._send3DAICMD(
      this.getRunCMD(s, o) +
        `
`,
      A.Commands.run,
    );
  }
  async downloadApplication(t, e, o) {
    let s = ko.basename(t),
      r = ko.join("home", "root", s),
      n = e || r,
      a = this._getFileDataCMDStart(n.replace(/\\/gi, "/")),
      c = Co.statSync(t);
    var l = Co.createReadStream(t, { highWaterMark: 1024 * 32 }),
      p = Co.createReadStream(t, { highWaterMark: 1024 * 32 }),
      f = xs.createHash("md5");
    p.pipe(f);
    let U = "";
    console.time("FileD"), await this._send3DAICMD(a, A.Commands.download, !0);
    let P = !1;
    l.on("data", (k) => {
      l.pause();
      let W = k.toString("base64");
      try {
        this._serialPort.write(W + ",", "utf-8", async (ie) => {
          l.resume();
        });
      } catch {
        (P = !0), l.close(), l.destroy();
      }
    }),
      l.on("end", function () {
        l.close(), l.destroy();
      });
    let x = 0;
    for (; !l.destroyed; ) {
      let k = l.bytesRead - x;
      (x = l.bytesRead),
        await i.Utils.asyncSleep(100),
        console.timeLog("FileD", `${(l.bytesRead / c.size) * 100}%`),
        o({
          message: `${((l.bytesRead / c.size) * 100).toFixed(1)}%`,
          increment: (k / c.size) * 100,
        });
    }
    if (P)
      return {
        vexaicommsI: "",
        cmdID: A.Commands.download,
        cmdStr: "",
        data: new Uint8Array(),
        details: "",
        exitCode: A.StatusCodes.port_not_open,
      };
    let N = `${this._getFileDataCMDEnd(f.digest("hex"))}
`,
      F = `${a}${U}${N}`;
    return (
      console.log(JSON.parse(F)),
      console.timeLog("FileD", `${l.bytesRead}`),
      console.timeEnd("FileD"),
      o({ message: "Writting File . . .", increment: -101 }),
      this._send3DAICMD(N, A.Commands.download)
    );
  }
  _getFileDataCMDStart(t) {
    let e = {
      command: A.Commands.download,
      filepath: t,
      filedata: "${placeHolder}",
      checksum: "",
    };
    return JSON.stringify(e).split("${placeHolder}")[0];
  }
  _getFileDataCMDEnd(t) {
    let e = {
      command: A.Commands.download,
      filepath: "",
      filedata: "${placeHolder}",
      checksum: t,
    };
    return JSON.stringify(e).split("${placeHolder}")[1];
  }
  getRunCMD(t, e) {
    let o = { command: A.Commands.run, args: t, path: e };
    return JSON.stringify(o);
  }
  static getErrorResp(t, e) {
    let o = {
      command: t,
      error: e,
      response: A.getErrorCodeDetails(A.StatusCodes.nack),
    };
    return {
      vexaicommsI: "",
      cmdID: o.command,
      cmdStr: "",
      data: new TextEncoder().encode(JSON.stringify(o)),
      details: o.error,
      exitCode: A.StatusCodes.nack,
    };
  }
  async _send3DAICMD(t, e = A.Commands.unknown, o = !1) {
    let s = {
      vexaicommsI: "",
      cmdID: e,
      cmdStr: t,
      data: void 0,
      details: "",
      exitCode: A.StatusCodes.nack,
    };
    if (!this._serialPort.isOpen)
      return (s.exitCode = A.StatusCodes.port_not_open), s;
    let r = await ht.enqueue(() => {
      let n, a;
      return [
        new Promise((l, p) => {
          (n = l),
            (a = p),
            o
              ? this._serialPort.write(t, "utf-8", (f) => {
                  f ? p(new Uint8Array()) : l(new Uint8Array());
                })
              : this._serialPort.write(t, "utf-8", (f) => {
                  console.log(f);
                });
        }),
        n,
        a,
      ];
    }, e);
    return (r.cmdStr = s.cmdStr.replace(/\n/gi, "")), r;
  }
  static getErrorCodeDetails(t) {
    return A.vexaiErrorMap.get(t)
      ? A.vexaiErrorMap.get(t)
      : `(${t}) Unknown Error Code`;
  }
};
((o) => {
  let y;
  ((k) => (
    (k.clear = "clear"),
    (k.updateVersion = "update_version"),
    (k.appVersion = "app_version"),
    (k.webVersion = "web_version"),
    (k.deviceInfo = "device_info"),
    (k.isAlive = "alive"),
    (k.elevate = "elevate"),
    (k.checkElevate = "check_elevate"),
    (k.setSSID = "set_ap_name"),
    (k.setPassword = "set_ap_password"),
    (k.run = "run"),
    (k.download = "download"),
    (k.doing_nothing = "doing nothing"),
    (k.unknown = "unknown command")
  ))((y = o.Commands || (o.Commands = {})));
  let t;
  ((P) => (
    (P[(P.unknownResp = -100)] = "unknownResp"),
    (P[(P.deviceNotAlive = -7)] = "deviceNotAlive"),
    (P[(P.vexupdateMissing = -6)] = "vexupdateMissing"),
    (P[(P.clear = -5)] = "clear"),
    (P[(P.downloadCommandActive = -4)] = "downloadCommandActive"),
    (P[(P.port_not_open = -3)] = "port_not_open"),
    (P[(P.timeout = -2)] = "timeout"),
    (P[(P.nack = -1)] = "nack"),
    (P[(P.ack = 0)] = "ack")
  ))((t = o.StatusCodes || (o.StatusCodes = {}))),
    (o.vexaiErrorMap = new Map([
      [-100, "Command Response Not Recognized"],
      [-6, "Vexupdate is missing, can't send command"],
      [-7, "Device is not alive, can't send command"],
      [-5, "Clearing vexupdate command buffer"],
      [-4, "Command Dropped Download Command In Progress"],
      [-3, "Command Dropped Serial Port is not open"],
      [-2, "Command Timout Occurried"],
      [0, "ACK"],
      [-1, "NACK"],
    ]));
})(A || (A = {}));
var De = class {
    static setOptions(t) {
      De.options = t;
    }
    static enqueueGeneric(t, e) {
      return new Promise((o, s) => {
        De.queue.push({
          promiseFunc: t,
          externalResolve: o,
          externalReject: s,
          internalReject: void 0,
          internalResolve: void 0,
          cmdID: e,
        }),
          De.dequeue();
      });
    }
    static enqueue(t, e) {
      return De?.activeCmd?.cmdID === "download"
        ? new Promise((o) =>
            o({
              vexaicommsI: "",
              cmdID: e,
              cmdStr: "",
              data: new Uint8Array(),
              details: "",
              exitCode: -4,
            }),
          )
        : new Promise((o, s) => {
            De.queue.push({
              promiseFunc: t,
              externalResolve: o,
              externalReject: s,
              internalReject: void 0,
              internalResolve: void 0,
              cmdID: e,
            }),
              De.dequeue();
          });
    }
    static dequeue() {
      if (De.pendingPromise) return !1;
      let t = De.queue.shift();
      if (((De.activeCmd = t), !t)) return !1;
      let e;
      console.time("Command"),
        De.activeCmd.cmdID === "device_info" &&
          (e = setTimeout(() => {
            let o = De.activeCmd.cmdID + "Timeout Occurried";
            De.activeCmd.internalResolve(A.getErrorResp(De.activeCmd.cmdID, o)),
              console.timeLog("Command", "Timeout Occurried");
          }, 3e3)),
        (De.activeCmd.cmdID === "alive" || De.activeCmd.cmdID === "clear") &&
          (e = setTimeout(() => {
            let o = De.activeCmd.cmdID + "Timeout Occurried";
            De.activeCmd.internalResolve(A.getErrorResp(De.activeCmd.cmdID, o)),
              console.timeLog("Command", "Timeout Occurried");
          }, 1e3));
      try {
        (De.pendingPromise = !0), console.log(`Running Command: ${t.cmdID}`);
        let o = t.promiseFunc();
        (De.activeCmd.internalResolve = o[1]),
          (De.activeCmd.internalReject = o[2]),
          o[0]
            .then((s) => {
              console.log(`Finished Command: ${t.cmdID} ${JSON.stringify(s)}`),
                (De.pendingPromise = !1),
                t.externalResolve(s),
                clearTimeout(e),
                console.timeLog("Command", "Timeout Cleared"),
                console.timeEnd("Command"),
                De.dequeue();
            })
            .catch((s) => {
              (De.pendingPromise = !1),
                t.externalReject(s),
                clearTimeout(e),
                De.dequeue();
            });
      } catch (o) {
        (De.pendingPromise = !1), t.externalReject(o), De.dequeue();
      }
      return !0;
    }
  },
  ht = De;
(ht.options = { active: !1, maxCmds: 0 }),
  (ht.queue = []),
  (ht.pendingPromise = !1),
  (ht.activeCmd = {
    cmdID: "doing nothing",
    promiseFunc: () => {},
    internalReject: void 0,
    internalResolve: void 0,
    externalReject: void 0,
    externalResolve: void 0,
  });
var It = L(require("fs")),
  qt = L(require("child_process")),
  et = L(require("path")),
  Jo = L(require("os")),
  Pe = class {
    constructor(t, e) {
      this.returnMsg = { messege: "", progress: 0 };
      (this._exeName = et.basename(t)),
        (this._exePath = t),
        (this._exeParentPath = et.dirname(t)),
        this._checkFilePermissions();
    }
    flash(t, e = 10, o) {
      let s = et.resolve(t, "_flash.bin"),
        r = et.resolve(t, "_image"),
        n = `-v -b emmc_all "${s}" "${r}" -t ${e}`,
        a = this.checkFile(`${s}`, n, Pe.CommandID.flashImage);
      if (a.exitCode !== Pe.ExitCode.uuuSuccess)
        return new Promise((l) => l(a));
      if (
        ((a = this.checkFile(`${r}`, n, Pe.CommandID.flashImage)),
        a.exitCode !== Pe.ExitCode.uuuSuccess)
      )
        return new Promise((l) => l(a));
      let c = !!o;
      return this._runUUUCMD(n, Pe.CommandID.flashImage, c, o);
    }
    flash_bootloader(t, e) {
      let o = et.resolve(t, "_flash.bin"),
        s = `-v -b emmc_all "${o}"`,
        r = this.checkFile(`${o}`, s, Pe.CommandID.flashImage);
      if (r.exitCode !== Pe.ExitCode.uuuSuccess)
        return new Promise((a) => a(r));
      let n = !!e;
      return this._runUUUCMD(s, Pe.CommandID.flashImage, n, e);
    }
    fb_command(t) {
      let e = `FB: ${t}`;
      return this._runUUUCMD(e, Pe.CommandID.unknown);
    }
    listDevices() {
      let t = "-lsusb";
      return this._runUUUCMD(t, Pe.CommandID.listUSB);
    }
    kill() {
      this._uuuCP.kill();
    }
    custom(t) {
      return this._runUUUCMD(t, Pe.CommandID.custom);
    }
    static getErrorCodeDetails(t) {
      return bs.get(t) ? bs.get(t) : `(${t}) Unknown Error Code`;
    }
    _checkFilePermissions() {
      if (Jo.type() === "Linux") {
        let t = It.statSync(this._exePath);
        (t.mode & 4095) !== 493 &&
          (console.log(
            "CHMOD",
            new TextDecoder().decode(
              qt.spawnSync(`chmod 755 ${this._exePath}`, { shell: !0 }).stderr,
            ),
          ),
          (t = It.statSync(this._exePath)),
          console.log("New File Permission", (t.mode & 4095).toString(8)));
      } else if (Jo.type() === "Darwin") {
        let t = et.dirname(this._exePath),
          e = [];
        e.push(this._exePath),
          e.forEach((o) => {
            let s = It.statSync(o);
            (s.mode & 4095) !== 493 &&
              (console.log(
                "CHMOD",
                new TextDecoder().decode(
                  qt.spawnSync(`chmod 755 ${this._exePath}`, { shell: !0 })
                    .stderr,
                ),
              ),
              (s = It.statSync(this._exePath)),
              console.log(
                `${et.basename(o)}: Updated File Permission`,
                (s.mode & 4095).toString(8),
              ));
          });
      } else {
        let t = It.statSync(this._exePath);
        (t.mode & 4095) !== 438 &&
          (console.log(
            "CHMOD",
            new TextDecoder().decode(
              qt.spawnSync(`chmod +x ${this._exePath}`, { shell: !0 }).stderr,
            ),
          ),
          (t = It.statSync(this._exePath)),
          console.log("New File Permission", (t.mode & 4095).toString(8)));
      }
    }
    _splitArgString(t) {
      let e = [];
      return (
        t.split(/\s/).forEach((o) => {
          (o !== "" || o !== "") && e.push(o);
        }),
        e
      );
    }
    _parseUUUOutput(t, e, o) {
      console.log(o);
      let s = { messege: "", progress: 0 },
        r = RegExp(/_flash\.bin/),
        n = RegExp(/_image/),
        a = RegExp(/_image/),
        c = RegExp(/[0-9]?[0-9]?[0-9]%/);
      return (
        n.test(o) && (this.returnMsg.messege = "Flashing Image"),
        r.test(o) && (this.returnMsg.messege = "Flashing Bootloader"),
        c.test(o) &&
          ((this.returnMsg.progress = Number(c.exec(o)[0].split("%")[0])),
          this._onProgressRecieved(e, this.returnMsg, o, t)),
        console.log(this.returnMsg),
        this.returnMsg
      );
    }
    _runUUUCMD(t, e = Pe.CommandID.unknown, o = !1, s = "") {
      let r = this,
        n = this._exeParentPath;
      if (!It.existsSync(this._exeParentPath)) {
        this._onErrorRecieved(
          e,
          Number(`${Pe.getErrorCodeDetails(Pe.ExitCode.uuuAPIMissing)} ${n}`),
          r,
        ),
          this._onExitRecieved(e, Pe.ExitCode.uuuAPIMissing, r);
        let c = {
          uuuI: "",
          cmdID: e,
          cmdStr: `${this._exeName} ${t}`,
          stderr: "",
          stdout: "",
          exitCode: Pe.ExitCode.uuuAPIMissing,
        };
        return new Promise((l) => {
          l(c);
        });
      }
      let a = (c, l) => {
        let p = e,
          f = o
            ? `echo "****" | sudo -S ${this._exeName} ${t}`
            : `${this._exeName} ${t}`,
          U = "",
          P = "",
          x = {};
        (x.cwd = this._exeParentPath),
          (x.PATH = this._exeParentPath + et.delimiter + process.env.PATH);
        let $ = { cwd: this._exeParentPath, shell: !0, env: x };
        o
          ? (r._uuuCP = qt.spawn(
              "echo",
              this._splitArgString(`"${s}" | sudo -S ${this._exeName} ${t}`),
              $,
            ))
          : (r._uuuCP = qt.spawn(this._exeName, this._splitArgString(t), $)),
          r._uuuCP.stdout.on("data", function (N) {
            r._onDataRecieved(p, N, r),
              console.log(new TextDecoder().decode(N)),
              (P += N),
              r._parseUUUOutput(r, e, new TextDecoder().decode(N));
          }),
          r._uuuCP.stderr.on("data", function (N) {
            (U += new TextDecoder().decode(N)),
              console.log(new TextDecoder().decode(N)),
              r._onErrorRecieved(p, N, r);
          }),
          r._uuuCP.on("close", function (N) {
            let F = {
              uuuI: "",
              cmdID: p,
              cmdStr: f,
              stderr: U,
              stdout: P,
              exitCode: N,
            };
          }),
          r._uuuCP.on("exit", function (N) {
            r._onExitRecieved(p, N, r),
              c({
                uuuI: "",
                cmdID: p,
                cmdStr: f,
                stderr: U,
                stdout: P,
                exitCode: N,
              });
          });
      };
      return new Promise((c, l) => a(c, l));
    }
    on(t, e) {
      switch (t) {
        case "Data":
          this.onDataFuncHandle = e;
          break;
        case "Progress":
          this.onProgressFuncHandle = e;
          break;
        case "Error":
          this.onErrorFuncHandle = e;
          break;
        case "Exit":
          this.onExitFuncHandle = e;
          break;
      }
    }
    _onDataRecieved(t, e, o) {
      o?.onDataFuncHandle && o.onDataFuncHandle(t, e.toString());
    }
    _onProgressRecieved(t, e, o, s) {
      s?.onProgressFuncHandle && s.onProgressFuncHandle(t, e, o);
    }
    _onErrorRecieved(t, e, o) {
      o?.onErrorFuncHandle &&
        o.onErrorFuncHandle(t, new TextDecoder().decode(e));
    }
    _onExitRecieved(t, e, o) {
      o?.onExitFuncHandle && o.onExitFuncHandle(t, e);
    }
    checkFile(t, e, o) {
      let s = {
        uuuI: "",
        cmdID: o,
        cmdStr: `${et.basename(this._exeParentPath)} ${e}`,
        stderr: "",
        stdout: "",
        exitCode: Pe.ExitCode.uuuSuccess,
      };
      if (!It.existsSync(t))
        return (s.exitCode = Pe.ExitCode.uuuAPIErrorFilePath), s;
      let n = [];
      switch (o) {
        case Pe.CommandID.flashImage:
          n = [".bin", ""];
          break;
        default:
          n = [];
          break;
      }
      let a = et.extname(t) ? et.extname(t) : "";
      return (
        n.includes(a) || (s.exitCode = Pe.ExitCode.uuuAPIErrorFileExtension), s
      );
    }
  };
((e) => {
  let y;
  ((c) => (
    (c.uuu_doing_nothing = "Doing Nothing"),
    (c.unknown = "Unknown Command"),
    (c.custom = "Custom Command"),
    (c.flashImage = "Flash Image"),
    (c.listUSB = "List USB Devices")
  ))((y = e.CommandID || (e.CommandID = {})));
  let t;
  ((U) => (
    (U[(U.uuuError = -1)] = "uuuError"),
    (U[(U.uuuSuccess = 0)] = "uuuSuccess"),
    (U[(U.uuuAPIErrorOS = 1)] = "uuuAPIErrorOS"),
    (U[(U.uuuAPIMissing = 2)] = "uuuAPIMissing"),
    (U[(U.uuuAPIAlive = 3)] = "uuuAPIAlive"),
    (U[(U.uuuAPIErrorFileExtension = 4)] = "uuuAPIErrorFileExtension"),
    (U[(U.uuuAPIErrorFilePath = 5)] = "uuuAPIErrorFilePath"),
    (U[(U.uuuAPIVexcomAlive = 6)] = "uuuAPIVexcomAlive"),
    (U[(U.uuuAPIVexcomMissing = 7)] = "uuuAPIVexcomMissing")
  ))((t = e.ExitCode || (e.ExitCode = {})));
})(Pe || (Pe = {}));
var bs = new Map([
  [-1, "Unknown UUU Error"],
  [0, "UUU Success"],
  [1, "UUU is not supported on this OS"],
  [2, "UUU utility is missing"],
  [3, "UUU is alive, timeout"],
]);
var ws = L(require("crypto")),
  i;
((c) => {
  c.DEBUG = !0;
  let t;
  ((x) => (
    (x.Brain = "Brain"),
    (x.Camera_2D = "2D Camera"),
    (x.Camera_3D = "3D Camera"),
    (x.Controller = "Controller"),
    (x.Unknown = "unknown")
  ))((t = c.Device || (c.Device = {})));
  let e;
  ((x) => (
    (x.AI = "AI"),
    (x.V5 = "V5"),
    (x.EXP = "EXP"),
    (x.IQ2 = "IQ2"),
    (x.Unknown = "unknown")
  ))((e = c.Platform || (c.Platform = {})));
  let o;
  ((U) => ((U.cpp = "cpp"), (U.python = "python"), (U.unknown = "unknown")))(
    (o = c.Language || (c.Language = {})),
  );
  let s;
  ((w) => {
    (w.name = "vexcode"),
      (w.author = "vexrobotics"),
      (w.id = `${w.author}.${w.name}`);
    function P() {
      return J.extensions.all.filter((q) => q.id.includes(w.name))[0]
        .packageJSON.version;
    }
    (w.version = P),
      (w.vexcomVersion = { version: "", date: "", time: "", name: "" });
    function $(O) {
      let q;
      return (
        dt.type() === "Windows_NT" &&
          (q = J.Uri.joinPath(
            O.extensionUri,
            "resources",
            "tools",
            "vexcom",
            "win32",
            "vexcom.exe",
          )),
        dt.type() === "Darwin" &&
          (q = J.Uri.joinPath(
            O.extensionUri,
            "resources",
            "tools",
            "vexcom",
            "osx",
            "vexcom",
          )),
        dt.type() === "Linux" &&
          dt.arch() === "x64" &&
          (q = J.Uri.joinPath(
            O.extensionUri,
            "resources",
            "tools",
            "vexcom",
            "linux-x64",
            "vexcom",
          )),
        dt.type() === "Linux" &&
          dt.arch() === "arm64" &&
          (q = J.Uri.joinPath(
            O.extensionUri,
            "resources",
            "tools",
            "vexcom",
            "linux-arm64",
            "vexcom",
          )),
        dt.type() === "Linux" &&
          dt.arch() === "arm" &&
          (q = J.Uri.joinPath(
            O.extensionUri,
            "resources",
            "tools",
            "vexcom",
            "linux-arm32",
            "vexcom",
          )),
        q
      );
    }
    w.getVexcomUri = $;
    let N = new Map([
      ["vexlog.error", "#ff3232"],
      ["vexlog.warning", "#FFFF00"],
      ["vexlog.normal", "#4479ff"],
      ["vexlog.battery", "#4479ff"],
      ["vexlog.power", "#00a000"],
    ]);
    async function F() {
      let O = [
          { scope: "vexlog.error", foreground: "#ff3232" },
          { scope: "vexlog.warning", foreground: "#FFFF00" },
          { scope: "vexlog.normal", foreground: "#4479ff" },
          { scope: "vexlog.battery", foreground: "#4479ff" },
          { scope: "vexlog.power", foreground: "#00a000" },
        ],
        q = J.workspace
          .getConfiguration()
          .get("editor.tokenColorCustomizations.textMateRules"),
        R = [];
      O.forEach((E) => {
        q.some(
          (we) =>
            we.scope === E.scope && we.settings.foreground === E.foreground,
        ) || R.push({ scope: E.scope, settings: { foreground: E.foreground } });
      }),
        R.forEach((E) => q.push(E)),
        await J.workspace
          .getConfiguration()
          .update(
            "editor.tokenColorCustomizations",
            { textMateRules: q },
            J.ConfigurationTarget.Global,
            !0,
          ),
        console.log("done");
    }
    w.setVexlogColor = F;
    let k;
    ((we) => {
      (we.vexProjectSettingsFolderArrID = `${w.id}.vexProjectSettingsFolderArr`),
        (we.isValidProjectID = `${w.id}.isValidProjectID`),
        (we.debugEnabled = `${w.id}.debugEnabled`),
        (we.isDevEnabled = !1);
      async function E(Ze) {
        return J.commands.executeCommand("setContext", we.isValidProjectID, Ze);
      }
      we.setIsValidProject = E;
      async function Z(Ze) {
        return (
          (we.isDevEnabled = Ze),
          J.commands.executeCommand("setContext", we.debugEnabled, Ze)
        );
      }
      we.setDebug = Z;
    })((k = w.Context || (w.Context = {})));
    let W;
    ((Q) => {
      (Q.buildID = `${w.id}.project.build`),
        (Q.cleanID = `${w.id}.project.clean`),
        (Q.rebuildID = `${w.id}.project.rebuild`),
        (Q.newProjectID = `${w.id}.project.new`),
        (Q.importID = `${w.id}.project.import`),
        (Q.settingUIID = `${w.id}.project.settingsUI`),
        (Q.eraseID = `${w.id}.system.erase`),
        (Q.downloadID = `${w.id}.system.download`),
        (Q.systemInfoID = `${w.id}.system.info`),
        (Q.systemInfoAllID = `${w.id}.system.info.all`),
        (Q.screenGrabID = `${w.id}.system.screen-grab`),
        (Q.brainNameID = `${w.id}.system.brain-name`),
        (Q.teamNumberID = `${w.id}.system.team-number`),
        (Q.batteryMedicID = `${w.id}.system.battery-medic`),
        (Q.systemUpdateVEXosID = `${w.id}.system.update.vexos`),
        (Q.systemUpdatePythonVmID = `${w.id}.system.update.pythonVM`),
        (Q.controllerUpdateFirmwareID = `${w.id}.system.update.controller`),
        (Q.dfuUpdateFirmwareID = `${w.id}.system.update.dfu`),
        (Q.uploadEventLogID = `${w.id}.system.uploadEventLog`),
        (Q.vexcomVersionID = `${w.id}.vexcom.version`),
        (Q.update3dAICameraImage = `${w.id}.camera.3d.image.update`),
        (Q.flashAICamera = `${w.id}.camera.3d.flash`),
        (Q.set3DSSID = `${w.id}.camera.3d.set-ssid`),
        (Q.set3DPassword = `${w.id}.camera.3d.set-password`),
        (Q.download3DApp = `${w.id}.camera.3d.app.update`),
        (Q.reset3DUserTerminal = `${w.id}.camera.3d.resetTerminal`),
        (Q.vexCommandHelpID = `${w.id}.command-help`),
        (Q.vexCommandHelpShowAllID = `${w.id}.command-help.show-all`),
        (Q.downloadSDKID = `${w.id}.sdk.download`),
        (Q.downloadToolchainID = `${w.id}.toolchain.download`),
        (Q.clearLogTerminalID = `${w.id}.terminal.log.clear`),
        (Q.clearInterativeTerminalID = `${w.id}.terminal.interactive.clear`),
        (Q.createNewTerminalSetID = `${w.id}.terminal.newset`),
        (Q.TEST_COMMAND = `${w.id}.test`),
        (Q.systemRecoverID = `${w.id}.system.recover`),
        (Q.installDrivers = `${w.id}.drivers.install`),
        (Q.controllerUpdateFirmwareAtmelID = `${w.id}.system.update.controller.atmel`),
        (Q.controllerUpdateFirmwareRadioDEVID = `${w.id}.system.update.controller.radio`),
        (Q.controllerUpdateFirmwareDEVID = `${w.id}.system.update.controllerMenu`),
        (Q.brainUpdateFirmwareDEVID = `${w.id}.system.update.brainMenu`),
        (Q.webSocketSettings = `${w.id}.websocket.settings`),
        (Q.downloadAI = `${w.id}.ai.downloadfile`);
      async function cs() {
        return J.commands.executeCommand(Q.buildID);
      }
      Q.build = cs;
      async function ls() {
        return J.commands.executeCommand(Q.cleanID);
      }
      Q.clean = ls;
      async function ds() {
        return J.commands.executeCommand(Q.rebuildID);
      }
      Q.rebuild = ds;
      async function ps() {
        return J.commands.executeCommand(Q.newProjectID);
      }
      Q.newProject = ps;
      async function Zs() {
        return J.commands.executeCommand(Q.importID);
      }
      Q.importProject = Zs;
      async function Bo() {
        return J.commands.executeCommand(Q.systemInfoID);
      }
      Q.systemInfo = Bo;
      async function fo() {
        return J.commands.executeCommand(Q.screenGrabID);
      }
      Q.screenGrab = fo;
      async function Eo() {
        return J.commands.executeCommand(Q.brainNameID);
      }
      Q.setBrainName = Eo;
      async function Lt() {
        return J.commands.executeCommand(Q.teamNumberID);
      }
      Q.setTeamNumber = Lt;
      async function Fo() {
        return J.commands.executeCommand(Q.batteryMedicID);
      }
      Q.batteryMedic = Fo;
      async function ei() {
        return J.commands.executeCommand(Q.systemUpdateVEXosID);
      }
      Q.systemUpdateVEXos = ei;
      async function ti(Ho) {
        return J.commands.executeCommand(Q.systemUpdatePythonVmID, Ho);
      }
      Q.systemUpdatePythonVM = ti;
      async function ms() {
        return J.commands.executeCommand(Q.downloadID);
      }
      Q.downloadUserProgram = ms;
      async function Xo() {
        return J.commands.executeCommand(Q.vexCommandHelpID);
      }
      Q.vexCommandHelp = Xo;
      async function us() {
        return J.commands.executeCommand(Q.vexCommandHelpShowAllID);
      }
      Q.vexCommandHelpShowAll = us;
    })((W = w.Command || (w.Command = {})));
    let ie;
    ((X) => {
      (X.enableUserTerminalID = `${w.id}.General.EnableUserTerminal`),
        (X.buildTypeID = `${w.id}.Project.BuildType`),
        (X.runAfterDownload = `${w.id}.Project.RunAfterDownload`),
        (X.controllerChannel = `${w.id}.Controller.Channel`),
        (X.logEntriesID = `${w.id}.General.LogEntries`),
        (X.dfuAutoRecover = `${w.id}.System.DFU.AutoRecover`),
        (X.projectHomeID = `${w.id}.Project.Home`),
        (X.toolchainCPPPathID = `${w.id}.Cpp.Toolchain.Path`),
        (X.sdkCPPHomeID = `${w.id}.Cpp.Sdk.Home`),
        (X.sdkPythonHomeID = `${w.id}.Python.Sdk.Home`),
        (X.pylanceStubPathID = "python.analysis.stubPath"),
        (X.pylanceDiagnosticModePathID = "python.analysis.diagnosticMode"),
        (X.pylanceCheckingModeID = "python.analysis.typeCheckingMode"),
        (X.microsoftCppSysIncID = "C_Cpp.default.systemIncludePath"),
        (X.hostNameID = `${w.id}.WebsocketServer.HostAddress`),
        (X.portID = `${w.id}.WebsocketServer.Port`),
        (X.enableWebsocketServerID = `${w.id}.WebsocketServer.Enable`),
        (X.aiCameraHomeID = `${w.id}.AI.Camera.Image.Home`),
        (X.enableAI3dCameraUserTerminalID = `${w.id}.General.Enable3DCameraUserTerminal`);
      function Vt(Se) {
        let $e = [];
        return (
          Se.affectsConfiguration(X.enableUserTerminalID) &&
            $e.push(X.enableUserTerminalID),
          Se.affectsConfiguration(X.buildTypeID) && $e.push(X.buildTypeID),
          Se.affectsConfiguration(X.runAfterDownload) &&
            $e.push(X.runAfterDownload),
          Se.affectsConfiguration(X.controllerChannel) &&
            $e.push(X.controllerChannel),
          Se.affectsConfiguration(X.projectHomeID) && $e.push(X.projectHomeID),
          Se.affectsConfiguration(X.toolchainCPPPathID) &&
            $e.push(X.toolchainCPPPathID),
          Se.affectsConfiguration(X.sdkCPPHomeID) && $e.push(X.sdkCPPHomeID),
          Se.affectsConfiguration(X.sdkPythonHomeID) &&
            $e.push(X.sdkPythonHomeID),
          Se.affectsConfiguration(X.pylanceStubPathID) &&
            $e.push(X.pylanceStubPathID),
          Se.affectsConfiguration(X.pylanceDiagnosticModePathID) &&
            $e.push(X.pylanceDiagnosticModePathID),
          Se.affectsConfiguration(X.pylanceCheckingModeID) &&
            $e.push(X.pylanceCheckingModeID),
          Se.affectsConfiguration(X.hostNameID) && $e.push(X.hostNameID),
          Se.affectsConfiguration(X.portID) && $e.push(X.portID),
          Se.affectsConfiguration(X.enableWebsocketServerID) &&
            $e.push(X.enableWebsocketServerID),
          Se.affectsConfiguration(X.aiCameraHomeID) &&
            $e.push(X.aiCameraHomeID),
          Se.affectsConfiguration(X.enableAI3dCameraUserTerminalID) &&
            $e.push(X.enableAI3dCameraUserTerminalID),
          Se.affectsConfiguration(X.logEntriesID) && $e.push(X.logEntriesID),
          Se.affectsConfiguration(X.dfuAutoRecover) &&
            $e.push(X.dfuAutoRecover),
          $e
        );
      }
      X.getChangeSettingsList = Vt;
    })((ie = w.Settings || (w.Settings = {})));
    let de;
    ((je) => {
      (je.v5BrainID = `vex-${"V5"}-${"Brain"}`),
        (je.expBrainID = `vex-${"EXP"}-${"Brain"}`),
        (je.iq2BrainID = `vex-${"IQ2"}-${"Brain"}`),
        (je.v5ControllerID = `vex-${"V5"}-${"Controller"}`),
        (je.expControllerID = `vex-${"EXP"}-${"Controller"}`),
        (je.iq2ControllerID = `vex-${"IQ2"}-${"Controller"}`),
        (je.fillerIcon = "question");
      function Ze(ue, oe) {
        return ue === "V5" && oe === "Brain"
          ? je.v5BrainID
          : ue === "EXP" && oe === "Brain"
            ? je.expBrainID
            : ue === "IQ2" && oe === "Brain"
              ? je.iq2BrainID
              : ue === "V5" && oe === "Controller"
                ? je.v5ControllerID
                : ue === "EXP" && oe === "Controller"
                  ? je.expControllerID
                  : ue === "IQ2" && oe === "Controller"
                    ? je.iq2ControllerID
                    : je.fillerIcon;
      }
      je.getIconStr = Ze;
      function Re(ue) {
        return `$(${ue})`;
      }
      je.wrapID = Re;
    })((de = w.Icons || (w.Icons = {})));
  })((s = c.Extension || (c.Extension = {})));
  let r;
  ((x) => {
    (x.name = "vexfeedback"),
      (x.author = "vexrobotics"),
      (x.id = `${x.author}.${x.name}`);
    function U() {
      return !!J.extensions.getExtension(x.id)?.packageJSON?.version;
    }
    x.exist = U;
    let P;
    ((he) => {
      (he.getSDKVersionID = `${x.id}.sdk.version`),
        (he.downloadSDKID = `${x.id}.sdk.download`),
        (he.downloadToolchainID = `${x.id}.toolchain.download`),
        (he.getVexosVersionID = `${x.id}.vexos.version`),
        (he.downloadVexosID = `${x.id}.vexos.download`),
        (he.getVexosManifestID = `${x.id}.vexos.manifest`),
        (he.getVexaiVersionID = `${x.id}.vexai.version`),
        (he.downloadVexaiID = `${x.id}.vexai.download`),
        (he.verifyVexaiImageID = `${x.id}.vexai.verify`),
        (he.getVexaiImageManifestID = `${x.id}.vexai.manifest`),
        (he.getVexaiAppVersionID = `${x.id}.app.vexai.version`),
        (he.downloadAppVexaiID = `${x.id}.app.vexai.download`),
        (he.getVexaiAppListManifestID = `${x.id}.app.vexai.applist.manifest`),
        (he.getVexaiAppManifestID = `${x.id}.app.vexai.manifest`),
        (he.downloadVexaiAppID = `${x.id}.app.vexai.download`),
        (he.downloadDriverInstallerID = `${x.id}.driver-installer`);
      function Re(ae) {
        return {
          command: ae,
          details: "Feedback Extension is not installed",
          json: "{}",
          statusCode: 1,
        };
      }
      async function je(ae, ce, ve) {
        let Ae = he.getSDKVersionID,
          ke;
        if (x.exist()) ke = await J.commands.executeCommand(Ae, ae, ce, ve);
        else {
          let ut = {
            local: await ue(ae, ce, ve),
            online: { latest: "", catalog: [] },
          };
          ke = {
            command: Ae,
            details: "Get SDK Versions",
            json: JSON.stringify(ut),
            statusCode: 0,
          };
        }
        if (ke.statusCode === -1) {
          let ut = {
            local: await ue(ae, ce, ve),
            online: { latest: "", catalog: [] },
          };
          ke.json = JSON.stringify(ut);
        }
        return ke;
      }
      he.getSDKVersions = je;
      async function ue(ae, ce, ve) {
        let Ae = { latest: "", catalog: [] },
          ke;
        if (ce === "cpp") ke = s.Settings.sdkCPPHomeID;
        else if (ce === "python") ke = s.Settings.sdkPythonHomeID;
        else return Ae;
        let Ge = ve
            ? J.Uri.joinPath(ve, ae)
            : J.Uri.file(J.workspace.getConfiguration().get(ke)),
          ut = [];
        if (rt.existsSync(Ge.fsPath))
          ut = await J.workspace.fs.readDirectory(Ge);
        else return Ae;
        let gt = ut.filter(
          (Qt) => Qt[0].includes(ae) && Qt[1] === J.FileType.Directory,
        );
        return (
          console.log("Local Filtered", ut, gt, ae),
          gt.forEach((Qt) => {
            Ae.catalog.push(Qt[0]);
          }),
          Ae.catalog.sort(a.vexos._sortSDKListCB),
          (Ae.latest = Ae.catalog[0] ? Ae.catalog[0] : ""),
          Ae
        );
      }
      async function oe(ae, ce, ve, Ae) {
        let ke = he.downloadSDKID;
        return x.exist()
          ? J.commands.executeCommand(ke, ae, ce, ve, Ae)
          : Re(ke);
      }
      he.downloadSDK = oe;
      async function Ee(ae) {
        let ce = he.downloadToolchainID;
        return x.exist() ? J.commands.executeCommand(ce, ae) : Re(ce);
      }
      he.downloadToolchain = Ee;
      async function ye(ae, ce) {
        let ve = he.getVexosVersionID,
          Ae = await re(ae, ce),
          ke;
        if (x.exist()) ke = await J.commands.executeCommand(ve, ae, ce);
        else {
          let Ge = { local: Ae, online: { latest: "" } };
          ke = {
            command: ve,
            details: "Get SDK Versions",
            json: JSON.stringify(Ge),
            statusCode: 0,
          };
        }
        if (ke.statusCode === -1) {
          let Ge = { local: Ae, online: { latest: "" } };
          ke.json = JSON.stringify(Ge);
        }
        return ke;
      }
      he.getVEXosVersions = ye;
      async function re(ae, ce) {
        let ve = J.Uri.joinPath(
            c.Extension.context.extensionUri,
            "resources",
            "vexos",
            ae,
          ),
          Ae = ce ? J.Uri.joinPath(ce, ae) : ve,
          ke = [];
        rt.existsSync(Ae.fsPath) &&
          (ke = await J.workspace.fs.readDirectory(Ae));
        let Ge = { latest: "", catalog: [] };
        return (
          ke
            .filter(
              (gt) =>
                gt[0].includes(ae) &&
                gt[0].includes(".vexos") &&
                gt[1] === J.FileType.File,
            )
            .forEach((gt) => {
              Ge.catalog.push(io.basename(gt[0], ".vexos"));
            }),
          Ge.catalog.sort(c.Utils.vexos._sortVEXOSListCB),
          (Ge.latest = Ge.catalog[0] ? Ge.catalog[0] : ""),
          Ge
        );
      }
      he.getLocalVexosVersion = re;
      async function Ie(ae, ce) {
        let ve = he.downloadVexosID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.downloadLatestVEXos = Ie;
      async function K(ae) {
        let ce = he.downloadVexaiAppID;
        return x.exist()
          ? J.commands.executeCommand(he.downloadVexaiAppID, ae)
          : Re(ce);
      }
      he.downloadVEXaiApp = K;
      async function G(ae, ce) {
        let ve = he.getVexosManifestID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.getLatestVEXosManifest = G;
      async function Et(ae) {
        let ce = he.getVexaiAppListManifestID;
        return x.exist() ? J.commands.executeCommand(ce, ae) : Re(ce);
      }
      he.getVEXaiAppListVersions = Et;
      async function Vt(ae, ce) {
        let ve = he.getVexaiAppManifestID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.getVEXaiAppVersions = Vt;
      async function X(ae, ce) {
        let ve = he.downloadVexaiID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.downloadLatestVEXaiImage = X;
      async function Se(ae) {
        let ce = he.getVexaiImageManifestID;
        return x.exist() ? J.commands.executeCommand(ce, ae) : Re(ce);
      }
      he.getLatestVEXaiManifest = Se;
      async function $e(ae, ce) {
        let ve = he.verifyVexaiImageID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.verifyVEXaiImage = $e;
      async function Oo(ae, ce) {
        let ve = he.downloadDriverInstallerID;
        return x.exist() ? J.commands.executeCommand(ve, ae, ce) : Re(ve);
      }
      he.downloadDriverInstaller = Oo;
    })((P = x.ResourceManager || (x.ResourceManager = {})));
  })((r = c.Feedback_Extension || (c.Feedback_Extension = {})));
  let n;
  ((p) => {
    let l;
    ((x) => {
      function f() {
        let $ = [],
          N = J.extensions.getExtension(c.Extension.id).extensionUri,
          F = J.Uri.joinPath(N, "resources", "extensions");
        return (
          rt.readdirSync(F.fsPath).forEach((W) => {
            let ie = J.Uri.joinPath(F, W),
              de = JSON.parse(
                new TextDecoder().decode(
                  rt.readFileSync(J.Uri.joinPath(ie, "package.json").fsPath),
                ),
              ),
              w = {
                id: `${de.publisher}.${de.name}`,
                extensionKind: J.ExtensionKind.UI,
                isActive: !1,
                packageJSON: de,
                extensionUri: ie,
                extensionPath: ie.fsPath,
                exports: {},
                activate: async () => {},
              };
            $.push(w);
          }),
          $
        );
      }
      x.all = f();
      function P($) {
        let N = x.all.filter((F) => F.id === $);
        return N.length ? N[0] : void 0;
      }
      x.getExtension = P;
    })((l = p.Extensions || (p.Extensions = {})));
  })((n = c.Backup || (c.Backup = {})));
  let a;
  ((de) => {
    function l(w) {
      return { command: w, details: "", statusCode: 0, json: "{}" };
    }
    de.getBasicCommandResp = l;
    function p(w) {
      try {
        JSON.parse(w);
      } catch {
        return !1;
      }
      return !0;
    }
    de.isJsonString = p;
    function f() {
      return new Date().toLocaleString();
    }
    de.getDateString = f;
    function U() {
      let w = new Date(),
        O = w.getSeconds(),
        q = w.getMinutes(),
        R = w.getHours(),
        fe = w.getDate(),
        E = w.getMonth() + 1;
      return `[${w.getFullYear()}/${E}/${fe} ${R}:${q}:${O}]`;
    }
    de.logDateString = U;
    function P() {
      let w = new Date(),
        O = w.getDate().toString().padStart(2, "0"),
        q = (w.getMonth() + 1).toString().padStart(2, "0");
      return `${w.getFullYear().toString().padStart(4, "0")}-${q}-${O}`;
    }
    de.fileDateString = P;
    async function x(w) {
      return new Promise((O, q) => {
        try {
          w.then(
            (R) => O(R),
            (R) => q(R),
          );
        } catch (R) {
          q(R);
        }
      });
    }
    de.toPromise = x;
    function $() {
      let w = new TextDecoder(),
        O;
      return (
        dt.type() === "Windows_NT"
          ? (O = w.decode(new Uint8Array([13, 10]).buffer))
          : dt.type() === "Darwin"
            ? (O = w.decode(new Uint8Array([13]).buffer))
            : (O = w.decode(new Uint8Array([13]).buffer)),
        O
      );
    }
    de.getEndline = $;
    async function N(w) {
      return w < 0 && (w = 0), new Promise((O) => setTimeout(O, w));
    }
    de.asyncSleep = N;
    async function F(w, O) {
      if (!rt.existsSync(w.fsPath))
        throw new Error(`Unzip Fail: File does not exist @ ${w.fsPath}`);
      let q = O ? O.fsPath : io.dirname(w.fsPath);
      console.log(`File Uri Basename: ${io.dirname(w.fsPath)}`),
        console.log(`PathToUnzip: ${io.dirname(q)}`);
      let R = !1,
        fe = !1;
      for (
        rt
          .createReadStream(`${w.fsPath}`)
          .pipe(Cs.Extract({ path: `${q}` }))
          .on("close", () => {
            console.log("Unzipper Close"), (R = !0);
          })
          .on("error", () => {
            throw (
              ((R = !0),
              (fe = !0),
              console.log(new Error("Unzipper Close")),
              new Error("Unzip Fail: Read Stream Error"))
            );
          });
        !R || fe;

      )
        await new Promise((Z) => setTimeout(Z, 500));
      return fe;
    }
    de.unzipFile = F;
    async function k(w, O, q) {
      let R = q?.updateTimeMs ? q?.updateTimeMs : 1;
      if (!rt.existsSync(w.fsPath)) return { checksum: "", errorCode: -1 };
      let fe = rt.statSync(w.fsPath);
      if (!fe.isFile()) return { checksum: "", errorCode: -2 };
      var E = rt.createReadStream(w.fsPath, { highWaterMark: 1024 * 1024 });
      let Z = ws.createHash("md5", { highWaterMark: 1024 * 1024 });
      for (E.pipe(Z); !E.destroyed; ) {
        let we = E.bytesRead / fe.size;
        q?.cb(we), await c.Utils.asyncSleep(R);
      }
      return q?.cb(1), { checksum: Z.digest(O), errorCode: 0 };
    }
    de.getMd5FromFile = k;
    function W(w, O) {
      let q = { command: "unknown", details: "", json: "", statusCode: 0 };
      if ("vexaicommsI" in w) {
        let R = O || new TextDecoder().decode(w.data),
          fe = JSON.parse(R),
          E = "";
        if (w?.cmdID === A.Commands.run) {
          let Z = Buffer.from(fe.error, "base64").toString("utf-8"),
            we = Buffer.from(fe.stderr, "base64").toString("utf-8"),
            Ze = Buffer.from(fe.stdout, "base64").toString("utf-8"),
            Re = fe.exitcode;
          E = `${A.getErrorCodeDetails(w.exitCode)} ${w.details} | CMD: ${w.cmdStr}
RESP:
stdout:${Ze}
stderr:${we}
error:${Z}
exitcode:${Re}
`;
        } else
          w?.cmdID === A.Commands.deviceInfo
            ? (E = `${A.getErrorCodeDetails(w.exitCode)} ${w.details} | CMD: ${w.cmdStr}`)
            : (E = `${A.getErrorCodeDetails(w.exitCode)} ${w.details} | CMD: ${w.cmdStr} 
RESP: ${R}`);
        q = {
          command: w?.cmdID ? w.cmdID : A.Commands.unknown,
          details: E,
          statusCode: w.exitCode,
          json: R || "{}",
        };
      } else
        "uuuI" in w
          ? (q = {
              command: w?.cmdID ? w.cmdID : Pe.CommandID.unknown,
              details: `${Pe.getErrorCodeDetails(w.exitCode)} ${w.stderr} | ${w.cmdStr}`,
              statusCode: w.exitCode,
              json: O || "{}",
            })
          : "vexcomI" in w
            ? w.exitCode === h.ExitCode.vexSucess
              ? (q = {
                  command: w?.cmdID ? w.cmdID : h.CommandID.unknown,
                  details: `${h.getErrorCodeDetails(w.exitCode)} ${w.stderr} | ${w.cmdStr} `,
                  statusCode: w.exitCode,
                  json: O || "{}",
                })
              : (q = {
                  command: w?.cmdID ? w.cmdID : h.CommandID.unknown,
                  details: `${h.getErrorCodeDetails(w.exitCode)} | ${w.cmdStr} 
${w.stdout}
${w.stderr}
 `,
                  statusCode: w.exitCode,
                  json: O || "{}",
                })
            : (q = {
                command: w?.cmdID ? w.cmdID : h.CommandID.unknown,
                details: `${h.getErrorCodeDetails(w.exitCode)} ${w.stderr} | ${w.cmdStr}`,
                statusCode: w.exitCode,
                json: O || "{}",
              });
      return q;
    }
    de._toCommandResponse = W;
    let ie;
    ((je) => {
      function w(ue) {
        let oe = parseInt(ue),
          Ee = (oe >>> 24) & 255,
          ye = (oe >>> 16) & 255,
          re = (oe >>> 8) & 255,
          Ie = oe & 255;
        return `${Ee}.${ye}.${re}.${Ie}`;
      }
      je.toVersion = w;
      function O(ue) {
        let oe = [],
          Ee = RegExp(/VEXOS_(V5|EXP|IQ2)_\d_\d_\d_\d/);
        return (
          ue.forEach((ye) => {
            Ee.test(ye)
              ? oe.push(ye)
              : console.error(`Version Not Compadable: ${ye}`);
          }),
          oe.sort(q),
          oe[0] ? oe[0] : []
        );
      }
      je.getLatestVEXosVersion = O;
      function q(ue, oe) {
        var Ee = ue.toUpperCase(),
          ye = oe.toUpperCase();
        let re = Ee.split("_"),
          Ie = ye.split("_"),
          K = {
            major: Number(re[2]),
            minor: Number(re[3]),
            build: Number(re[4]),
            beta: Number(re[5]),
          },
          G = {
            major: Number(Ie[2]),
            minor: Number(Ie[3]),
            build: Number(Ie[4]),
            beta: Number(Ie[5]),
          };
        return K.major > G.major
          ? -1
          : K.major < G.major
            ? 1
            : K.minor > G.minor
              ? -1
              : K.minor < G.minor
                ? 1
                : K.build > G.build
                  ? -1
                  : K.build < G.build
                    ? 1
                    : K.beta > G.beta
                      ? G.beta === 0
                        ? 1
                        : -1
                      : K.beta < G.beta
                        ? K.beta === 0
                          ? -1
                          : 1
                        : 0;
      }
      je._sortVEXOSListCB = q;
      function R(ue, oe) {
        var Ee = ue.toUpperCase(),
          ye = oe.toUpperCase();
        let re = Ee.split("_"),
          Ie = ye.split("_"),
          K = {
            major: Number(re[2]),
            minor: Number(re[3]),
            build: Number(re[4]),
            beta: Number(re[5]),
            rerelease: Number(re[6]) ? Number(re[6]) : void 0,
          },
          G = {
            major: Number(Ie[2]),
            minor: Number(Ie[3]),
            build: Number(Ie[4]),
            beta: Number(Ie[5]),
            rerelease: Number(re[6]) ? Number(re[6]) : void 0,
          };
        if (K.major > G.major) return -1;
        if (K.major < G.major) return 1;
        if (K.minor > G.minor) return -1;
        if (K.minor < G.minor) return 1;
        if (K.build > G.build) return -1;
        if (K.build < G.build) return 1;
        if (K.beta > G.beta) return G.beta === 0 ? 1 : -1;
        if (K.beta < G.beta) return K.beta === 0 ? -1 : 1;
        if (K.rerelease && G.rerelease) {
          if (K.beta > G.beta) return -1;
          if (K.beta < G.beta) return 1;
        } else {
          if (!K.rerelease && G.rerelease) return -1;
          if (K.rerelease && !G.rerelease) return 1;
        }
        return 0;
      }
      je._sortSDKListCB = R;
      function fe(ue, oe) {
        var Ee = ue.version.toUpperCase(),
          ye = oe.version.toUpperCase();
        let re = Ee.split("_"),
          Ie = ye.split("_"),
          K = {
            major: Number(re[2]),
            minor: Number(re[3]),
            build: Number(re[4]),
            beta: Number(re[5]),
            rerelease: Number(re[6]) ? Number(re[6]) : void 0,
          },
          G = {
            major: Number(Ie[2]),
            minor: Number(Ie[3]),
            build: Number(Ie[4]),
            beta: Number(Ie[5]),
            rerelease: Number(re[6]) ? Number(re[6]) : void 0,
          };
        if (K.major > G.major) return -1;
        if (K.major < G.major) return 1;
        if (K.minor > G.minor) return -1;
        if (K.minor < G.minor) return 1;
        if (K.build > G.build) return -1;
        if (K.build < G.build) return 1;
        if (K.beta > G.beta) return G.beta === 0 ? 1 : -1;
        if (K.beta < G.beta) return K.beta === 0 ? -1 : 1;
        if (K.rerelease && G.rerelease) {
          if (K.beta > G.beta) return -1;
          if (K.beta < G.beta) return 1;
        } else {
          if (!K.rerelease && G.rerelease) return -1;
          if (K.rerelease && !G.rerelease) return 1;
        }
        return 0;
      }
      je._sortProjectSettingsSDKListCB = fe;
      function E(ue) {
        let oe = [],
          Ee = RegExp(/\d\.\d\.\d\.\d/);
        return (
          ue.forEach((ye) => {
            Ee.test(ye)
              ? oe.push(ye)
              : console.error(`Version Not Compadable: ${ye}`);
          }),
          oe.sort(Z),
          oe[0] ? oe[0] : []
        );
      }
      je.getLatestControllerVersion = E;
      function Z(ue, oe) {
        var Ee = ue.toUpperCase(),
          ye = oe.toUpperCase();
        let re = Ee.split("."),
          Ie = ye.split("."),
          K = {
            major: Number(re[0]),
            minor: Number(re[1]),
            build: Number(re[2]),
            beta: Number(re[3]),
          },
          G = {
            major: Number(Ie[0]),
            minor: Number(Ie[1]),
            build: Number(Ie[2]),
            beta: Number(Ie[3]),
          };
        return K.major > G.major
          ? -1
          : K.major < G.major
            ? 1
            : K.minor > G.minor
              ? -1
              : K.minor < G.minor
                ? 1
                : K.build > G.build
                  ? -1
                  : K.build < G.build
                    ? 1
                    : K.beta > G.beta
                      ? G.beta === 0
                        ? 1
                        : -1
                      : K.beta < G.beta
                        ? K.beta === 0
                          ? -1
                          : 1
                        : 0;
      }
      function we(ue) {
        let oe = 0,
          Ee = 0,
          ye = 0,
          re = 0,
          Ie = "";
        return (
          ue.forEach(function (K) {
            let G = 0,
              Et = 0,
              Vt = 0,
              X = -1,
              Se = K.split(".");
            if (
              ((G = parseInt(Se[0])),
              (Et = parseInt(Se[1])),
              (Vt = parseInt(Se[2])),
              (X = parseInt(Se[3])),
              !(G < oe) &&
                (G > oe && ((Ee = 0), (ye = 0), (re = -1)),
                !(Et < Ee) &&
                  (Et > Ee && ((ye = 0), (re = -1)),
                  !(Vt < ye) && (Vt > ye && (re = -1), !(X < re)))))
            ) {
              if (re > X)
                if (X === 0) re = X;
                else return;
              else if (re < X) {
                if (re === 0) return;
                re = X;
              }
              (oe = G), (Ee = Et), (ye = Vt), (re = X), (Ie = K);
            }
          }),
          Ie
        );
      }
      je.getLatestFileVersion = we;
      function Ze(ue) {
        let oe = ue.split("_");
        return oe.shift(), oe.shift(), oe.join(".");
      }
      je.fileNameToVersion = Ze;
      function Re(ue, oe) {
        let Ee = ue.split(".");
        return Ee.unshift(oe), Ee.unshift("VEXOS"), Ee.join("_");
      }
      je.versionToFileName = Re;
    })((ie = de.vexos || (de.vexos = {})));
  })((a = c.Utils || (c.Utils = {})));
})(i || (i = {}));
var _ = class {
  static _toCommandResponse(t, e) {
    return {
      command: t?.cmdID ? t.cmdID : h.CommandID.unknown,
      details: `${h.getErrorCodeDetails(t.exitCode)} ${t.stderr} | ${t.cmdStr}`,
      statusCode: t.exitCode,
      json: e || "{}",
    };
  }
  isTypeOf(t) {
    return t instanceof _;
  }
  get platform() {
    return this._platform;
  }
  get device() {
    return this._device;
  }
  get bootMode() {
    return this._bootMode;
  }
  static async listDevices(t, e = void 0) {
    let o = i.Extension.getVexcomUri(i.Extension.context),
      s = new h(o.fsPath, t, { active: !1, maxCmds: 0 }),
      r = "";
    s.on("Data", (a, c) => {
      r += c;
    });
    let n = await s.listUSB(e);
    return _._toCommandResponse(n, r);
  }
};
((t) => {
  let y;
  ((a) => (
    (a.unknown = "unknown"),
    (a.dfu = "dfu"),
    (a.ram = "ram"),
    (a.rom = "rom"),
    (a.app = "app")
  ))((y = t.BootMode || (t.BootMode = {})));
})(_ || (_ = {}));
var ro = class {
  constructor(t) {
    this._devicePath = t;
  }
};
var _s = require("serialport"),
  Ft = class extends ro {
    constructor(e, o = 115200) {
      super(e);
      e &&
        (this._serialPort = new _s.SerialPort({
          path: e,
          baudRate: o,
          parity: "none",
          stopBits: 1,
          xoff: !0,
          xon: !0,
          autoOpen: !1,
        }));
    }
    get serialPort() {
      return this?._serialPort;
    }
    get isOpen() {
      return this?._serialPort?.isOpen;
    }
    write(e) {
      this?._serialPort?.write(e, "utf8");
    }
    read(e) {
      this?._serialPort.read(e);
    }
    close(e) {
      e ? this?._serialPort.close((o) => e(o)) : this?._serialPort.close();
    }
    open(e) {
      e ? this?._serialPort.open((o) => e(o)) : this?._serialPort.open();
    }
    registerCallback(e, o) {
      switch (e) {
        case "OnRecieveData":
          this?._serialPort?.removeAllListeners("data"),
            this?._serialPort?.on("data", o),
            console.log(this?._serialPort.listeners("data"));
        case "OnOpen":
          this?._serialPort?.on("open", o);
      }
    }
  };
var No = class extends ro {
  constructor(e, o) {
    super(e);
    let s = i.Extension.getVexcomUri(i.Extension.context);
    this._vexcom = new h(s.fsPath, this._devicePath, {
      active: !0,
      maxCmds: 0,
    });
  }
  get childProcess() {
    return this?._vexcomCP ? this?._vexcomCP : void 0;
  }
  get isOpen() {
    return this?._vexcomCP ? !this._vexcomCP?.exitCode : !1;
  }
  async open(e) {
    if (this.isOpen) return;
    let o = this._vexcom.openUserPort(this._devicePath);
    return (
      (this._vexcomCP = await o[0]),
      e && e(void 0),
      i.Utils._toCommandResponse(await o[1])
    );
  }
  write(e) {
    this?._vexcomCP?.stdin?.write(e, "utf8");
  }
  read(e) {}
  async close(e) {
    if (!this?._vexcomCP) return;
    let o = this._vexcomCP;
    for (; o?.exitCode === null; )
      o?.stdin?.write(new Uint8Array([3])), await i.Utils.asyncSleep(100);
    e && e(void 0), (this._vexcomCP = void 0);
  }
  registerCallback(e, o) {
    switch (e) {
      case "OnRecieveData":
        this?._vexcom?.on("UserRX", (s, r) => o(r));
      case "OnOpen":
    }
  }
};
var Ro = L(require("os")),
  H = class extends _ {
    constructor(e, o = !1, s) {
      super();
      this._vexcomDataHolder = "";
      this._dataResultArr = [];
      this._needsVexosUpdate = !1;
      (this._vexcomDataHolder = ""),
        (this._dataResultArr = []),
        (this._platform = e.platform),
        (this._device = e.device),
        (this._robotName = e.robotName),
        (this._communicationPath = e.communication),
        (this._userPath = e.user),
        (this._id = e.id),
        (this._teamNumber = e.teamNumber),
        (this._systemInfoJSON = e.json),
        this.parseSystemInfoJSON(this._systemInfoJSON),
        !this._userPath &&
        this._platform === i.Platform.V5 &&
        this._device === i.Device.Controller
          ? (this._userPort = new No(this._communicationPath))
          : (this._userPort = new Ft(this._userPath));
      let r = i.Extension.getVexcomUri(i.Extension.context);
      (this._vexcom = new h(r.fsPath, this._communicationPath, {
        active: !0,
        maxCmds: 0,
      })),
        this._vexcom.on("Data", (n, a) => {
          this._onVexcomDataRecieved(this, n, a);
        }),
        this._vexcom.on("Error", (n, a) => {
          this._onVexcomErrorRecieved(this, n, a);
        }),
        this._vexcom.on("Exit", (n, a) => {
          this._onVexcomExitRecieved(this, n, a);
        });
    }
    async play(e) {
      let o = await this._vexcom.play(e);
      return _._toCommandResponse(o);
    }
    async stop() {
      let e = await this._vexcom.stop();
      return _._toCommandResponse(e);
    }
    async erase(e) {
      let o = await this._vexcom.eraseUserProgram(e);
      return _._toCommandResponse(o);
    }
    async downloadPythonVM(e) {
      let o = {
          location: Kt.ProgressLocation.Notification,
          title: "Python VM Update: ",
          cancellable: !1,
        },
        s = await this._handleProgress(
          () => this._vexcom.downloadPythonVM(e?.fsPath),
          o,
        );
      return await this.systemInfo(), _._toCommandResponse(s);
    }
    async systemInfo() {
      let e = await this._vexcom.systemInfo(),
        o = _._toCommandResponse(e, this._dataResultArr.shift());
      return (
        o.statusCode !== h.ExitCode.vexCMDQueueDownloadActive &&
          ((this._systemInfoJSON = o.json),
          this.parseSystemInfoJSON(this._systemInfoJSON)),
        o
      );
    }
    static async systemInfo(e) {
      let o = i.Extension.getVexcomUri(i.Extension.context),
        r = await new h(o.fsPath, e, { active: !1, maxCmds: 0 }).systemInfo();
      return _._toCommandResponse(r, r.stdout);
    }
    static async listDevices(e) {
      let o = i.Extension.getVexcomUri(i.Extension.context),
        s = new h(o.fsPath, e, { active: !1, maxCmds: 0 }),
        r = "";
      s.on("Data", (a, c) => {
        r += c;
      });
      let n = await s.listUSB();
      return _._toCommandResponse(n, r);
    }
    async systemStatus() {
      let e = await this._vexcom.systemStatus(),
        o = _._toCommandResponse(e, this._dataResultArr.shift());
      return (
        (this._systemInfoJSON = o.json),
        this.parseSystemInfoJSON(this._systemInfoJSON),
        o
      );
    }
    static async getVexcomVersion(e) {
      let o = i.Extension.getVexcomUri(i.Extension.context),
        s = new h(o.fsPath, "", { active: !0, maxCmds: 0 }),
        r = "";
      s.on("Data", (a, c) => {
        r += c;
      });
      let n = await s.getVersion();
      return _._toCommandResponse(n, r);
    }
    static async systemDFU(e, o) {
      let s = i.Extension.getVexcomUri(i.Extension.context),
        r = new h(s.fsPath, "", { active: !1, maxCmds: 0 }),
        n = {
          location: Kt.ProgressLocation.Notification,
          title: "Controller Usb Update: ",
          cancellable: !1,
        },
        a = await r.recoverFromDFU(o.toString().toLowerCase());
      return _._toCommandResponse(a);
    }
    async setTeamName(e) {
      let o = await this._vexcom.setTeamNumber(e);
      return (
        o.exitCode === h.ExitCode.vexSucess && (this._teamNumber = e),
        _._toCommandResponse(o)
      );
    }
    async setRobotName(e) {
      let o = await this._vexcom.setRobotName(e);
      return (
        o.exitCode === h.ExitCode.vexSucess && (this._robotName = e),
        _._toCommandResponse(o)
      );
    }
    async screenGrab(e) {
      let o = await this._vexcom.screenGrab(e.fsPath);
      return _._toCommandResponse(o);
    }
    async uploadEventLog(e = 1e3) {
      let o = {
          location: Kt.ProgressLocation.Notification,
          title: "Upload Event Log: ",
          cancellable: !1,
        },
        s = await this._handleProgress(async () => {
          let r = this._vexcom.uploadEventLog(e);
          return await i.Utils.asyncSleep(1e3), r;
        }, o);
      return _._toCommandResponse(s, this._dataResultArr.shift());
    }
    async batteryMedic() {
      let e = await this._vexcom.batteryMedic();
      return _._toCommandResponse(e);
    }
    async systemUpdate(e, o = !1) {
      let s = {
          location: Kt.ProgressLocation.Notification,
          title: "Vexos Update: ",
          cancellable: !1,
        },
        r = await this._handleProgress(
          () => this._vexcom.sytemUpdate(e.fsPath, o),
          s,
        );
      return _._toCommandResponse(r);
    }
    parseSystemInfoJSON(e) {
      let o = JSON.parse(e),
        s;
      if (o.v5) s = o.v5;
      else if (o.iq2) s = o.iq2;
      else if (o.exp) s = o.exp;
      else if (o?.unknown?.controller_boot) s = o.unknown;
      else {
        this._systemInfoJSON = "{}";
        return;
      }
      (this._filesInfo = o.files),
        (this._systemInfo = s),
        s?.brain?.bootloader
          ? (s?.brain?.bootloader === _.BootMode.ram ||
            s?.brain?.bootloader === _.BootMode.rom
              ? (this._bootMode = s?.brain?.bootloader)
              : (this._bootMode = _.BootMode.unknown),
            (this._robotName = ""),
            (this._id = ""),
            (this._teamNumber = ""))
          : s?.brain
            ? ((this._bootMode = _.BootMode.app),
              (this._robotName = s.brain.name),
              (this._id = s.brain.ssn),
              (this._teamNumber = s.brain.team))
            : s?.controller
              ? ((this._bootMode = _.BootMode.app),
                (this._robotName = ""),
                (this._id = ""),
                (this._teamNumber = ""))
              : s?.controller_boot &&
                ((this._bootMode = _.BootMode.rom),
                (this._robotName = ""),
                (this._id = ""),
                (this._teamNumber = ""));
    }
    parseSystemStatusJSON(e) {
      let o = JSON.parse(e),
        s;
      if (o.v5) s = o.v5;
      else if (o.iq2) s = o.iq2;
      else if (o.exp) s = o.exp;
      else {
        this._systemInfoJSON = "{}";
        return;
      }
      (this._filesInfo = o.files),
        (this._systemInfo = s),
        s?.system?.bootloader
          ? (s?.brain?.bootloader === _.BootMode.ram ||
            s?.brain?.bootloader === _.BootMode.rom
              ? (this._bootMode = s?.brain?.bootloader)
              : (this._bootMode = _.BootMode.unknown),
            (this._robotName = `${this._bootMode}`),
            (this._id = ""),
            (this._teamNumber = ""))
          : s?.brain
            ? ((this._bootMode = _.BootMode.app),
              (this._robotName = s.brain.name),
              (this._id = s.brain.ssn),
              (this._teamNumber = s.brain.team))
            : s?.controller;
    }
    async _isControllerRadioLinked(e = h.CommandID.unknown, o = !1) {
      if (
        (o || (await this.systemInfo()),
        (Number(this._systemInfo?.controller?.flags) & H.RADIO_LINK) !==
          H.RADIO_LINK)
      ) {
        let s = {
          command: e,
          details: `${this._platform} ${this._device} not linked to brain`,
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
        return o || (await this.systemInfo()), s;
      }
      return null;
    }
    async _isControllerTethered(e = h.CommandID.unknown, o = !1) {
      if (
        (o || (await this.systemInfo()),
        (Number(this._systemInfo?.controller?.flags) & H.TETHER_LINK) !==
          H.TETHER_LINK)
      ) {
        let s = {
          command: e,
          details: `${this._platform} ${this._device} not tethered to brain`,
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
        return o || (await this.systemInfo()), s;
      }
      return null;
    }
    get robotName() {
      return this._robotName;
    }
    get id() {
      return this._id;
    }
    get teamNumber() {
      return this._teamNumber;
    }
    get bootMode() {
      return this._bootMode;
    }
    get platform() {
      return this._platform;
    }
    get device() {
      return this._device;
    }
    get json() {
      return this._systemInfoJSON;
    }
    get vexComSystemInfo() {
      return this._systemInfo;
    }
    get vexcomFilesInfo() {
      return this._filesInfo;
    }
    get activeCommand() {
      return this._vexcom.activeCommand.cmdID;
    }
    get communication() {
      return this._communicationPath;
    }
    get user() {
      return this._userPath;
    }
    get userPort() {
      return this?._userPort;
    }
    async _handleProgress(e, o) {
      let s,
        r = async (n, a) => (
          n?.report({ increment: 0, message: "preparing . . . " }), await e()
        );
      {
        let n = Kt.window.withProgress(o, async (a, c) => {
          this._progress
            ? ((s = r(a, c)), await s)
            : ((this._lastProgress = 0),
              (this._progress = a),
              (s = r(a, c)),
              await s,
              (this._progress = void 0));
        });
        for (; !s; ) await i.Utils.asyncSleep(100);
      }
      return s;
    }
    _onVexcomDataRecieved(e, o, s) {
      switch (o) {
        case h.CommandID.systemStatus:
        case h.CommandID.systemInfo:
          e._vexcomDataHolder += s;
          break;
        case h.CommandID.controllerRadioUpdate:
        case h.CommandID.controllerUsbUpdate:
        case h.CommandID.downloadUserProgram:
        case h.CommandID.downloadPythonVM:
        case h.CommandID.systemUpdate:
          let r;
          try {
            r = JSON.parse(s) ? JSON.parse(s) : "";
          } catch {
            return;
          }
          let n = r.percent - this._lastProgress;
          (this._lastProgress = r.percent),
            this._progress?.report({
              increment: n,
              message: `${r.action.toUpperCase()}:${r.phase.toUpperCase()} ${r.percent}%`,
            });
          break;
        case h.CommandID.uploadEventLog:
          console.log(s);
          let a = [];
          s = e._vexcomDataHolder + s;
          let c = 0;
          if ((Ro.EOL, Ro.type() === "Windows_NT")) {
            for (let l = 0; l < s.length - 2; l++)
              if (
                s[l] === "}" &&
                s[l + 1] === "\r" &&
                s[l + 2] ===
                  `
`
              ) {
                let p = s.substring(c, l + 3);
                i.Utils.isJsonString(p) && (a.push(JSON.parse(p)), (c = l + 3));
              }
          } else
            for (let l = 0; l < s.length - 1; l++)
              if (
                s[l] === "}" &&
                s[l + 1] ===
                  `
`
              ) {
                let p = s.substring(c, l + 2);
                i.Utils.isJsonString(p) && (a.push(JSON.parse(p)), (c = l + 2));
              }
          c !== s.length
            ? (e._vexcomDataHolder = s.substring(c, s.length))
            : (e._vexcomDataHolder = ""),
            a.forEach((l) => {
              if (l?.percent) {
                let p = l.percent - this._lastProgress;
                (this._lastProgress = l.percent),
                  this._progress?.report({
                    increment: p,
                    message: `${l.action.toUpperCase()}:${l.phase.toUpperCase()} ${l.percent}%`,
                  });
              }
              l?.log && (e._vexcomDataHolder = JSON.stringify(l));
            });
          break;
      }
    }
    _onVexcomErrorRecieved(e, o, s) {}
    _onVexcomExitRecieved(e, o, s) {
      switch (o) {
        case h.CommandID.systemStatus:
        case h.CommandID.systemInfo:
          e._dataResultArr.push(e._vexcomDataHolder),
            (e._vexcomDataHolder = "");
          break;
        case h.CommandID.uploadEventLog:
          e._dataResultArr.push(e._vexcomDataHolder),
            (e._vexcomDataHolder = "");
          break;
      }
    }
    static isTypeOf(e) {
      return e instanceof H;
    }
    static toCommandResponse(e, o) {
      return {
        command: e?.cmdID ? e.cmdID : h.CommandID.unknown,
        details: `${h.getErrorCodeDetails(e.exitCode)} ${e.stderr} | ${e.cmdStr}`,
        statusCode: e.exitCode,
        json: o || "{}",
      };
    }
  };
((s) => {
  (s.NO_CONNECT = 0), (s.TETHER_LINK = 1), (s.RADIO_LINK = 2);
  let o;
  ((a) => (
    (a[(a.V5ControllerNotSupported = -1)] = "V5ControllerNotSupported"),
    (a[(a.SerialPortIOError = -2)] = "SerialPortIOError")
  ))((o = s.Error || (s.Error = {})));
})(H || (H = {}));
var Is = L(require("vscode"));
var Dt = class extends H {
  constructor(t, e = !1, o) {
    super(t, e, o);
  }
  async downloadUserProgram(t, e, o, s, r = !1) {
    switch (this._device) {
      case i.Device.Brain:
        if (this._bootMode !== _.BootMode.app)
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} running ${this._bootMode} bootloader`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        let n = await this._vexcom.downloadUserProgram(
          t,
          e,
          s.fsPath,
          o,
          r,
          !1,
        );
        return _._toCommandResponse(n);
      case i.Device.Unknown:
      default:
        return {
          command: h.CommandID.downloadUserProgram,
          details: "Unknown Device Connected",
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
    }
  }
  async systemUpdate(t, e = !1) {
    let o = {
        location: Is.ProgressLocation.Notification,
        title: "Vexos Update: ",
        cancellable: !1,
      },
      s = await this._handleProgress(
        () => this._vexcom.sytemUpdate(t.fsPath, e),
        o,
      );
    return _._toCommandResponse(s);
  }
  get needsVexosUpdate() {
    return this._needsVexosUpdate;
  }
  set needsVexosUpdate(t) {
    this._needsVexosUpdate = t;
  }
};
var Ds = L(require("vscode"));
var tt = class extends H {
  constructor(e, o = !1, s) {
    super(e, o, s);
    this._needsRadioUpdate = !1;
    this._needsUsbUpDate = !1;
  }
  async downloadUserProgram(
    e,
    o,
    s,
    r,
    n = !1,
    a = h.DownloadChannel.vexNoChannel,
  ) {
    await this._userPort.close(), await super.systemInfo();
    let c = await super._isControllerRadioLinked(h.CommandID.unknown, !0),
      l = await super._isControllerTethered(h.CommandID.unknown, !0);
    if (c && l) return (c.command = h.CommandID.downloadUserProgram), c;
    let p = {
        location: Ds.ProgressLocation.Notification,
        title: "Program Download: ",
        cancellable: !1,
      },
      f = await this._handleProgress(
        () => this._vexcom.downloadUserProgram(e, o, r.fsPath, s, n, !0, a),
        p,
      );
    return console.log(f), this._userPort.open(), _._toCommandResponse(f);
  }
  async play(e) {
    this._userPort.close();
    let o = await super.systemInfo();
    if (o.statusCode !== h.ExitCode.vexSucess) return o;
    let s = await super.play(e);
    return this._userPort.open(), s;
  }
  async stop() {
    this._userPort.close();
    let e = await super.systemInfo();
    return e.statusCode !== h.ExitCode.vexSucess ? e : await super.stop();
  }
  async erase(e) {
    this._userPort.close();
    let o = await super.erase(e),
      s = await super.systemInfo();
    return s.statusCode !== h.ExitCode.vexSucess
      ? s
      : (this._userPort.open(), o);
  }
  async setRobotName(e) {
    this._userPort.close();
    let o = await super.setRobotName(e),
      s = await super.systemInfo();
    return s.statusCode !== h.ExitCode.vexSucess
      ? s
      : (this._userPort.open(), o);
  }
  async setTeamName(e) {
    this._userPort.close();
    let o = await super.setTeamName(e),
      s = await super.systemInfo();
    return s.statusCode !== h.ExitCode.vexSucess
      ? s
      : (this._userPort.open(), o);
  }
  async screenGrab(e) {
    this._userPort.close();
    let o = await super.screenGrab(e);
    return this._userPort.open(), o;
  }
  async uploadEventLog() {
    this._userPort.close();
    let e = await super._isControllerRadioLinked(h.CommandID.unknown, !0),
      o = await super._isControllerTethered(h.CommandID.unknown, !0);
    if (e && o) return (e.command = h.CommandID.uploadEventLog), e;
    let s = await super.uploadEventLog();
    return this._userPort.open(), s;
  }
  async batteryMedic() {
    this._userPort.close();
    let e = await super.batteryMedic();
    return this._userPort.open(), e;
  }
  async downloadPythonVM(e) {
    await this._userPort.close();
    let o = await super.downloadPythonVM(e);
    return this._userPort.open(), o;
  }
  async systemInfo() {
    let e = this._userPort.isOpen;
    e && (await this._userPort.close());
    let o = await super.systemInfo();
    return e || this._userPort.open(), o;
  }
  async systemUpdate(e, o = !1) {
    this._userPort.close();
    let s = await super._isControllerTethered(h.CommandID.systemUpdate);
    if (s) return s;
    let r = await this._isBrainBatteryLow(h.CommandID.systemUpdate);
    if (r) return r;
    let n = await super.systemUpdate(e, o);
    return this._userPort.open(), n;
  }
  async _isBrainBatteryLow(e = h.CommandID.unknown) {
    if ((await super.systemInfo(), this._systemInfo?.system?.low_battery)) {
      let o = {
        command: e,
        details: `${this._platform} ${this._device},  ${this._platform} ${i.Device.Brain} battery (${this._systemInfo?.system?.battery}%) low. VEXos update not allowed`,
        json: "{}",
        statusCode: h.ExitCode.vexError,
      };
      return await super.systemInfo(), o;
    }
    return null;
  }
  get needsRadioUpdate() {
    return this._needsRadioUpdate;
  }
  set needsRadioUpdate(e) {
    this._needsRadioUpdate = e;
  }
  get needsUsbUpdate() {
    return this._needsUsbUpDate;
  }
  set needsUsbUpdate(e) {
    this._needsUsbUpDate = e;
  }
  get needsVexosUpdate() {
    return (
      (this._needsVexosUpdate = this._needsUsbUpDate && this._needsRadioUpdate),
      this._needsUsbUpDate && this._needsRadioUpdate
    );
  }
  set needsVexosUpdate(e) {
    this._needsVexosUpdate = e;
  }
};
var Ps = L(require("vscode"));
var xt = class extends H {
  constructor(t, e = !1, o) {
    super(t, e, o);
  }
  async downloadUserProgram(t, e, o, s, r = !1) {
    switch (this._device) {
      case i.Device.Brain:
        if (this._bootMode !== _.BootMode.app)
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} running ${this._bootMode} bootloader`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        let n = await this._vexcom.downloadUserProgram(
          t,
          e,
          s.fsPath,
          o,
          r,
          !1,
        );
        return _._toCommandResponse(n);
      case i.Device.Unknown:
      default:
        return {
          command: h.CommandID.downloadUserProgram,
          details: "Unknown Device Connected",
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
    }
  }
  async systemUpdate(t, e = !1) {
    let o = {
        location: Ps.ProgressLocation.Notification,
        title: "Vexos Update: ",
        cancellable: !1,
      },
      s = await this._handleProgress(
        () => this._vexcom.sytemUpdate(t.fsPath, e),
        o,
      );
    return _._toCommandResponse(s);
  }
  get needsVexosUpdate() {
    return this._needsVexosUpdate;
  }
  set needsVexosUpdate(t) {
    this._needsVexosUpdate = t;
  }
};
var no = L(require("vscode"));
var nt = class extends H {
  constructor(e, o = !1, s) {
    super(e, o, s);
    this._needsRadioUpdate = !1;
    this._needsUsbUpDate = !1;
  }
  async downloadUserProgram(e, o, s, r, n = !1) {
    switch (this._device) {
      case i.Device.Controller:
        if (!this._systemInfo?.controller?.flags)
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} No Radio Status`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        if (
          (Number(this._systemInfo?.controller?.flags) & 2) !== 2 &&
          this._systemInfo?.brain === void 0
        )
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} Not Linked to brain`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        let a = {
          location: no.ProgressLocation.Notification,
          title: "Program Download: ",
          cancellable: !1,
        };
        if (
          this._platform === i.Platform.EXP ||
          this._platform === i.Platform.IQ2
        ) {
          let l = await this._handleProgress(
            () => this._vexcom.downloadUserProgram(e, o, r.fsPath, s, n, !0),
            a,
          );
          return _._toCommandResponse(l);
        } else
          return {
            command: h.CommandID.downloadUserProgram,
            details: "Unknown Device Connected",
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
      case i.Device.Unknown:
      default:
        return {
          command: h.CommandID.downloadUserProgram,
          details: "Unknown Device Connected",
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
    }
  }
  async controllerUsbUpdate(e) {
    let o = {
        location: no.ProgressLocation.Notification,
        title: `${this.platform} ${this.device} Usb Update: `,
        cancellable: !1,
      },
      s = await this._handleProgress(async () => {
        this._progress?.report({ increment: 50, message: "50%" });
        let r = await this._vexcom.controllerAtmelFirmwareUpdate(e.fsPath);
        return (
          r.exitCode === h.ExitCode.vexSucess &&
            ((this._needsUsbUpDate = !1),
            this._progress?.report({ increment: 50, message: "100%" }),
            await i.Utils.asyncSleep(100)),
          r
        );
      }, o);
    return _._toCommandResponse(s);
  }
  async controllerRadioUpdate(e) {
    let o = {
        location: no.ProgressLocation.Notification,
        title: `${this.platform} ${this.device} Radio Update: `,
        cancellable: !1,
      },
      s = await this._handleProgress(
        () => this._vexcom.controllerRadioFirmwareUpdate(e.fsPath),
        o,
      );
    return (
      s.exitCode === h.ExitCode.vexSucess && (this._needsRadioUpdate = !1),
      _._toCommandResponse(s)
    );
  }
  async controllerUpdate(e) {
    let o = {
      location: no.ProgressLocation.Notification,
      title: `${this.platform} ${this.device} Update: `,
      cancellable: !1,
    };
    return (
      await this.controllerRadioUpdate(e), await this.controllerUsbUpdate(e)
    );
  }
  static async controllerUsbUpdate(e) {
    let o = i.Extension.getVexcomUri(i.Extension.context),
      s = new h(o.fsPath, "", { active: !1, maxCmds: 0 }),
      r = {
        location: no.ProgressLocation.Notification,
        title: "Controller Usb Update: ",
        cancellable: !1,
      },
      n = await s.controllerAtmelFirmwareUpdate(e.fsPath);
    return _._toCommandResponse(n);
  }
  async uploadEventLog() {
    let e = await super._isControllerRadioLinked();
    return e
      ? ((e.command = h.CommandID.uploadEventLog), e)
      : await super.uploadEventLog();
  }
  get needsRadioUpdate() {
    return this._needsRadioUpdate;
  }
  set needsRadioUpdate(e) {
    this._needsRadioUpdate = e;
  }
  get needsUsbUpdate() {
    return this._needsUsbUpDate;
  }
  set needsUsbUpdate(e) {
    this._needsUsbUpDate = e;
  }
  get needsVexosUpdate() {
    return (
      (this._needsVexosUpdate = this._needsUsbUpDate && this._needsRadioUpdate),
      this._needsUsbUpDate && this._needsRadioUpdate
    );
  }
  set needsVexosUpdate(e) {
    this._needsVexosUpdate = e;
  }
};
var Us = L(require("vscode"));
var bt = class extends H {
  constructor(t, e = !1) {
    super(t, e);
  }
  async downloadUserProgram(t, e, o, s, r = !1) {
    switch (this._device) {
      case i.Device.Brain:
        if (this._bootMode !== _.BootMode.app)
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} running ${this._bootMode} bootloader`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        let n = await this._vexcom.downloadUserProgram(
          t,
          e,
          s.fsPath,
          o,
          r,
          !1,
        );
        return _._toCommandResponse(n);
      case i.Device.Unknown:
      default:
        return {
          command: h.CommandID.downloadUserProgram,
          details: "Unknown Device Connected",
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
    }
  }
  async systemUpdate(t, e = !1) {
    let o = {
        location: Us.ProgressLocation.Notification,
        title: "Vexos Update: ",
        cancellable: !1,
      },
      s = await this._handleProgress(
        () => this._vexcom.sytemUpdate(t.fsPath, e),
        o,
      );
    return _._toCommandResponse(s);
  }
  get needsVexosUpdate() {
    return this._needsVexosUpdate;
  }
  set needsVexosUpdate(t) {
    this._needsVexosUpdate = t;
  }
};
var ao = L(require("vscode"));
var Ye = class extends H {
  constructor(e, o = !1, s) {
    super(e, o, s);
    this._needsRadioUpdate = !1;
    this._needsUsbUpDate = !1;
  }
  async downloadUserProgram(e, o, s, r, n = !1) {
    switch (this._device) {
      case i.Device.Controller:
        if (!this._systemInfo?.controller?.flags)
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} No Radio Status`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        if (
          (Number(this._systemInfo?.controller?.flags) & 2) !== 2 &&
          this._systemInfo?.brain === void 0
        )
          return {
            command: h.CommandID.downloadUserProgram,
            details: `${this._platform} ${this._device} Not Linked to brain`,
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
        let a = {
          location: ao.ProgressLocation.Notification,
          title: "Program Download: ",
          cancellable: !1,
        };
        if (
          this._platform === i.Platform.EXP ||
          this._platform === i.Platform.IQ2
        ) {
          let l = await this._handleProgress(
            () => this._vexcom.downloadUserProgram(e, o, r.fsPath, s, n, !0),
            a,
          );
          return _._toCommandResponse(l);
        } else
          return {
            command: h.CommandID.downloadUserProgram,
            details: "Unknown Device Connected",
            json: "{}",
            statusCode: h.ExitCode.vexError,
          };
      case i.Device.Unknown:
      default:
        return {
          command: h.CommandID.downloadUserProgram,
          details: "Unknown Device Connected",
          json: "{}",
          statusCode: h.ExitCode.vexError,
        };
    }
  }
  async controllerUsbUpdate(e) {
    let o = {
        location: ao.ProgressLocation.Notification,
        title: `${this.platform} ${this.device} Usb Update: `,
        cancellable: !1,
      },
      s = await this._handleProgress(async () => {
        this._progress?.report({ increment: 50, message: "50%" });
        let r = await this._vexcom.controllerAtmelFirmwareUpdate(e.fsPath);
        return (
          r.exitCode === h.ExitCode.vexSucess &&
            ((this._needsUsbUpDate = !1),
            this._progress?.report({ increment: 50, message: "100%" }),
            await i.Utils.asyncSleep(100)),
          r
        );
      }, o);
    return _._toCommandResponse(s);
  }
  async controllerRadioUpdate(e) {
    let o = {
        location: ao.ProgressLocation.Notification,
        title: `${this.platform} ${this.device} Radio Update: `,
        cancellable: !1,
      },
      s = await this._handleProgress(
        () => this._vexcom.controllerRadioFirmwareUpdate(e.fsPath),
        o,
      );
    return (
      s.exitCode === h.ExitCode.vexSucess && (this._needsRadioUpdate = !1),
      _._toCommandResponse(s)
    );
  }
  async controllerUpdate(e) {
    let o = {
      location: ao.ProgressLocation.Notification,
      title: `${this.platform} ${this.device} Update: `,
      cancellable: !1,
    };
    return (
      await this.controllerRadioUpdate(e), await this.controllerUsbUpdate(e)
    );
  }
  static async controllerUsbUpdate(e) {
    let o = i.Extension.getVexcomUri(i.Extension.context),
      s = new h(o.fsPath, "", { active: !1, maxCmds: 0 }),
      r = {
        location: ao.ProgressLocation.Notification,
        title: "Controller Usb Update: ",
        cancellable: !1,
      },
      n = await s.controllerAtmelFirmwareUpdate(e.fsPath);
    return _._toCommandResponse(n);
  }
  async uploadEventLog() {
    let e = await super._isControllerRadioLinked();
    return e
      ? ((e.command = h.CommandID.uploadEventLog), e)
      : await super.uploadEventLog();
  }
  get needsRadioUpdate() {
    return this._needsRadioUpdate;
  }
  set needsRadioUpdate(e) {
    this._needsRadioUpdate = e;
  }
  get needsUsbUpdate() {
    return this._needsUsbUpDate;
  }
  set needsUsbUpdate(e) {
    this._needsUsbUpDate = e;
  }
  get needsVexosUpdate() {
    return (
      (this._needsVexosUpdate = this._needsUsbUpDate && this._needsRadioUpdate),
      this._needsUsbUpDate && this._needsRadioUpdate
    );
  }
  set needsVexosUpdate(e) {
    this._needsVexosUpdate = e;
  }
};
var ys = L(require("vscode"));
var Fe = class extends _ {
  constructor(e) {
    super();
    this._vexcomDataHolder = "";
    this._dataResultArr = [];
    this._vid = "";
    this._pid = "";
    this._id = 0;
    (this._bootMode = e.bootMode),
      (this._platform = e.platform),
      (this._device = e.device),
      (this._vid = e.vid),
      (this._pid = e.pid),
      (this._id = e.id);
    let o = i.Extension.getVexcomUri(i.Extension.context);
    (this._vexcom = new h(o.fsPath, "", { active: !0, maxCmds: 0 })),
      this._vexcom.on("Data", (s, r) => {
        this._onVexcomDataRecieved(this, s, r);
      }),
      this._vexcom.on("Error", (s, r) => {
        this._onVexcomErrorRecieved(this, s, r);
      }),
      this._vexcom.on("Exit", (s, r) => {
        this._onVexcomExitRecieved(this, s, r);
      });
  }
  get activeCommand() {
    return this._vexcom.activeCommand.cmdID;
  }
  static isTypeOf(e) {
    return e instanceof Fe;
  }
  get pid() {
    return this._pid;
  }
  get vid() {
    return this._vid;
  }
  async _handleProgress(e, o) {
    let s,
      r = async (n, a) => (
        n?.report({ increment: 0, message: "preparing . . . " }), await e()
      );
    {
      let n = ys.window.withProgress(o, async (a, c) => {
        this._progress ||
          ((this._lastProgress = 0),
          (this._progress = a),
          (s = r(a, c)),
          await s,
          (this._progress = void 0));
      });
    }
    return s;
  }
  _onVexcomDataRecieved(e, o, s) {
    switch (o) {
      case h.CommandID.systemStatus:
      case h.CommandID.systemInfo:
        e._vexcomDataHolder += s;
        break;
      case h.CommandID.controllerRadioUpdate:
      case h.CommandID.controllerUsbUpdate:
      case h.CommandID.downloadUserProgram:
      case h.CommandID.downloadPythonVM:
      case h.CommandID.systemUpdate:
        let r;
        try {
          r = JSON.parse(s) ? JSON.parse(s) : "";
        } catch {
          return;
        }
        let n = r.percent - this._lastProgress;
        (this._lastProgress = r.percent),
          this._progress?.report({
            increment: n,
            message: `${r.action.toUpperCase()}:${r.phase.toUpperCase()} ${r.percent}%`,
          });
        break;
    }
  }
  _onVexcomErrorRecieved(e, o, s) {}
  _onVexcomExitRecieved(e, o, s) {
    switch (o) {
      case h.CommandID.systemStatus:
      case h.CommandID.systemInfo:
        e._dataResultArr.push(e._vexcomDataHolder), (e._vexcomDataHolder = "");
        break;
    }
  }
  static toCommandResponse(e, o) {
    return {
      command: e?.cmdID ? e.cmdID : h.CommandID.unknown,
      details: `${h.getErrorCodeDetails(e.exitCode)} ${e.stderr} | ${e.cmdStr}`,
      statusCode: e.exitCode,
      json: o || "{}",
    };
  }
  get id() {
    return this._id;
  }
};
var Xt = class extends Fe {
  constructor(t) {
    super(t);
  }
  async recover() {
    let t = await this._vexcom.recoverFromDFU(this._platform);
    return _._toCommandResponse(t);
  }
};
var Ht = class extends Fe {
  constructor(t) {
    super(t);
  }
  async recover() {
    let t = await this._vexcom.recoverFromDFU(this._platform);
    return _._toCommandResponse(t);
  }
};
var Ss = L(require("vscode"));
var Tt = class extends Fe {
  constructor(t) {
    super(t);
  }
  async recover(t) {
    let e = await this._vexcom.recoverFromDFU(this._platform);
    return _._toCommandResponse(e);
  }
  async controllerUsbUpdate(t) {
    let e = {
        location: Ss.ProgressLocation.Notification,
        title: "Controller Usb Update: ",
        cancellable: !1,
      },
      o = await this._vexcom.controllerAtmelFirmwareUpdate(t.fsPath);
    return _._toCommandResponse(o);
  }
};
var Es = L(require("vscode"));
var kt = class extends Fe {
  constructor(t) {
    super(t);
  }
  async recover(t) {
    let e = await this._vexcom.controllerAtmelFirmwareUpdate(t.fsPath);
    return _._toCommandResponse(e);
  }
  async controllerUsbUpdate(t) {
    let e = {
        location: Es.ProgressLocation.Notification,
        title: "Controller Usb Update: ",
        cancellable: !1,
      },
      o = await this._vexcom.controllerAtmelFirmwareUpdate(t.fsPath);
    return _._toCommandResponse(o);
  }
};
var Yt = L(require("vscode"));
var Vs = L(require("vscode"));
var co = class extends _ {
  constructor(e, o = !1, s) {
    super();
    this._vexcomDataHolder = "";
    this._dataResultArr = [];
    (this._vexcomDataHolder = ""),
      (this._dataResultArr = []),
      (this._platform = e.platform),
      (this._device = e.device),
      (this._name = e.robotName),
      (this._communicationPath = e.communication),
      (this._userPath = e.user),
      (this._id = e.id),
      (this._systemInfoJSON = e.json),
      (this._bootMode = _.BootMode.app),
      (this._userPort = new Ft(this._userPath));
  }
  async _handleProgress(e, o) {
    let s,
      r = async (n, a) => (
        n?.report({ increment: 0, message: "preparing . . . " }), await e()
      );
    {
      let n = Vs.window.withProgress(o, async (a, c) => {
        this._progress ||
          ((this._lastProgress = 0),
          (this._progress = a),
          (s = r(a, c)),
          await s,
          (this._progress = void 0));
      });
    }
    return s;
  }
  get name() {
    return this._name;
  }
  get bootMode() {
    return this._bootMode;
  }
  get platform() {
    return this._platform;
  }
  get device() {
    return this._device;
  }
  get json() {
    return this._systemInfoJSON;
  }
  get systemInfo() {
    return this._systemInfo;
  }
  get userPort() {
    return this?._userPort;
  }
};
var Go = L(require("path"));
var Ue = class extends co {
  constructor(e, o = !1, s) {
    super(e, o, s);
    this._dataHolder = "";
    this._appUpdateList = [];
    this._aliveFailedAttempts = 0;
    this._vexupdateMissing = !1;
    this._fileDownloadInProgress = !1;
    (this._communicationPort = new Ft(this._communicationPath, 115200)),
      this._communicationPort.serialPort.removeAllListeners(),
      this._communicationPort.registerCallback(
        "OnRecieveData",
        this._onComsDataRecievedHandle,
      ),
      (this._isAlive = !1),
      (this._ssidChanged = !1),
      (this._passwordChanged = !1),
      (this._needsUpdate = !1),
      (this._dataHolder = ""),
      (this._vexaicomms = new A(this._communicationPort.serialPort));
  }
  async systemUpdate(e, o = !1) {
    let s = {
      location: Yt.ProgressLocation.Notification,
      title: "Vexos Update: ",
      cancellable: !1,
    };
  }
  get user() {
    return this._userPath;
  }
  get communication() {
    return this._communicationPath;
  }
  get comsPort() {
    return this?._communicationPort;
  }
  get needsUpdate() {
    return this?._needsUpdate;
  }
  set needsUpdate(e) {
    this._needsUpdate = e;
  }
  async checkAlive() {
    this._communicationPort.serialPort.flush();
    let e = await this._vexaicomms.sendAlive();
    return (
      e.exitCode === 0
        ? ((this._isAlive = !0),
          (this._vexupdateMissing = !1),
          (this._aliveFailedAttempts = 0))
        : (this._aliveFailedAttempts++,
          this._aliveFailedAttempts > 10 && (this._vexupdateMissing = !0)),
      i.Utils._toCommandResponse(e)
    );
  }
  async setSSID(e) {
    let o = this._checkDeviceVexUpdate(A.Commands.setSSID);
    if (o) return o;
    let s = await this._vexaicomms.setAccessPointSSID(e);
    return (
      s.exitCode === A.StatusCodes.ack && (this._ssidChanged = !0),
      i.Utils._toCommandResponse(s)
    );
  }
  async setPassword(e) {
    let o = this._checkDeviceVexUpdate(A.Commands.setPassword);
    if (o) return o;
    let s = await this._vexaicomms.setAccessPointPassword(e);
    return (
      s.exitCode === A.StatusCodes.ack && (this._passwordChanged = !0),
      i.Utils._toCommandResponse(s)
    );
  }
  async getDeviceInfo(e) {
    let o = this._checkDeviceVexUpdate(A.Commands.deviceInfo);
    if (o) return o;
    let s = ["aiwebdashboard", "vexupdate", "aiservice"];
    if (this._fileDownloadInProgress)
      return {
        command: A.Commands.deviceInfo,
        details: A.vexaiErrorMap.get(A.StatusCodes.downloadCommandActive),
        json: "",
        statusCode: A.StatusCodes.downloadCommandActive,
      };
    let r = await this._vexaicomms.getDeviceInfo(e || s),
      n = new TextDecoder().decode(r.data),
      a;
    try {
      (a = JSON.parse(n)),
        (a.info = JSON.parse(Buffer.from(a.info, "base64").toString()));
    } catch (c) {
      console.log(c);
    }
    return (
      (this._name = a.info.device.name),
      (this._id = a.info.device.id),
      (this._systemInfo = a.info),
      (super._systemInfoJSON = a.info.toString()),
      i.Utils._toCommandResponse(r)
    );
  }
  async checkElevate() {
    let e = this._checkDeviceVexUpdate(A.Commands.checkElevate);
    if (e) return e;
    let o = await this._vexaicomms.getCheckElevateCMD();
    return i.Utils._toCommandResponse(o);
  }
  async elevate() {
    let e = this._checkDeviceVexUpdate(A.Commands.checkElevate);
    if (e) return e;
    let o = await this._vexaicomms.getElevateCMD();
    return i.Utils._toCommandResponse(o);
  }
  checkDirCMD(e) {}
  async downloadApp(e, o) {
    let s = this._checkDeviceVexUpdate(A.Commands.run);
    if (s) return s;
    this._fileDownloadInProgress = !0;
    let r;
    await Yt.window.withProgress(
      {
        cancellable: !1,
        title: `VEX AI File Download: ${Go.basename(e.fsPath)}`,
        location: Yt.ProgressLocation.Notification,
      },
      async (a, c) => {
        (r = this._vexaicomms.downloadApplication(e.fsPath, o?.fsPath, (l) => {
          a.report(l);
        })),
          await r,
          console.log(r);
      },
    );
    let n = await r;
    return (this._fileDownloadInProgress = !1), i.Utils._toCommandResponse(n);
  }
  async installApp(e) {
    let o = this._checkDeviceVexUpdate(A.Commands.run);
    if (o) return o;
    let s = !0,
      r,
      n;
    Yt.window.withProgress(
      {
        cancellable: !1,
        title: `VEX AI Install App: ${Go.basename(e.fsPath)}`,
        location: Yt.ProgressLocation.Notification,
      },
      async (c, l) => {
        (r = this._vexaicomms.installAppCMD(e.path)),
          (n = await r),
          (s = !1),
          console.log(n);
      },
    );
    let a = !1;
    for (; s; ) {
      if (!this._communicationPort.isOpen) {
        (a = !0),
          (s = !1),
          ht.activeCmd.internalResolve(
            `{command:"${A.Commands.run}",response:"${A.StatusCodes.nack}", exitcode:"${A.StatusCodes.port_not_open}"}`,
          );
        break;
      }
      await i.Utils.asyncSleep(500);
    }
    return i.Utils._toCommandResponse(n);
  }
  async removeApp(e) {
    let o = this._checkDeviceVexUpdate(A.Commands.run);
    if (o) return o;
    let s = await this._vexaicomms.removeAppCMD(e);
    return i.Utils._toCommandResponse(s);
  }
  async systemCtlService(e, o) {
    let s = this._checkDeviceVexUpdate(A.Commands.run);
    if (s) return s;
    let r = await this._vexaicomms.restartServiceCMD(e, o);
    return i.Utils._toCommandResponse(r);
  }
  async clear() {
    let e = this._checkDeviceVexUpdate(A.Commands.run);
    if (e) return e;
    let o = await this._vexaicomms.clearRxBufferCMD();
    return i.Utils._toCommandResponse(o);
  }
  async resetTerminal() {
    let e = this._checkDeviceVexUpdate(A.Commands.run);
    if (e) return e;
    let o = await this._vexaicomms.restartTerminal();
    return i.Utils._toCommandResponse(o);
  }
  async removeFile(e) {
    let o = await this._vexaicomms.rmCMD(e);
    return i.Utils._toCommandResponse(o);
  }
  async sendRunCMD(e, o = "/") {}
  _onComsDataRecievedHandle(e) {
    if (!e) return;
    this._dataHolder === void 0 && (this._dataHolder = "");
    let o = new TextDecoder().decode(e);
    if (
      !o.includes(`
`)
    ) {
      this._dataHolder += o;
      return;
    }
    let s = o.split(`
`),
      r = this._dataHolder + s[0];
    this._dataHolder = s[1];
    let n = JSON.parse(r);
    if (ht.activeCmd.cmdID === n.command) {
      n.command === A.Commands.run && console.log(n);
      let a = n.response === "ACK" ? A.StatusCodes.ack : A.StatusCodes.nack,
        c = A.getErrorCodeDetails(a),
        l = {
          vexaicommsI: "",
          cmdID: n.command,
          cmdStr: "",
          data: new TextEncoder().encode(r),
          details: c,
          exitCode: a,
        };
      if (a === A.StatusCodes.ack) l.details = `${n.response}`;
      else if (n?.error) {
        let p = Buffer.from(n.error, "base64").toString();
        if (A.Commands.run === n.command) {
          let f = Buffer.from(n.stderr, "base64").toString();
          l.details += ` ${n.response} (${p} ${f}) `;
        } else l.details += ` ${n.response} (${p}) `;
      }
      i.DEBUG, ht.activeCmd.internalResolve(l);
      return;
    }
  }
  _checkDeviceVexUpdate(e) {
    let o = {
      command: e,
      details: "",
      json: "{}",
      statusCode: A.StatusCodes.downloadCommandActive,
    };
    if (this._vexupdateMissing)
      return (
        (o.statusCode = A.StatusCodes.vexupdateMissing),
        (o.details = A.getErrorCodeDetails(o.statusCode)),
        o
      );
    if (!this._isAlive)
      return (
        (o.statusCode = A.StatusCodes.deviceNotAlive),
        (o.details = A.getErrorCodeDetails(o.statusCode)),
        o
      );
  }
  get isAlive() {
    return this._isAlive;
  }
  get isVexupdateMissing() {
    return this._vexupdateMissing;
  }
  get ssidChanged() {
    return this._ssidChanged;
  }
  get passwordChanged() {
    return this._passwordChanged;
  }
  get updateList() {
    return this._appUpdateList;
  }
  set updateList(e) {
    this._appUpdateList = e;
  }
  get ssid() {
    return this._systemInfo?.device?.name ? this._systemInfo.device.name : "";
  }
};
var wo = class {
  static createDevice(t) {
    switch (`${t.platform}-${t.device}-${t.bootMode}`) {
      case `${i.Platform.V5}-${i.Device.Brain}-${_.BootMode.app}`:
        return new Dt(t);
      case `${i.Platform.EXP}-${i.Device.Brain}-${_.BootMode.app}`:
      case `${i.Platform.EXP}-${i.Device.Brain}-${_.BootMode.rom}`:
      case `${i.Platform.EXP}-${i.Device.Brain}-${_.BootMode.ram}`:
        return new xt(t);
      case `${i.Platform.IQ2}-${i.Device.Brain}-${_.BootMode.app}`:
      case `${i.Platform.IQ2}-${i.Device.Brain}-${_.BootMode.rom}`:
      case `${i.Platform.IQ2}-${i.Device.Brain}-${_.BootMode.ram}`:
        return new bt(t);
      case `${i.Platform.V5}-${i.Device.Controller}-${_.BootMode.app}`:
        return new tt(t);
      case `${i.Platform.EXP}-${i.Device.Controller}-${_.BootMode.app}`:
      case `${i.Platform.EXP}-${i.Device.Controller}-${_.BootMode.rom}`:
        return new nt(t);
      case `${i.Platform.IQ2}-${i.Device.Controller}-${_.BootMode.app}`:
      case `${i.Platform.IQ2}-${i.Device.Controller}-${_.BootMode.rom}`:
        return new Ye(t);
      case `${i.Platform.AI}-${i.Device.Camera_3D}-${_.BootMode.app}`:
        return new Ue(t);
      default:
        return;
    }
  }
};
var js = L(require("vscode"));
var lo = class extends _ {
  constructor(e) {
    super();
    this._vexcomDataHolder = "";
    this._dataResultArr = [];
    (this._vexcomDataHolder = ""),
      (this._dataResultArr = []),
      (this._platform = e.platform),
      (this._device = e.device),
      (this._id = e.id),
      (this._bootMode = e.bootMode),
      (this._vid = e.vid),
      (this._pid = e.pid);
  }
  async _handleProgress(e, o) {
    let s,
      r = async (n, a) => (
        n?.report({ increment: 0, message: "preparing . . . " }), await e()
      );
    {
      let n = js.window.withProgress(o, async (a, c) => {
        this._progress ||
          ((this._lastProgress = 0),
          (this._progress = a),
          (s = r(a, c)),
          await s,
          (this._progress = void 0));
      });
    }
    return s;
  }
  get name() {
    return this._name;
  }
  get bootMode() {
    return this._bootMode;
  }
  get platform() {
    return this._platform;
  }
  get device() {
    return this._device;
  }
  get json() {
    return this._systemInfoJSON;
  }
  get systemInfo() {
    return this._systemInfo;
  }
  get vid() {
    return this._vid;
  }
  get pid() {
    return this._pid;
  }
};
var Wt = class extends lo {
  constructor(t) {
    super(t);
  }
  async deviceUpdate(t) {
    let e = await this._uuu.flash(t.fsPath);
    return i.Utils._toCommandResponse(e);
  }
  on(t, e) {
    switch (t) {
      case "Data":
        this._uuu.on("Data", e);
        break;
      case "Progress":
        this._uuu.on("Progress", e);
        break;
      case "Error":
        this._uuu.on("Error", e);
        break;
      case "Exit":
        this._uuu.on("Exit", e);
        break;
    }
  }
};
var _o = class {
  static createDevice(t) {
    switch (`${t.platform}-${t.device}-${_.BootMode.dfu}`) {
      case `${i.Platform.EXP}-${i.Device.Brain}-${_.BootMode.dfu}`:
        return new Xt(t);
      case `${i.Platform.IQ2}-${i.Device.Brain}-${_.BootMode.dfu}`:
        return new Ht(t);
      case `${i.Platform.EXP}-${i.Device.Controller}-${_.BootMode.dfu}`:
        return new Tt(t);
      case `${i.Platform.IQ2}-${i.Device.Controller}-${_.BootMode.dfu}`:
        return new kt(t);
      case `${i.Platform.AI}-${i.Device.Camera_3D}-${_.BootMode.dfu}`:
      case `${i.Platform.AI}-${i.Device.Camera_3D}-${_.BootMode.ram}`:
        return new Wt(t);
      default:
        return;
    }
  }
};
var it = L(require("vscode")),
  Ts = require("serialport"),
  Qo = L(require("child_process")),
  Io = L(require("path")),
  qo = L(require("os")),
  M = class {
    constructor(t, e) {
      this._maxDeviceConnects = 2;
      this._maxDeviceDisconnects = 2;
      this._dfuConnectCounter = 0;
      this._dfuDisconnectCounter = 0;
      this._detectLoopInLock = !1;
      this._deviceDetectionLock = !1;
      this._deviceDFUDetectionLock = !1;
      (M._context = t),
        (this._activeDeviceList = []),
        (this._activeDFUDeviceList = []),
        (M._logCB = e),
        M._logHandler("Starting");
    }
    async checkSystemVEXOS(t) {
      if (!(t instanceof H)) return;
      M._logHandler("Checking Device Vexos against Local Vexos-------------");
      let e = it.Uri.joinPath(M._context.globalStorageUri, "vexos"),
        o = (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            t.platform,
            e,
          )
        ).json,
        s = JSON.parse(o),
        r = JSON.parse(t.json),
        n;
      r.v5 && (n = r.v5.brain.vexos),
        r.exp &&
          (t.bootMode === _.BootMode.app
            ? (n = r.exp.brain.vexos)
            : (t.bootMode === _.BootMode.ram ||
                t.bootMode === _.BootMode.rom) &&
              (n = r.exp.brain.version)),
        r.iq2 &&
          (t.bootMode === _.BootMode.app
            ? (n = r.iq2.brain.vexos)
            : (t.bootMode === _.BootMode.ram ||
                t.bootMode === _.BootMode.rom) &&
              (n = r.iq2.brain.version));
      let a = i.Utils.vexos.toVersion(n).split(".").join("_"),
        c = `VEXOS_${t.platform}_${a}`,
        l = s?.online?.latest !== void 0,
        p = s?.local?.latest !== void 0,
        f = "",
        U = !1,
        P,
        x = { command: "check vexos", details: "", json: "", statusCode: 0 };
      if (l)
        return (
          (P = i.Utils.vexos.getLatestVEXosVersion([
            c,
            s.online.latest,
            s.local.latest,
          ])),
          P !== c || t.bootMode !== _.BootMode.app || U
            ? (M._logHandler(
                `Vexos update available: Online-${s.online.latest} Local-${s.local.latest} System-${i.Utils.vexos.fileNameToVersion(c)} BootMode: ${t.bootMode}`,
              ),
              (f = `Vexos update available: ${i.Utils.vexos.fileNameToVersion(P)}`),
              (x.details = f),
              (x.statusCode = 1),
              x)
            : Number(r?.v5?.brain?.flags) & 65536
              ? (M._logHandler(
                  `Vexos update available: Assets Invalid, Online-${s.online.latest} System-${i.Utils.vexos.fileNameToVersion(c)} BootMode: ${t.bootMode}`,
                ),
                (f = `Vexos update available: ${i.Utils.vexos.fileNameToVersion(P)}`),
                (x.details = f),
                (x.statusCode = 1),
                x)
              : (M._logHandler(
                  `VEXOS Version: Online:${s.online.latest} System:${c}`,
                ),
                M._logHandler("VEXOS - Up To Date"),
                (x.details = "VEXOS up to date"),
                (x.statusCode = 0),
                x)
        );
      if (p)
        return (
          (P = i.Utils.vexos.getLatestVEXosVersion([c, s.local.latest])),
          P !== c || t.bootMode !== _.BootMode.app
            ? (M._logHandler(
                `Vexos update available: ${i.Utils.vexos.fileNameToVersion(c)} BootMode: ${t.bootMode}`,
              ),
              (f = `Vexos update available: ${i.Utils.vexos.fileNameToVersion(P)}`),
              (x.details = f),
              (x.statusCode = 1),
              x)
            : (M._logHandler(
                `VEXOS Version @: Online:${s.online.latest} System:${c}`,
              ),
              M._logHandler("VEXOS - Up To Date"),
              (x.details = "VEXOS up to date"),
              (x.statusCode = 0),
              x)
        );
      throw new Error(
        "No Internet connection and no vexos availiable at current home directory",
      );
      M._logHandler(`VEXOS Check Result: ${f}`);
    }
    async checkControllerVEXOS(t) {
      if (!(t instanceof Ye) && !(t instanceof nt)) return;
      M._logHandler("Checking Device Vexos against Local Vexos-------------");
      let e = it.Uri.joinPath(M._context.globalStorageUri, "vexos"),
        o = (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            t.platform,
            e,
          )
        ).json,
        s = JSON.parse(o),
        r = JSON.parse(t.json),
        n = s.online.latest !== "",
        a = s.local.latest !== "",
        c = "",
        l = !1,
        p,
        f,
        U = {
          command: "check controller vexos",
          details: "",
          json: "",
          statusCode: 0,
        },
        P = await i.Feedback_Extension.ResourceManager.getLatestVEXosManifest(
          t.platform,
          e,
        ),
        x = JSON.parse(P.json),
        $,
        N,
        F,
        k;
      t.bootMode === _.BootMode.app
        ? (($ = i.Utils.vexos.toVersion(t.vexComSystemInfo?.controller?.version)
            ? i.Utils.vexos.toVersion(t?.vexComSystemInfo?.controller?.version)
            : ""),
          (N = i.Utils.vexos.toVersion(t.vexComSystemInfo?.controller?.atmel)
            ? i.Utils.vexos.toVersion(t?.vexComSystemInfo?.controller?.atmel)
            : ""),
          (F = x.ctrl.cdc.version),
          (k = x.ctrl.radio.version))
        : (($ = ""),
          (N = i.Utils.vexos.toVersion(
            t.vexComSystemInfo?.controller_boot?.atmel,
          )
            ? i.Utils.vexos.toVersion(
                t.vexComSystemInfo?.controller_boot?.atmel,
              )
            : ""),
          (F = x.ctrl.cdc.version),
          (k = x.ctrl.radio.version));
      let W;
      console.log(t.vexComSystemInfo),
        (p = i.Utils.vexos.getLatestControllerVersion([$, k])),
        (f = i.Utils.vexos.getLatestControllerVersion([N, F]));
      let ie = !1,
        de = !1;
      return (
        p !== $ || l
          ? (M._logHandler(
              `${t.platform} ${t.device} VEXOS update available:${$} -> ${k}`,
            ),
            (c = `${t.platform} ${t.device} VEXOS update available:${x.version}`),
            (U.details = c),
            (U.statusCode = 1),
            (ie = !0),
            (t.needsRadioUpdate = !0))
          : (ie = !1),
        f !== N || l
          ? (M._logHandler(
              `${t.platform} ${t.device} USB update available: ${N} -> ${F}`,
            ),
            (c = `${t.platform} ${t.device} VEXOS update available:${x.version}`),
            (U.details = c),
            (U.statusCode = 1),
            (de = !0),
            (t.needsUsbUpdate = !0))
          : (de = !1),
        M._logHandler("VEXOS - Up To Date"),
        U.statusCode || (U.details = "VEXOS up to date"),
        (U.json = JSON.stringify({ usb: de, radio: ie })),
        U
      );
    }
    async checkVEXaiVersion(t, e = !1) {
      M._logHandler(
        "Checking Device Version against Local VEXai image-------------",
      );
      let o = it.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.aiCameraHomeID,
            it.ConfigurationTarget.Global,
          )
          .toString(),
        s = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getLatestVEXaiManifest(
              it.Uri.joinPath(it.Uri.file(o), "3d", "images"),
            )
          ).json,
        ),
        r = !!s.online.catalog,
        n = !!s.local.catalog,
        a = [],
        c = "",
        l = "",
        p = t.systemInfo.device?.version ? t.systemInfo.device?.version : "",
        f = {
          command: "check vexai 3d camera version",
          details: "",
          json: "",
          statusCode: 0,
        },
        U = (P, x) => (P > x ? -1 : P < x ? 1 : 0);
      if (r)
        return (
          (c = [
            p,
            s.online.latest.split("_")[1],
            s.local.latest.split("_")[1],
          ].sort(U)[0]),
          c !== p || t.bootMode !== _.BootMode.app || e
            ? (M._logHandler(
                `VEXai Image update available: Online-${s.online.latest} Local-${s.local.latest} Device-${p} BootMode: ${t.bootMode}`,
              ),
              (l = `VEXai Image update available: ${i.Utils.vexos.fileNameToVersion(c)}`),
              (f.details = l),
              (f.statusCode = 1),
              f)
            : (M._logHandler(
                `VEXai Image Version: Online:${s.online.latest} Device:${p}`,
              ),
              M._logHandler("VEXai Image - Up To Date"),
              (f.details = "VEXai Image up to date"),
              (f.statusCode = 0),
              f)
        );
      if (n)
        return (
          (c = [p, s.local.latest].sort(U)[0]),
          c !== p || t.bootMode !== _.BootMode.app
            ? (M._logHandler(
                `VEXai Image update available: ${i.Utils.vexos.fileNameToVersion(p)} BootMode: ${t.bootMode}`,
              ),
              (l = `VEXai Image update available: ${i.Utils.vexos.fileNameToVersion(c)}`),
              (f.details = l),
              (f.statusCode = 1),
              f)
            : (M._logHandler(
                `VEXai Image Version @: Online:${s.online.latest} Device:${p}`,
              ),
              M._logHandler("VEXai Image - Up To Date"),
              (f.details = "VEXai Image up to date"),
              (f.statusCode = 0),
              f)
        );
      throw new Error(
        "No Internet connection and no vexos availiable at current home directory",
      );
    }
    async checkVEXaiApps(t, e = !1) {
      M._logHandler(
        "Checking Device Application against Local Vexos-------------",
      );
      let o = it.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.aiCameraHomeID,
            it.ConfigurationTarget.Global,
          )
          .toString(),
        s = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getVEXaiAppListVersions(
              it.Uri.file(o),
            )
          ).json,
        ),
        r = !!s.online.apps.length,
        n = !!s.local.apps.length,
        a = [];
      if (r) a = s.online.apps;
      else if (n) a = s.local.apps;
      else
        throw new Error(
          "No Internet connection and no vexos availiable at current home directory",
        );
      a.forEach(async (c) => {
        console.log(c);
        let l = await this.checkVEXaiAppVersion(t, c, r, n);
        l.statusCode === 1 && t.updateList.push(c), console.log(l);
      });
    }
    async checkVEXaiAppVersion(t, e, o, s, r = !1) {
      let n;
      t.systemInfo.apps.forEach((P) => {
        P.Package === e && (n = P);
      });
      let a = { command: "", details: "", json: "", statusCode: 0 },
        c = it.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.aiCameraHomeID,
            it.ConfigurationTarget.Global,
          )
          .toString(),
        l = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getVEXaiAppVersions(
              e,
              it.Uri.file(c),
            )
          ).json,
        ),
        p = `${n.Package}_${n.Version}`,
        f = `${l.online.latest.split("-")[0]}`,
        U = l.local.latest.split("-")[0];
      if (o) {
        let P = [p, f, U].sort(($, N) => {
            let F = $.split("_"),
              k = N.split("_"),
              W = F[1].split("."),
              ie = k[1].split("."),
              de = (fe, E) => (fe > E ? -1 : fe < E ? 1 : 0),
              w = de(parseInt(W[0]), parseInt(ie[0]));
            if (w !== 0) return w;
            let O = de(parseInt(W[1]), parseInt(ie[1]));
            if (O !== 0) return O;
            let q = de(parseInt(W[2]), parseInt(ie[2]));
            if (q !== 0) return q;
            let R = de(W[3], ie[4]);
            return R !== 0 ? R : 0;
          }),
          x = P[0];
        if ((console.log(P), x !== p || t.bootMode !== _.BootMode.app || r)) {
          M._logHandler(
            `VEXai App update available: Online-${l.online.latest} Local-${l.local.latest} System-${p} BootMode: ${t.bootMode}`,
          );
          let $ = `VEXai App update available: ${i.Utils.vexos.fileNameToVersion(x)}`;
          return (a.details = $), (a.statusCode = 1), a;
        } else
          return (
            M._logHandler(
              `VEXai App  Version: Online:${l.online.latest} System:${p}`,
            ),
            M._logHandler("VEXai App  - Up To Date"),
            (a.details = "VEXai up to date"),
            (a.statusCode = 0),
            a
          );
      } else if (s) {
        let P = [p[0], f, U].sort((x, $) => (x > $ ? -1 : x < $ ? 1 : 0))[0];
        if (P !== p || t.bootMode !== _.BootMode.app) {
          M._logHandler(
            `VEXai App update available: ${i.Utils.vexos.fileNameToVersion(p)} BootMode: ${t.bootMode}`,
          );
          let x = `VEXai App update available: ${i.Utils.vexos.fileNameToVersion(P)}`;
          return (a.details = x), (a.statusCode = 1), a;
        } else
          return (
            M._logHandler(
              `VEXai App  Version @: Online:${l.online.latest} System:${p}`,
            ),
            M._logHandler("VEXai App  - Up To Date"),
            (a.details = "VEXai up to date"),
            (a.statusCode = 0),
            a
          );
      } else
        throw new Error(
          "No Internet connection and no vexos availiable at current home directory",
        );
      console.log(s, o);
    }
    static async getVEXDeviceList(t) {
      let e = await Ts.SerialPort.list();
      M._serialPortIOList = e;
      let o = this.filterbyType(e, "User", t),
        s = this.filterbyType(e, "Communication", t),
        r = qo.type(),
        n = [];
      return (
        s.forEach((a) => {
          if (a.productId === this._v5ControllerPid) {
            let c = this.getDeviceTypeFromPID(a.productId),
              l = {
                platform: c.platform,
                device: c.device,
                bootMode: _.BootMode.unknown,
                user: "",
                communication: a.path,
                robotName: "",
                teamNumber: "",
                id: "",
                json: "",
              };
            n.some(
              (p) => l.communication === p.communication || l.user === p.user,
            ) || n.push(l);
            return;
          }
          o.forEach((c) => {
            if (this.comparePortByPlatform(r, c, a)) {
              let p = this.getDeviceTypeFromPID(a.productId),
                f = {
                  platform: p.platform,
                  device: p.device,
                  user: c.path,
                  bootMode: _.BootMode.unknown,
                  communication: a.path,
                  robotName: "",
                  teamNumber: "",
                  id: "",
                  json: "",
                };
              n.some(
                (U) => f.communication === U.communication || f.user === U.user,
              ) || n.push(f);
            }
          });
        }),
        o.forEach((a) => {
          if (a.productId === this._vexAI3DCameraPid) {
            let c = this.getDeviceTypeFromPID(a.productId),
              l = {
                platform: c.platform,
                device: c.device,
                bootMode: _.BootMode.unknown,
                user: a.path,
                communication: "",
                robotName: "",
                teamNumber: "",
                id: "",
                json: "",
              };
            n.some(
              (p) => l.communication === p.communication || l.user === p.user,
            ) || n.push(l);
            return;
          }
        }),
        n.sort(this._sortListCB),
        n
      );
    }
    static async getVEXDfuDeviceList(t) {
      let e = await _.listDevices("", M._password),
        o = JSON.parse(e.json),
        s = o?.usb?.dfu ? o?.usb?.dfu : [],
        r = [],
        n = RegExp(/(?<=0x)\w\w\w\w/),
        a = 0,
        c = 0;
      return (
        s.forEach((l) => {
          let p = n.exec(l.vid)[0],
            f = n.exec(l.pid)[0],
            U = M.getDeviceTypeFromPID(f);
          (a =
            r.filter(
              (P) =>
                l.family === P.platform.toUpperCase() &&
                p === P.vid &&
                f === P.pid,
            ).length + 1),
            f === this._vexAI3DCameraRAMPid
              ? r.push({
                  device: U.device,
                  pid: f,
                  vid: p,
                  bootMode: _.BootMode.ram,
                  platform: U.platform,
                  id: a,
                })
              : r.push({
                  device: U.device,
                  pid: f,
                  vid: p,
                  bootMode: _.BootMode.dfu,
                  platform: U.platform,
                  id: a,
                });
        }),
        t && (r = r.filter((l) => t === l.platform)),
        r
      );
    }
    getBootMode(t) {
      let e = JSON.parse(t),
        o,
        s = _.BootMode.unknown;
      if (e.v5) o = e.v5;
      else if (e.iq2) o = e.iq2;
      else if (e.exp) o = e.exp;
      else if (e?.unknown?.controller_boot) o = e.unknown;
      else return s;
      return (
        o?.brain?.bootloader
          ? o?.brain?.bootloader === _.BootMode.ram ||
            o?.brain?.bootloader === _.BootMode.rom
            ? (s = o?.brain?.bootloader)
            : (s = _.BootMode.unknown)
          : o?.brain
            ? (s = _.BootMode.app)
            : o?.controller
              ? (s = _.BootMode.app)
              : o?.controller_boot && (s = _.BootMode.rom),
        s
      );
    }
    startSearch() {
      if (
        (M._setStartTime(),
        M._logHandler("Starting VEX Device Search"),
        this._searchLoopID)
      ) {
        M._logHandler("Can't Start Loop because loop alread active");
        return;
      }
      this._searchLoopID = setInterval(() => {
        this._deviceDetectionLock ||
          this.deviceDetectionLoop().then(() => {
            this._deviceDetectionLock = !1;
          }),
          this._deviceDFUDetectionLock ||
            this.deviceDFULoop().then(() => {
              this._deviceDFUDetectionLock = !1;
            }),
          M._elapsedTime() > 1e4 && (M._startTime = new Date());
      }, 500);
    }
    resetSearch() {
      M._setStartTime(),
        M._logHandler("Reset VEX Device Search"),
        (this._activeDeviceList = []),
        this.stopSearch(),
        this.startSearch();
    }
    stopSearch() {
      M._logHandler("Stoping VEX Device Search"),
        clearInterval(this._searchLoopID),
        (this._searchLoopID = void 0);
    }
    on(t, e) {
      switch (t) {
        case "VEX_Device_Detected": {
          this._onDeviceDetect = e;
          break;
        }
        case "VEX_Device_Disconnected": {
          this._onDeviceDisconnect = e;
          break;
        }
        case "VEX_DFU_Device_Detected": {
          this._onDeviceDFUDetect = e;
          break;
        }
        case "VEX_DFU_Device_Disconnected": {
          this._onDeviceDFUDisconnect = e;
          break;
        }
        case "Log": {
          M._logCB = e;
          break;
        }
      }
    }
    async deviceDetectionLoop() {
      this._deviceDetectionLock = !0;
      let t = [],
        e = [],
        o = this._activeDeviceList,
        s = await M.getVEXDeviceList();
      (e = o.filter(
        (a) =>
          !s.some(
            (c) => c.communication === a.communication && c.user === a.user,
          ),
      )),
        e.forEach(async (a) => {
          M._logHandler(""),
            M._logHandler(`VEX ${a.platform} ${a.device} Disconnected `),
            M._logHandler("---------------------------------------------"),
            M._logHandler(`	-(User)           	 ${a.user}`),
            M._logHandler(`	-(Communication)  	 ${a.communication}`),
            i.DEBUG &&
              (M._logHandler(`	-(Robot Name) 	 ${a.robotName}`),
              M._logHandler(`	-(Team #)     	 ${a.teamNumber}`),
              M._logHandler(`	-(id)   	 ${a.id}`),
              M._logHandler(`	-(BootMode)       	 ${a.bootMode}`)),
            M._logHandler(""),
            (this._activeDeviceList = this._activeDeviceList.filter(
              (c) => c.communication !== a.communication,
            )),
            this._disconnetHandler(a);
        }),
        (t = s.filter(
          (a) =>
            !o.some(
              (c) => c.communication === a.communication && c.user === a.user,
            ),
        ));
      let r = async (a) => {
          if (a.platform !== i.Platform.AI) {
            if (
              this.activeDeviceList.some(
                (f) => f.communication === a.communication,
              )
            )
              return;
            let c = (await H.systemInfo(a.communication)).json,
              l = JSON.parse(c),
              p;
            if (l.v5) p = l.v5;
            else if (l.iq2) p = l.iq2;
            else if (l.exp) p = l.exp;
            else if (l.unknown) p = l.unknown;
            else return;
            (a.json = c),
              a.device === i.Device.Brain
                ? p.brain?.bootloader
                  ? p.brain.bootloader
                    ? ((a.robotName = `${p.brain.bootloader}`),
                      (a.id = ""),
                      (a.teamNumber = ""))
                    : !p.brain &&
                      p.controller &&
                      ((a.robotName = "Controller"),
                      (a.id = ""),
                      (a.teamNumber = ""))
                  : ((a.robotName = p.brain.name),
                    (a.id = p.brain.ssn),
                    (a.teamNumber = p.brain.team))
                : a.device === i.Device.Controller &&
                  (p.controller || p.controller_boot) &&
                  ((a.robotName = ""), (a.id = ""), (a.teamNumber = "")),
              (a.bootMode = this.getBootMode(c));
          } else
            a.platform === i.Platform.AI &&
              ((a.bootMode = _.BootMode.app), (a.json = "{}"));
          M._logHandler(""),
            M._logHandler(`VEX ${a.platform} ${a.device} Detected `),
            M._logHandler("---------------------------------------------"),
            M._logHandler(`	-(User)           	 ${a.user}`),
            M._logHandler(`	-(Communication)  	 ${a.communication}`),
            i.DEBUG &&
              (M._logHandler(`	-(Robot Name) 	 ${a.robotName}`),
              M._logHandler(`	-(Team #)     	 ${a.teamNumber}`),
              M._logHandler(`	-(id)         	 ${a.id}`),
              M._logHandler(`	-(BootMode)   	 ${a.bootMode}`)),
            M._logHandler(""),
            this._activeDeviceList.push(a),
            this._dectectHandler(a);
        },
        n = 0;
      for (
        t.forEach(async (a) => {
          await r(a), n++;
        });
        n !== t.length;

      )
        await i.Utils.asyncSleep(250);
    }
    async deviceDFULoop() {
      let t = [],
        e = [],
        o = this._activeDFUDeviceList,
        s = await M.getVEXDfuDeviceList();
      (e = o.filter(
        (a) =>
          !s.some((c) => a.id === a.id && a.vid === c.vid && a.pid === c.pid),
      )),
        this._dfuDisconnectCounter === this._maxDeviceDisconnects
          ? ((this._dfuDisconnectCounter = 0),
            e.forEach(async (a) => {
              M._logHandler(""),
                M._logHandler(
                  `VEX ${a.platform} ${a.device} (${a.bootMode}) Disconnected `,
                ),
                M._logHandler("---------------------------------------------"),
                M._logHandler(`	-(VID)	 ${a.vid}`),
                M._logHandler(`	-(PID)	 ${a.pid}`),
                M._logHandler(`	-(Dummy ID)	 ${a.id}`),
                M._logHandler(""),
                (this._activeDFUDeviceList = this._activeDFUDeviceList.filter(
                  (c) => !(c.id === a.id && c.vid === a.vid && c.pid === a.pid),
                )),
                this._disconnetDFUHandler(a);
            }))
          : e.length
            ? this._dfuDisconnectCounter++
            : (this._dfuDisconnectCounter = 0),
        (t = s.filter(
          (a) =>
            !o.some((c) => c.id === a.id && c.vid === a.vid && c.pid === a.pid),
        ));
      let r = async (a) => {
          this._activeDFUDeviceList.some(
            (c) => c.id === a.id && c.vid === a.vid && c.pid === a.pid,
          ) ||
            (M._logHandler(""),
            M._logHandler(
              `VEX ${a.platform} ${a.device} (${a.bootMode}) Detected `,
            ),
            M._logHandler("---------------------------------------------"),
            M._logHandler(`	-(VID)	 ${a.vid}`),
            M._logHandler(`	-(PID)	 ${a.pid}`),
            M._logHandler(`	-(Dummy ID)	 ${a.id}`),
            M._logHandler(""),
            this._activeDFUDeviceList.push(a),
            this._dectectDFUHandler(a));
        },
        n = 0;
      for (
        t.forEach(async (a) => {
          await r(a), n++;
        });
        n !== t.length;

      )
        await i.Utils.asyncSleep(250);
    }
    static comparePortByPlatform(t, e, o) {
      switch (t) {
        case "Windows_NT":
          return e.serialNumber === o.serialNumber;
        case "Darwin":
          return e.locationId === o.locationId;
        case "Linux":
          let s = e.path.split("/").at(-1),
            r = o.path.split("/").at(-1),
            n = Qo.spawnSync(`find /sys/devices -name "${s}"`, {
              shell: !0,
            }).stdout.toString(),
            a = Qo.spawnSync(`find /sys/devices -name "${r}"`, {
              shell: !0,
            }).stdout.toString(),
            c = Io.dirname(Io.dirname(n)).split("."),
            l = Io.dirname(Io.dirname(a)).split(".");
          return (
            c.pop(), l.pop(), (n = c.join(".")), (a = l.join(".")), n === a
          );
        default:
          return !1;
      }
    }
    static getPortTypeByPlatform(t, e) {
      let o = "";
      switch (t) {
        case "Windows_NT":
          if (e.productId === this._vexAI3DCameraPid) {
            e.pnpId.includes(this._aicamcomsMI)
              ? (o = "Communication")
              : e.pnpId.includes(this._aicamuserMI) ||
                  (e.vendorId === this._vexVid &&
                    e.productId === this._vexAI3DCameraPid)
                ? (o = "User")
                : (o = "Unknown");
            break;
          } else {
            e.pnpId.includes(this._comsMI) ||
            e.pnpId.includes(this._comsV5ControllerMI)
              ? (o = "Communication")
              : e.pnpId.includes(this._userMI)
                ? (o = "User")
                : (o = "Unknown");
            break;
          }
        case "Darwin":
          let s = e.path.slice(-1);
          if (e.productId === this._vexAI3DCameraPid) {
            s === this._aicamcomsModem
              ? (o = "Communication")
              : s === this._aicamuserModem
                ? (o = "User")
                : (o = "Unknown");
            break;
          } else {
            s === this._comsModem || s === this._comsV5ControllerModem
              ? (o = "Communication")
              : s === this._userModem
                ? (o = "User")
                : (o = "Unknown");
            break;
          }
        case "Linux":
          if (e.productId === this._vexAI3DCameraPid) {
            e.pnpId.includes(this._aicamcomsIF)
              ? (o = "Communication")
              : e.pnpId.includes(this._aicamuserIF)
                ? (o = "User")
                : (o = "Unknown");
            break;
          } else {
            e.pnpId.includes(this._comsIF) ||
            e.pnpId.includes(this._comsV5ControllerIF)
              ? (o = "Communication")
              : e.pnpId.includes(this._userIF)
                ? (o = "User")
                : (o = "Unknown");
            break;
          }
        default:
          o = "Unknown";
          break;
      }
      return o;
    }
    static filterbyType(t, e, o) {
      let s = o === "v5" || o === void 0,
        r = o === "exp" || o === void 0,
        n = o === "iq2" || o === void 0,
        a = qo.type();
      return t.filter(
        (l) =>
          l.vendorId === this._vexVid &&
          ((l.productId === this._vexAI3DCameraPid && (s || n)) ||
            (l.productId === this._v5BrainPid && s) ||
            (l.productId === this._v5ControllerPid && s) ||
            (l.productId === this._iq2BrainPid && n) ||
            (l.productId === this._iq2ControllerPid && n) ||
            (l.productId === this._expBrainPid && r) ||
            (l.productId === this._expControllerPid && r)) &&
          this.getPortTypeByPlatform(a, l) === e,
      );
    }
    static getDeviceTypeFromPID(t) {
      switch (t) {
        case this._vexAI3DCameraPid:
          return { platform: i.Platform.AI, device: i.Device.Camera_3D };
        case this._v5BrainPid:
          return { platform: i.Platform.V5, device: i.Device.Brain };
        case this._v5ControllerPid:
          return { platform: i.Platform.V5, device: i.Device.Controller };
        case this._expBrainPid:
          return { platform: i.Platform.EXP, device: i.Device.Brain };
        case this._expControllerPid:
          return { platform: i.Platform.EXP, device: i.Device.Controller };
        case this._iq2BrainPid:
          return { platform: i.Platform.IQ2, device: i.Device.Brain };
        case this._iq2ControllerPid:
          return { platform: i.Platform.IQ2, device: i.Device.Controller };
        case this._expBrainDFUPid:
          return { platform: i.Platform.EXP, device: i.Device.Brain };
        case this._expControllerDFUPid:
          return { platform: i.Platform.EXP, device: i.Device.Controller };
        case this._iq2BrainDFUPid:
          return { platform: i.Platform.IQ2, device: i.Device.Brain };
        case this._iq2ControllerDFUPid:
          return { platform: i.Platform.IQ2, device: i.Device.Controller };
        case this._vexAI3DCameraDFUPid:
          return { platform: i.Platform.AI, device: i.Device.Camera_3D };
        case this._vexAI3DCameraRAMPid:
          return { platform: i.Platform.AI, device: i.Device.Camera_3D };
        default:
          return { platform: i.Platform.Unknown, device: i.Device.Unknown };
      }
    }
    static _sortListCB(t, e) {
      var o = `${t.platform} ${t.device}`.toUpperCase(),
        s = `${t.platform} ${t.device}`.toUpperCase();
      return o < s
        ? -1
        : o > s
          ? 1
          : t.communication < e.communication
            ? -1
            : t.communication > e.communication
              ? 1
              : 0;
    }
    static setPassword(t) {
      M._password = t;
    }
    static _setStartTime() {
      M._startTime = new Date();
    }
    static _elapsedTime() {
      return Number(new Date()) - Number(M._startTime);
    }
    static _logHandler(t, ...e) {
      let o = `[${M._classType}]: ${t}`;
      e?.length
        ? (console.log(o, e), M._logCB && M._logCB(`${o} ${JSON.stringify(e)}`))
        : (console.log(o), M._logCB && M._logCB(o));
    }
    _dectectHandler(t) {
      this._onDeviceDetect && this._onDeviceDetect(t);
    }
    _disconnetHandler(t) {
      this._onDeviceDisconnect && this._onDeviceDisconnect(t);
    }
    _dectectDFUHandler(t) {
      this._onDeviceDFUDetect && this._onDeviceDFUDetect(t);
    }
    _disconnetDFUHandler(t) {
      this._onDeviceDFUDisconnect && this._onDeviceDFUDisconnect(t);
    }
    get activeDeviceList() {
      return this._activeDeviceList.filter((t) => t.platform !== i.Platform.AI);
    }
    get activeDFUDeviceList() {
      return this._activeDFUDeviceList.filter(
        (t) => t.platform !== i.Platform.AI,
      );
    }
    get activeAIDeviceList() {
      return this._activeDeviceList.filter((t) => t.platform === i.Platform.AI);
    }
    get activeAIDFUDeviceList() {
      return this._activeDFUDeviceList.filter(
        (t) => t.platform === i.Platform.AI,
      );
    }
    set selectedDevice(t) {
      this._selectedDevice = t;
    }
    get selectedDevice() {
      return this._selectedDevice;
    }
    set selectedAIDevice(t) {
      this._selectedAIDevice = t;
    }
    get selectedAIDevice() {
      return this._selectedAIDevice;
    }
  },
  pe = M;
(pe._classType = "Device Manager"),
  (pe._vexVid = "2888"),
  (pe._nxpVid = "1FC9"),
  (pe._netChipTechVid = "0525"),
  (pe._expBrainPid = "0600"),
  (pe._expBrainDFUPid = "013D"),
  (pe._expControllerPid = "0610"),
  (pe._expControllerDFUPid = "061F"),
  (pe._iq2BrainPid = "0200"),
  (pe._iq2BrainDFUPid = "001F"),
  (pe._iq2ControllerPid = "0210"),
  (pe._iq2ControllerDFUPid = "021F"),
  (pe._v5BrainPid = "0501"),
  (pe._v5ControllerPid = "0503"),
  (pe._vexAI3DCameraPid = "0509"),
  (pe._vexAI3DCameraDFUPid = "0146"),
  (pe._vexAI3DCameraRAMPid = "A4A5"),
  (pe._comsMI = "MI_00"),
  (pe._userMI = "MI_02"),
  (pe._comsModem = "1"),
  (pe._userModem = "3"),
  (pe._comsIF = "if00"),
  (pe._userIF = "if02"),
  (pe._comsV5ControllerMI = "MI_01"),
  (pe._comsV5ControllerModem = "2"),
  (pe._comsV5ControllerIF = "if01"),
  (pe._aicamcomsMI = "MI_02"),
  (pe._aicamuserMI = "MI_00"),
  (pe._aicamcomsModem = "3"),
  (pe._aicamuserModem = "1"),
  (pe._aicamcomsIF = "if02"),
  (pe._aicamuserIF = "if00"),
  (pe._password = "");
var Do = L(require("child_process")),
  po = L(require("path")),
  ks = L(require("os")),
  Ns = L(require("fs")),
  Rs = L(require("vscode"));
var Zt = class {
  constructor(t) {
    this._version = "1_1_0";
    this._installerName = "VEX Devices Driver Installer.exe";
    this._installSciptURI = Rs.Uri.joinPath(
      t.globalStorageUri,
      "drivers",
      this._installerName,
    );
  }
  async listVEXDrivers() {
    let t = Do.spawnSync("driverquery /SI /NH /FO CSV", { shell: !0 }),
      e = [];
    return (
      new TextDecoder()
        .decode(t.stdout)
        .split(/[\r\n]+/)
        .forEach((r) => {
          let a = r.replace(/\"/gi, "").split(","),
            c = { name: a[0], driver: a[1], active: a[2], manufacterur: a[3] };
          e.push(c);
        }),
      console.log(e.filter((r) => r.manufacterur === "VEX Robotics Inc.")),
      e.filter((r) => r.manufacterur === "VEX Robotics Inc.")
    );
  }
  async run() {
    let t = (e, o) => {
      let s = "",
        r = "",
        n = "",
        a = {};
      a.PATH =
        po.dirname(this._installSciptURI.fsPath) +
        po.delimiter +
        process.env.PATH;
      let c = { shell: !0, env: a },
        l = Do.spawn(`"${this._installerName}"`, [], c);
      console.log(l),
        l.stdout.on("data", function (p) {
          console.log(new TextDecoder().decode(p)),
            (n += new TextDecoder().decode(p));
        }),
        l.stderr.on("data", function (p) {
          console.log(new TextDecoder().decode(p)),
            (r += new TextDecoder().decode(p));
        }),
        l.on("exit", function (p) {
          console.log(p.toString(2)), e({ stdout: n, stderr: r, exitCode: p });
        });
    };
    return new Promise((e, o) => t(e, o));
  }
  async download() {
    return i.Feedback_Extension.ResourceManager.downloadDriverInstaller(
      this._version,
    );
  }
  get exist() {
    return (
      console.log(this._installSciptURI.fsPath),
      ks.type() === "Windows_NT"
        ? Ns.existsSync(this._installSciptURI.fsPath)
        : !0
    );
  }
  _executeCMD(t, e, o) {
    let s,
      r = (n, a) => {
        let c = "",
          l = "",
          p = "",
          f = {};
        f.PATH =
          po.dirname(this._installSciptURI.fsPath) +
          po.delimiter +
          process.env.PATH;
        let U = { shell: !0, env: f },
          P = Do.spawn(`"${this._installerName}"`, [], U);
        console.log(P),
          P.stdout.on("data", function (x) {
            console.log(new TextDecoder().decode(x)),
              (p += new TextDecoder().decode(x));
          }),
          P.stderr.on("data", function (x) {
            console.log(new TextDecoder().decode(x)),
              (l += new TextDecoder().decode(x));
          }),
          P.on("exit", function (x) {
            console.log(x.toString(2)),
              n({ stdout: p, stderr: l, exitCode: x });
          });
      };
    return new Promise((n, a) => r(n, a));
  }
};
((n) => (
  (n.EXP_USER_PORT = "VEX EXP User Port"),
  (n.EXP_COM_PORT = "VEX EXP Communications Port"),
  (n.EXP_CONTROLLER_DFU = "VEX EXP cFirmware Upgrade"),
  (n.IQ2_USER_PORT = "VEX IQ User Port"),
  (n.IQ2_COM_PORT = "VEX IQ Communications Port"),
  (n.IQ2_CONTROLLER_DFU = "VEX IQ cFirmware Upgrade")
))(Zt || (Zt = {}));
var Pt = L(require("fs")),
  $s = L(require("os")),
  mo = L(require("vscode"));
var at = class {
  constructor(t, e, o) {
    (this._logHomeUri = mo.Uri.joinPath(
      t.globalStorageUri,
      "logs",
      `_${process.pid}`,
    )),
      (this._outputBox = mo.window.createOutputChannel(e, o));
    let s = i.Utils.fileDateString();
    if (
      ((this._logFileName = `${this._outputBox.name.replace(/\s/gi, "_")}_${process.pid}_${s}.debuglog`),
      (this._logUri = mo.Uri.joinPath(
        this._logHomeUri,
        `${this._logFileName}`,
      )),
      !Pt.existsSync(this._logHomeUri.fsPath))
    )
      Pt.mkdirSync(this._logHomeUri.fsPath), this._writeTextToLog("");
    else {
      let r = `${this._outputBox.name.replace(/\s/gi, "_")}_${process.pid}_\\d{4}-\\d{2}-\\d{2}`,
        n = new RegExp(r, "gi"),
        a = Pt.readdirSync(this._logHomeUri.fsPath);
      (a = a.filter((c) => {
        this._logFileName;
      })),
        a.forEach((c) => {
          if (n.test(c) && c !== this._logFileName) {
            let l = mo.Uri.joinPath(this._logHomeUri, c);
            Pt.rmSync(l.fsPath), this._writeTextToLog("");
          } else console.log(n.test(c), c !== this._logFileName, c);
        }),
        a.length === 0 && this._writeTextToLog("");
    }
  }
  _writeTextToLog(t) {
    Pt.appendFileSync(this._logUri.fsPath, `${t}`);
  }
  static _addLeadingZeros(t, e) {
    if (t < 0) {
      let o = String(t).slice(1);
      return "-" + o.padStart(e, "0");
    }
    return String(t).padStart(e, "0");
  }
  appendLine(t) {
    let e = `${at.getTimeStamp()} ${t}`;
    this._outputBox.appendLine(e), this._writeTextToLog(e + $s.EOL);
  }
  append(t) {
    let e = `${at.getTimeStamp()} ${t}`;
    this._outputBox.append(e), this._writeTextToLog(e);
  }
  clear() {
    this._outputBox.clear();
  }
  hide() {
    this._outputBox.hide();
  }
  show() {
    this._outputBox.show();
  }
  static getTimeStamp() {
    let t = new Date(),
      e = at._addLeadingZeros(t.getMonth() + 1, 2),
      o = at._addLeadingZeros(t.getDate(), 2),
      s = at._addLeadingZeros(t.getFullYear(), 4),
      r = at._addLeadingZeros(t.getHours(), 2),
      n = at._addLeadingZeros(t.getMinutes(), 2),
      a = at._addLeadingZeros(t.getSeconds(), 2),
      c = at._addLeadingZeros(t.getMilliseconds(), 3);
    return `[${e}/${o}/${s} ${r}:${n}:${a}:${c}]`;
  }
  get logFileName() {
    return this.logFileName;
  }
};
var Le = L(require("vscode")),
  Oe = L(require("fs")),
  Ms = L(require("path")),
  Ko = L(require("os")),
  uo = require("util");
var Ut = class {
    constructor(t, e) {
      this._name = "";
      this._description = "";
      (this._projectUri = t),
        (this._settingsFileUri = Le.Uri.joinPath(
          this._projectUri,
          ".vscode",
          Ut.vexProjectSettingsName,
        )),
        (this._cppIntellisenseSettings = Le.Uri.joinPath(
          this._projectUri,
          ".vscode",
          Ut.c_cpp_propertiesFileName,
        )),
        (this._pythonIntellisenseSettings = Le.Uri.joinPath(
          this._projectUri,
          ".vscode",
          Ut.python_propertiesFileName,
        )),
        e && this.updateSettingsObj(e),
        this.writeProjectSettings(e);
    }
    updateSettingsObj(t) {
      (this._name = t.project.name ? t.project.name : ""),
        (this._description = t.project.description
          ? t.project.description
          : ""),
        (this._sdkVersion = t.project.sdkVersion ? t.project.sdkVersion : ""),
        (this._language = t.project.language
          ? t.project.language
          : i.Language.unknown),
        t.project.language === "cpp" &&
          ((this._includesUris = []),
          t?.project?.cpp?.includePath.forEach((e) => {
            this._includesUris.push(e);
          }));
    }
    readProjectSettings() {
      if (
        !Oe.existsSync(this._settingsFileUri.fsPath) ||
        !this._settingsFileUri.fsPath.includes(Ut.vexProjectSettingsName)
      )
        return;
      let t = Oe.readFileSync(this._settingsFileUri.fsPath);
      return JSON.parse(new uo.TextDecoder().decode(t));
    }
    async writeProjectSettings(t) {
      this._lastProjectSettingsWrite = t;
      let e = Le.Uri.joinPath(this._projectUri, ".vscode");
      !this._settingsFileUri.fsPath ||
        !t ||
        (Oe.existsSync(this._settingsFileUri.fsPath)
          ? (e = this._settingsFileUri)
          : (await Le.workspace.fs.createDirectory(e),
            (e = Le.Uri.joinPath(e, Ut.vexProjectSettingsName))),
        Oe.writeFileSync(e.fsPath, JSON.stringify(t, null, "	")),
        this.updateSettingsObj(t));
    }
    updateProjectSettings() {
      this.updateSettingsObj(this.readProjectSettings());
    }
    get lastProjectSettingsWrite() {
      return this._lastProjectSettingsWrite;
    }
    static readProjectSettings(t) {
      if (
        !Oe.existsSync(t.fsPath) ||
        !t.fsPath.includes(Ut.vexProjectSettingsName)
      )
        return;
      let e = Oe.readFileSync(t.fsPath);
      return JSON.parse(new uo.TextDecoder().decode(e));
    }
    static async writeProjectSettings(t, e) {
      let o = Le.Uri.joinPath(e, ".vscode"),
        s = Le.Uri.joinPath(o, Ut.vexProjectSettingsName);
      !s.fsPath ||
        !t ||
        (Oe.existsSync(s.fsPath)
          ? (o = s)
          : (await Le.workspace.fs.createDirectory(o),
            (o = Le.Uri.joinPath(o, Ut.vexProjectSettingsName))),
        Oe.writeFileSync(o.fsPath, JSON.stringify(t, null, "	")));
    }
    async updateIntellesenseJSON(t) {
      let e = Le.workspace.getConfiguration(),
        o = this.readProjectSettings(),
        s = Le.Uri.joinPath(this._projectUri, ".vscode");
      if (!Oe.existsSync(this._pythonIntellisenseSettings.fsPath)) {
        await Le.workspace.fs.createDirectory(s);
        let r = JSON.stringify({}, null, "	");
        console.log(r),
          Oe.writeFileSync(this._pythonIntellisenseSettings.fsPath, r);
      }
      if (o.project.language === "cpp") {
        let n = [
            Ms.join(
              "${config:vexrobotics.vexcode.Cpp.Sdk.Home}",
              o.project.platform,
              o.project.sdkVersion,
              `vex${o.project.platform.toLowerCase()}`,
              "gcc",
              "include",
              "sys",
            ),
          ],
          a = {};
        Oe.existsSync(this._pythonIntellisenseSettings.fsPath)
          ? (a = JSON.parse(
              new uo.TextDecoder().decode(
                Oe.readFileSync(this._pythonIntellisenseSettings.fsPath),
              ),
            ))
          : await Le.workspace.fs.createDirectory(s),
          (a[i.Extension.Settings.microsoftCppSysIncID] = n);
        let c = JSON.stringify(a, null, "	");
        console.log(a),
          Oe.writeFileSync(this._pythonIntellisenseSettings.fsPath, c);
        let l = "";
        Ko.type() === "Windows_NT" && (l = "clang"),
          Ko.type() === "Darwin" && (l = "clang");
        let p = `${"${config:" + i.Extension.Settings.toolchainCPPPathID + "}"}`,
          f = Le.Uri.file(""),
          U = Le.Uri.joinPath(f, "clang", "bin", l),
          P = `${"${config:" + i.Extension.Settings.sdkCPPHomeID + "}"}`,
          x = Le.Uri.joinPath(
            f,
            o.project.platform,
            this._sdkVersion,
            "vex" + o.project.platform.toLowerCase(),
          );
        console.log(x);
        let $ = {
          env: {
            vex_compilerPath: `${p}${U.fsPath}`,
            vex_sdkPath: `${P}${x.fsPath}`,
            vex_gcc:
              o.project.platform === "V5"
                ? "${vex_sdkPath}/gcc/include/c++/4.9.3"
                : "${vex_sdkPath}/gcc/include/c++/7.3.1",
            vex_sdkIncludes: [
              "${vex_sdkPath}/clang/8.0.0/include/**",
              "${vex_gcc}/**",
              "${vex_gcc}/arm-none-eabi/armv7-arm/thumb",
              "${vex_sdkPath}/gcc/include",
              "${vex_sdkPath}/include/**",
              "${workspaceFolder}/include/**",
              "${workspaceFolder}/src/**",
            ],
          },
          configurations: "",
          version: 4,
        };
        Oe.existsSync(this._cppIntellisenseSettings.fsPath) ||
          (await Le.workspace.fs.createDirectory(s),
          await Le.workspace.fs.copy(t, this._cppIntellisenseSettings));
        let N = Oe.readFileSync(this._cppIntellisenseSettings.fsPath),
          F = JSON.parse(new uo.TextDecoder().decode(N));
        if ($.env === F.env) return;
        ($.configurations = F.configurations),
          console.log("Settings URI:", this._cppIntellisenseSettings.fsPath),
          console.log("Settings JSON:", $),
          Oe.writeFileSync(
            this._cppIntellisenseSettings.fsPath,
            JSON.stringify($, null, "	"),
          );
      }
      if (o.project.language === "python") {
        await i.Utils.asyncSleep(500);
        let r = e.get(i.Extension.Settings.sdkPythonHomeID),
          n = {};
        Oe.existsSync(this._pythonIntellisenseSettings.fsPath)
          ? (n = JSON.parse(
              new uo.TextDecoder().decode(
                Oe.readFileSync(this._pythonIntellisenseSettings.fsPath),
              ),
            ))
          : await Le.workspace.fs.createDirectory(s),
          (n[i.Extension.Settings.pylanceStubPathID] =
            `${r}\\${o.project.platform.toUpperCase()}\\${o.project.sdkVersion}\\vex${o.project.platform.toLowerCase()}\\stubs`),
          (n[i.Extension.Settings.pylanceDiagnosticModePathID] = "workspace"),
          (n[i.Extension.Settings.pylanceCheckingModeID] = "basic");
        let a = JSON.stringify(n, null, "	");
        console.log(n),
          Oe.writeFileSync(this._pythonIntellisenseSettings.fsPath, a);
      }
    }
    set name(t) {
      this._name = t.length <= 13 ? t : t.substring(0, 12);
    }
    get name() {
      return this._name;
    }
    get projectUri() {
      return this._projectUri;
    }
    get description() {
      return this._description;
    }
    get sdkVersion() {
      return this._sdkVersion;
    }
    get includeEnvUris() {
      return this._includesUris;
    }
    get language() {
      return this._language;
    }
    get settingsFileUri() {
      return this._settingsFileUri;
    }
  },
  Ct = Ut;
(Ct.vexProjectSettingsName = "vex_project_settings.json"),
  (Ct.c_cpp_propertiesFileName = "c_cpp_properties.json"),
  (Ct.python_propertiesFileName = "settings.json");
var j = L(require("vscode")),
  be = L(require("fs")),
  Je = L(require("os")),
  Ws = L(require("child_process")),
  Qe = require("util"),
  qe = L(require("path"));
var te = L(require("vscode"));
var Ci = (y, t, e, o, s, r) => `
    <vscode-data-grid-row class="row">
        <vscode-data-grid-cell grid-column="1">
            <section class="component-row">
                <section class="component-container">
                    <img src="${t}" alt="${r} Project Icon" >
                </section>
                <section class="component-container">
                    <h3 id="project-title-${y}" class="zeroMargin project-title">${e}</h3>
                    <p  id="project-description-${y}" class="p-description project-description">${o}</p>
                    <section id="project-tags-${y}" class="label-row">
                        ${s}
                    </section>
                </section>

            </section>
        </vscode-data-grid-cell>
    </vscode-data-grid-row>
`,
  wi = (y) => `<vscode-tag>${y}</vscode-tag>`,
  zt = class {
    constructor(t) {
      console.log(t),
        (this._id = t ? t.id : ""),
        (this._iconUri = t ? t.iconUri : void 0),
        (this._projectName = t ? t.projectName : ""),
        (this._description = t ? t.description : ""),
        (this._tags = t ? t.tags : []),
        (this._platform = t ? t.platform : ""),
        console.log(this);
    }
    set iconUri(t) {
      this._iconUri = t;
    }
    set projectName(t) {
      this._projectName = t;
    }
    set description(t) {
      this._description = t;
    }
    set tags(t) {
      this._tags = t;
    }
    get html() {
      return Ci(
        this._id,
        this._iconUri,
        this._projectName,
        this._description,
        this._getTagHtml(),
        this._platform,
      );
    }
    _getTagHtml() {
      let t = "";
      return (
        this._tags.length &&
          this._tags.forEach((e) => {
            t += wi(e);
          }),
        t
      );
    }
    static html(t) {
      let e = "";
      return (
        t &&
          ((e +=
            '<vscode-data-grid id="ListContainer" generate-header="none" aria-label="Basic" class="project-list">'),
          t.forEach((o) => {
            e += o.html;
          }),
          (e += "</vscode-data-grid>")),
        e
      );
    }
    static getObjsFromOptionList(t) {
      if (!t) return [];
      let e = [];
      return (
        t.forEach((o) => {
          e.push(new zt(o)), console.log(e);
        }),
        e
      );
    }
  };
var _i = (y, t, e, o) => `
    <vscode-data-grid-row class="row platform-row">
        <vscode-data-grid-cell grid-column="1" style="height:auto!important; padding-top:10%!important; padding-bottom:10%!important;">
            <div class="platform-container">
                <div class="platform-image-container">
                    <img class="platform-img" src="${t}" alt="${o} Project Icon" >
                </div>
                <div class="platform-title-container">
                    <h2 id="project-title-${y}" class="platform-title">${e}</h2>
                </div>
            </div>

        </vscode-data-grid-cell>
    </vscode-data-grid-row>
`;
var eo = class {
  constructor(t) {
    console.log(t),
      (this._id = t ? t.id : ""),
      (this._iconUri = t ? t.iconUri : void 0),
      (this._projectName = t ? t.platformName : ""),
      (this._platform = t ? t.platform : ""),
      console.log(this);
  }
  set iconUri(t) {
    this._iconUri = t;
  }
  set projectName(t) {
    this._projectName = t;
  }
  get html() {
    return _i(this._id, this._iconUri, this._projectName, this._platform);
  }
  static html(t) {
    let e = "";
    return (
      t &&
        ((e +=
          '<vscode-data-grid id="ListContainer" generate-header="none" aria-label="Basic" class="platform-list">'),
        t.forEach((o) => {
          e += o.html;
        }),
        (e += "</vscode-data-grid>")),
      e
    );
  }
  static getObjsFromOptionList(t) {
    if (!t) return [];
    let e = [];
    return (
      t.forEach((o) => {
        e.push(new eo(o)), console.log(e);
      }),
      e
    );
  }
};
var Ii = (y, t, e) => `
    <vscode-data-grid-row class="row platform-row">
    <vscode-data-grid-cell grid-column="1" style="height:auto!important; padding-top:10%!important; padding-bottom:10%!important;">
        <div class="platform-container">
            <div class="platform-image-container">
            <img class="language-img" src="${t}" alt="${e} Language Icon" >
            </div>
            <div class="platform-title-container">
            <h2 id="language-title-${y}" class="language-title">${e}</h2>
            </div>
        </div>

    </vscode-data-grid-cell>
</vscode-data-grid-row>
`,
  to = class {
    constructor(t) {
      console.log(t),
        (this._id = t ? t.id : ""),
        (this._iconUri = t ? t.iconUri : void 0),
        (this._languageName = t ? t.languageTitle : ""),
        console.log(this);
    }
    set iconUri(t) {
      this._iconUri = t;
    }
    set projectName(t) {
      this._languageName = t;
    }
    get html() {
      return Ii(this._id, this._iconUri, this._languageName);
    }
    static html(t) {
      let e = "";
      return (
        t &&
          ((e +=
            '<vscode-data-grid id="ListContainer" generate-header="none" aria-label="Basic" class="platform-list">'),
          t.forEach((o) => {
            e += o.html;
          }),
          (e += "</vscode-data-grid>")),
        e
      );
    }
    static getObjsFromOptionList(t) {
      if (!t) return [];
      let e = [];
      return (
        t.forEach((o) => {
          e.push(new to(o)), console.log(e);
        }),
        e
      );
    }
  };
var S = L(require("vscode")),
  Di = [
    {
      projectName: "V5 Empty Template Project",
      description: "This is a V5 python template project",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Empty"],
      zipName: "py_v5_vsc_empty.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "V5 Clawbot Project",
      description: "This is an V5 python Clawbot project",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_v5_vsc_clawbot.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Clawbot Controller with Events",
      description:
        "This example will use Controller button events to control the V5 Clawbot arm and claw",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_v5_vsc_clawbot_controller_tank.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Drive to Location (Known Starting Position)",
      description:
        "This example will show how to use a GPS Sensor to navigate a V5 Moby Hero Bot to the center of a field by driving along the X-axis then the Y-axis",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "py_v5_vsc_drive_to_location_gps.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Drivetrain Sensing",
      description:
        "This example will show all of the available commands for using the Drivetrain",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "py_v5_vsc_drivetrain_sensing.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Limit / Bumper Sensing",
      description:
        "This example will show all of the available commands for using the Limit and Bumper Sensors",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "py_v5_vsc_limit_bumper_sensing.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Right Arcade Control",
      description:
        "This example will use the right X/Y Controller axis to control the Clawbot.",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_v5_vsc_right_arcade_control.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Split Arcade Control",
      description:
        "This example will use the left Y and right X Controller axis to control the Clawbot.",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: [, "Clawbot"],
      zipName: "py_v5_vsc_split_arcade_control.zip",
      platform: "V5",
      language: "python",
    },
    {
      projectName: "Using Threads",
      description:
        "This example will show how to run multiple threads (tasks) in a project at the same time",
      iconUri: S.Uri.file("v5python.png"),
      id: "",
      tags: ["Control"],
      zipName: "py_v5_vsc_using_threads.zip",
      platform: "V5",
      language: "python",
    },
  ],
  Pi = [
    {
      projectName: "EXP Empty Template Project",
      description: "This is a EXP python template project",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Empty"],
      zipName: "py_exp_vsc_empty.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "EXP Clawbot Project",
      description: "This is an EXP python Clawbot project",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_exp_vsc_clawbot.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Clawbot Controller with Events",
      description:
        "The Left up/down Controller Axis (A) will control the speed of the left motor. The Right up/down Controller Axis (D) will control the  speed of the right motor. The Left up/down Controller Buttons will control the Arm. The Right up/down Controller Buttons will control the Claw",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_exp_vsc_clawbot_controller_tank.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Drivetrain Sensing",
      description:
        "This example will print Drivetrain-related information to the EXP Brain's Screen",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "py_exp_vsc_drivetrain_sensing.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Limit / Bumper Sensing",
      description:
        "This example will show all of the available commands for using the Limit and Bumper Sensors",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "py_exp_vsc_limit_bumper_sensing.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Right Arcade",
      description:
        "The Right up/down Controller Axis (2) will drive the robot forward and backwards. The Right left/right Controller Axis (1) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: [, "Clawbot"],
      zipName: "py_exp_vsc_right_arcade_control.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Split Arcade",
      description:
        "The Left up/down Controller Axis (3) will drive the robot forward and backwards. The Right left/right Controller Axis (1) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_exp_vsc_split_arcade_control.zip",
      platform: "EXP",
      language: "python",
    },
    {
      projectName: "Using Threads",
      description:
        "This example will show how to run multiple threads (tasks) in a project at the same time",
      iconUri: S.Uri.file("exppython.png"),
      id: "",
      tags: ["Control"],
      zipName: "py_exp_vsc_using_threads.zip",
      platform: "EXP",
      language: "python",
    },
  ],
  Ui = [
    {
      projectName: "IQ2 Empty Template Project",
      description: "This is a IQ2 python template project",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Empty"],
      zipName: "py_iq2_vsc_empty.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "IQ2 Clawbot Project",
      description: "This is an IQ2 python Clawbot project",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_iq2_vsc_clawbot.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "Base Robot With Sensors",
      description: "Base IQ Gen 2 robot with controls and with sensors",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Basebot"],
      zipName: "py_iq2_vsc_basebot_with_sensors.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "Controlling Fling",
      description:
        "This program shows how to control Fling's motors with the controller events and the drivetrain with the configured controller. The Left up/down controller buttons will control the Intake Motor. The Right up/down controller buttons will control the Catapult Motor. The Joysticks are configured for Tank control",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Herobot"],
      zipName: "py_iq2_vsc_herobot_fling_with_controller.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "PLTW Template",
      description: "An empty project for the Project Lead The Way chassis",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["PLTW"],
      zipName: "py_iq2_vsc_pltw_chassis.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "Split Arcade",
      description:
        "The Left up/down Controller Axis (A) will drive the robot forward and backwards. The Right left/right Controller Axis (C) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "py_iq2_vsc_split_arcade.zip",
      platform: "IQ2",
      language: "python",
    },
    {
      projectName: "Using Threads",
      description:
        "This example will show how to run multiple threads (tasks) in a project at the same time",
      iconUri: S.Uri.file("iqpython.png"),
      id: "",
      tags: ["Control"],
      zipName: "py_iq2_vsc_thread_example.zip",
      platform: "IQ2",
      language: "python",
    },
  ],
  yi = [
    {
      projectName: "V5 Empty Template Project",
      description: "This is a template for an empty V5 project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Empty"],
      zipName: "cpp_v5_vsc_empty.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "V5 Competition Template Project",
      description: "This is a V5 competition template project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Competition"],
      zipName: "cpp_v5_vsc_competition_template.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Controller with Events",
      description:
        "This example will use Controller button events to control the V5 Clawbot arm and claw",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_v5_vsc_clawbot_controller_tank.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Template (Drivetrain 2-motor)",
      description: "Clawbot Template (Drivetrain 2-motor)",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "Claw_Drive_Temp.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Template (Drivetrain 4-motor)",
      description: "Blank Pre-Configured V5 Clawbot 4-motor Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "Claw_4drive_gyro_temp.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Template (2-motor Drivetrain, No Gyro)",
      description: "Blank Pre-Configured V5 Clawbot 2-motor Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "Drive_Temp_Nogyro.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Template (4-motor Drivetrain, No Gyro)",
      description: "Blank Pre-Configured V5 Clawbot 4-motor Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "Claw_4drive_Nogyro_temp.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Template (Motors)",
      description: "Blank Pre-Configured V5 Clawbot Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "Claw_Motor_Temp.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Competition Template",
      description: "Competition template with a Clawbot configured",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Competition", "Clawbot"],
      zipName: "Clawbot_Competition.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Competition Template",
      description: "Competition template with no devices configured",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Competition"],
      zipName: "Competition_Template.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "SDV (Drivetrain 2-motor)",
      description: "Blank Pre-Configured SDV Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["SDV"],
      zipName: "SDV_Drivetrain.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "SDV (Motors)",
      description: "Blank Pre-Configured SDV Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["SDV"],
      zipName: "SDV_Motors.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Speedbot (Drivetrain 2-motor, No Gyro)",
      description:
        "Blank Pre-Configured V5 Speedbot 2-motor Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Speedbot"],
      zipName: "Speedbot_DT_NoGyro.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Speedbot (Drivetrain 4-motor, No Gyro)",
      description:
        "Blank Pre-Configured V5 Speedbot 4-motor Drivetrain Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Speedbot"],
      zipName: "Speed_bot_fourDT.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Speedbot (Motors)",
      description: "Blank Pre-Configured V5 Speedbot Project",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Speedbot"],
      zipName: "Speedbot_Motors.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Claw and Arm",
      description: "Use the claw and arm to transport an object",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Claw"],
      zipName: "Claw_And_Arm.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Using The Arm (degrees)",
      description: "Raise and lower the arm to specific positions",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Claw"],
      zipName: "Using_The_Arm.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Using The Claw (degrees)",
      description: "Open and close the claw on your V5 robot",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Claw"],
      zipName: "Using_The_Claw.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Adjusting Speed",
      description: "Change the speed of a drivetrain's drive and turn actions",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Adjusting_Speed.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drivetrain with Variables",
      description: "Change the drive distance with variables",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Drivetrain_With_Vars.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drivetrain Sensing",
      description:
        "This example will show all of the available commands for using the Drivetrain",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "cpp_v5_vsc_drivetrain_sensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Moving Backwards (inches)",
      description: "Drives the robot in reverse for 6 inches",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Moving_Backwards_In.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Moving Backwards (mm)",
      description: "Drives the robot in reverse for 150 millimeters",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Moving_Backwards_Mm.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Moving Forward (inches)",
      description: "Drives the robot forward for 6 inches",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Moving_Forward_In.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Moving Forward (mm)",
      description: "Drives the robot forward for 150 millimeters",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Moving_Forward_Mm.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Turning Left (degrees)",
      description: "Turns the robot left 90 degrees",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["V5", "Drivetrain"],
      zipName: "Turn_Left_Degrees.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Turning Right (degrees)",
      description: "Turns the robot right 90 degrees",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Drivetrain"],
      zipName: "Turn_Right_Degrees.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Electromagnet Actions",
      description: "Use the electromagnet to pick up and drop magnetic objects",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Magnet"],
      zipName: "Electromagnet_Actions.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Electromagnet Actions",
      description: "Use the electromagnet to pick up and drop magnetic objects",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Magnet"],
      zipName: "Electromagnet_Actions.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Display Position",
      description:
        "Displays the current position of the arm on the brain's screen",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmDisplayPosition.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Install",
      description: "Setup the potentiometers for your V5 Workcell arm",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmInstall.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Jogging",
      description:
        "Control the Workcell Arm by pressing buttons on the screen of the V5 Brain",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmJogging.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Manual Movement",
      description:
        "Displays the current position of the arm on the V5 Brain's screen and move the arm around manually",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmManualMovement.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Mastering",
      description:
        "Helps you to find the mastering values for your Workcell Arm",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmMastering.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm UI Panel",
      description:
        "Configure the Workcell Arm and display a basic UI on the V5 Brain's screen that you can configure",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmUIPanel.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Workcell-No Sensors",
      description: "Get started with the V5 Workcell without sensors",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmWorkcellNoSensors.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Arm Workcell-With Sensors",
      description: "Get started with the V5 Workcell with sensors",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Workcell"],
      zipName: "ArmWorkcellSensors.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drawing Shapes",
      description: "Learn to draw shapes and lines on the V5 Brain's Screen.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Looks"],
      zipName: "Drawing_Shapes.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Printing Text",
      description: "Print text to the V5 Brain's Screen",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Looks"],
      zipName: "Printing_Text.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Comparing Values",
      description: "Print text based on the value of a number",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Comparing_Values.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Creating a Start Button",
      description: "Press the Brain's Screen to start your program",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Create_Start_Button.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Floor Sweeper",
      description: "Use random numbers to calculate turns",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Floor_Sweeper.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Functions (Returns)",
      description: "Use a function to add ten to an integer",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Functions_Returns.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Functions (No Returns)",
      description: "Use a function to print messages on empty rows",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Functions_NoReturn.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Making Decisions",
      description: "Use the range finder to make a decision",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Making_Decisions.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Multitasking (Tasks)",
      description: "Use tasks to run multiple functions at the same time.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Multitasking_Tasks.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Multithreading (Threads)",
      description: "Use threads to run multiple functions at the same time.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Multithreading_Threads.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Repeating Actions",
      description: "Use a loop to repeat robot movements",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Repeating_Actions.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Repeating Actions (Clawbot)",
      description: "Use a loop to repeat robot movements",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Repeating_ActionClaw.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Repeating Actions (No Gyro)",
      description: "Use a loop to repeat robot movements",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "Repeating_ActionNoGy.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Accurate Turns",
      description: "Use the Gyro to turn 90 degrees",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Accurate_turns.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Accurate Turns (Inertial Sensor)",
      description: "Use the Inertial Sensor to turn 90 degrees",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Accurate_turns_inert.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Clawbot Control",
      description: "Use events to drive the clawbot",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing", "Clawbot"],
      zipName: "Clawbot_Control.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Controller Buttons",
      description: "Using the V5 Controller Buttons",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Controller_Buttons.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detect Collisions",
      description: "Use the accelerometer to detect collisions",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Detect_Collisions.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detecting Distances",
      description: "Use the Range Finder to detect distance",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Detecting_Distances.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detecting Light",
      description: "Use the Light Sensor to detect the lighting of the room",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Detecting_Light.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detecting Objects (Vision)",
      description: "Use the Vision Sensor to detect three colors",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Detecting_Objects.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detecting Walls (Bumper)",
      description: "Stops the robot when the Bumper is pressed",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Detecting_Walls.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Detecting Walls (Bumper on 3-Wire Expander)",
      description: "Stops the robot when the Bumper is pressed",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "3-wire_expander.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Digital In Sensing",
      description:
        "Use a Digital In device to read input signals from another device",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "DigitalInSensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Digital Out Sensing",
      description: "Control another device using the Digital Out device",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "DigitalOutSensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drive to Location (Known Starting Position)",
      description:
        "Use a GPS Sensor to drive to a field's center along the X-axis, then the Y-axis, from a known starting position",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "DriveLocationKnown.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drive to Location (Unknown Starting Position)",
      description:
        "Use a GPS Sensor to drive to a specified position from a random starting position",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "DriveLocationUnknown.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drive to Location (Using Tangents)",
      description:
        "Use a GPS Sensor to drive directly to a field's center from a random starting position",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "DriveLocationTangent.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Drive to Location (Known Starting Position)",
      description:
        "This example will show how to use a GPS Sensor to navigate a V5 Moby Hero Bot to the center of a field by driving along the X-axis then the Y-axis",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "cpp_v5_vsc_drive_to_location_gps.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Distance Sensing",
      description:
        "Use the Distance Sensor to get distance and size information of an object",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Distance_Sensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Inertial Printing Demo",
      description: "Prints values of the Inertial Sensor",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Inertial_printing_demo.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Left Arcade",
      description: "Control the V5 Clawbot with the left joystick",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Left_Arcade.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Limiting Movement",
      description: "Use a limit switch to stop arm movement",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Limiting_Movement.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Limit / Bumper Sensing",
      description:
        "This example will show all of the available commands for using the Limit and Bumper Sensors",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "cpp_v5_vsc_limit_bumper_sensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Line Tracking",
      description: "Move a robot a long a line by tracking it",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Line_Tracking.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Optical Sensing",
      description:
        "Use an Optical Sensor to get hue and brightness values of an object",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Optical_Sensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Positioning Servos",
      description: "This program will spin the servo to different positions",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Positioning_Servos.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Reading Angles",
      description: "Print the potentiometer values to the V5 Brain's Screen",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Reading_Angles.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Right Arcade",
      description: "Print the potentiometer values to the V5 Brain's Screen",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Reading_Angles.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Right Arcade Control",
      description:
        "This example will use the right X/Y Controller axis to control the Clawbot.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "cpp_v5_vsc_right_arcade_control.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Rotation Sensing",
      description:
        "Use a Rotation Sensor to get angular and positional data of an axle",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Rotation_Sensing.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Split Arcade",
      description: "Control the V5 Clawbot with both joysticks.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Split_Arcade.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Tank Drive",
      description: "Control the V5 Clawbot with both joysticks.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Tank_Drive.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Using 393s",
      description: "Using 393s with your V5 robot",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Using_393s.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Using LEDs",
      description: "Turn LEDs on and off",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Using_LEDS.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "Using Quad Encoders",
      description: "Use Quad Encoders to track the rotation of a shaft",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "Using_Quad_Encoders.zip",
      platform: "V5",
      language: "cpp",
    },
    {
      projectName: "2D Arrays",
      description: "Use nested for loops to print values of a 2D Array.",
      iconUri: S.Uri.file("v5cpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "2D_Arrays.zip",
      platform: "V5",
      language: "cpp",
    },
  ],
  Si = [
    {
      projectName: "EXP Empty Template Project",
      description: "This is a template for a simple EXP project",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Empty"],
      zipName: "cpp_exp_vsc_empty.zip",
      platform: "EXP",
      language: "cpp",
    },
    {
      projectName: "ClawBot Controller With Events",
      description:
        "The Left up/down Controller Axis (3) will control the speed of the left motor. The Right up/down Controller Axis (2) will control the speed of the right motor. The Left up/down Controller Buttons will control the Arm. The Right up/down Controller Buttons will control the Claw.",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_exp_vsc_clawbot_controller_tank.zip",
      platform: "EXP",
      language: "cpp",
    },
    {
      projectName: "Drivetrain Sensing",
      description:
        "This example will print Drivetrain-related information to the EXP Brain's Screen",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Sensing"],
      zipName: "cpp_exp_vsc_drivetrain_sensing.zip",
      platform: "EXP",
      language: "cpp",
    },
    {
      projectName: "Right Arcade",
      description:
        "The Right up/down Controller Axis (2) will drive the robot forward and backwards. The Right left/right Controller Axis (1) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_exp_vsc_right_arcade_control.zip",
      platform: "EXP",
      language: "cpp",
    },
    {
      projectName: "Split Arcade",
      description:
        "The Left up/down Controller Axis (3) will drive the robot forward and backwards. The Right left/right Controller Axis (1) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_exp_vsc_split_arcade_control.zip",
      platform: "EXP",
      language: "cpp",
    },
    {
      projectName: "Using Threads",
      description:
        "This example will show how to run multiple threads (tasks) in a project at the same time",
      iconUri: S.Uri.file("expcpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "cpp_exp_vsc_using_threads.zip",
      platform: "EXP",
      language: "cpp",
    },
  ],
  Ei = [
    {
      projectName: "IQ 2nd Generation Empty Project",
      description: "This is a template for a simple IQ2 project",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Empty"],
      zipName: "cpp_iq2_vsc_empty.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "IQ2 Clawbot Project",
      description: "This is an IQ2 python Clawbot project",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_iq2_vsc_clawbot_controller.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "Base Robot With Sensors",
      description: "Base IQ Gen 2 robot with controls and with sensors",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Basebot"],
      zipName: "cpp_iq2_vsc_basebot_with_sensors.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "Controlling Fling",
      description:
        "This program shows how to control Fling's motors with the controller events and the drivetrain with the configured controller. The Left up/down controller buttons will control the Intake Motor. The Right up/down controller buttons will control the Catapult Motor. The Joysticks are configured for Tank control",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Herobot"],
      zipName: "cpp_iq2_vsc_herobot_fling_controller.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "PLTW Template",
      description: "An empty project for the Project Lead The Way chassis",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["PLTW"],
      zipName: "cpp_iq2_vsc_pltw_chassis.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "Split Arcade",
      description:
        "The Left up/down Controller Axis (A) will drive the robot forward and backwards. The Right left/right Controller Axis (C) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Clawbot"],
      zipName: "cpp_iq2_vsc_split_arcade.zip",
      platform: "IQ2",
      language: "cpp",
    },
    {
      projectName: "Split Arcade",
      description:
        "The Left up/down Controller Axis (A) will drive the robot forward and backwards. The Right left/right Controller Axis (C) will turn the robot left and right. The deadband variable prevents drift when the Controller's joystick is released.",
      iconUri: S.Uri.file("iqcpp.png"),
      id: "",
      tags: ["Control"],
      zipName: "cpp_iq2_vsc_thread_example.zip",
      platform: "IQ2",
      language: "cpp",
    },
  ],
  Vi = [],
  Po = Vi.concat(yi, Si, Ei, Di, Ui, Pi);
var Ls = L(require("os")),
  Yo = require("fs"),
  ji = require("path"),
  le = class {
    static async Show(t) {
      if ((console.log("resolve Webview"), le._isRunning))
        return (
          this._panel.reveal(this._panel.viewColumn),
          {
            event: "isRunning",
            projectPath: "",
            projectIndex: -1,
            vexSettings: {
              extension: { version: "", json: 2 },
              project: {
                sdkVersion: "",
                creationDate: "",
                description: "",
                language: void 0,
                name: "",
                platform: void 0,
                slot: 1,
              },
            },
            zipName: "",
          }
        );
      (le._extensionUri = t),
        (le._isRunning = !0),
        (le._projectOptionsList = Po);
      let e = te.window.activeTextEditor
          ? te.window.activeTextEditor.viewColumn
          : void 0,
        o = te.window.createWebviewPanel(
          le.viewType,
          "Create New Project",
          e || te.ViewColumn.One,
        );
      return console.log("resolve Webview"), await le.resolveWebviewView(o);
    }
    static async resolveWebviewView(t) {
      console.log("resolve Webview"), (this._panel = t);
      let e = !1;
      console.log("resolve Webview");
      let o = {
        event: "create",
        projectPath: "",
        projectIndex: -1,
        vexSettings: {
          extension: { version: "", json: 2 },
          project: {
            sdkVersion: "",
            creationDate: "",
            description: "",
            language: void 0,
            name: "",
            platform: void 0,
            slot: 1,
          },
        },
        zipName: "",
      };
      for (
        t.webview.options = {
          enableScripts: !0,
          localResourceRoots: [
            te.Uri.joinPath(le._extensionUri, "resources", "icons"),
            te.Uri.joinPath(le._extensionUri, "resources", "webviews"),
            te.Uri.joinPath(le._extensionUri, "dist", "webviews", "views"),
            te.Uri.joinPath(
              le._extensionUri,
              "node_modules",
              "@vscode",
              "webview-ui-toolkit",
              "dist",
            ),
            te.Uri.joinPath(
              le._extensionUri,
              "node_modules",
              "@vscode",
              "codicons",
              "dist",
            ),
            te.Uri.joinPath(le._extensionUri, "resources", "webviews", "libs"),
          ],
        },
          t.webview.html = le._getHtmlForWebview(t.webview),
          t.webview.onDidReceiveMessage((s) => {
            if ((console.log("Provider Recieved", s), !!s))
              switch (s.type) {
                case "cancelBtn": {
                  (le._isRunning = !1),
                    (o.event = "cancel"),
                    (o.projectIndex = -1),
                    (o.zipName = ""),
                    (o.vexSettings = void 0),
                    t.dispose();
                  break;
                }
                case "browseBtn": {
                  console.log("browse btn clicked");
                  let n = {
                    defaultUri: te.Uri.file(
                      te.workspace
                        .getConfiguration()
                        .get(
                          i.Extension.Settings.projectHomeID,
                          te.ConfigurationTarget.Global,
                        )
                        .toString(),
                    ),
                    canSelectFolders: !0,
                    canSelectFiles: !1,
                    canSelectMany: !1,
                  };
                  te.window.showOpenDialog(n).then((a) => {
                    if (!a) {
                      console.log("undefined file uri");
                      return;
                    }
                    console.log(a[0]),
                      this._panel.webview.postMessage({
                        type: s.type,
                        path: a[0].fsPath,
                      });
                  });
                  break;
                }
                case "updateAndCheckFolderListAtPathFinal":
                case "updateAndCheckFolderListAtPath":
                case "updateFolderListAtPath": {
                  if (!(0, Yo.existsSync)(s.path)) {
                    this._panel.webview.postMessage({
                      type: s.type,
                      paths: [],
                    });
                    break;
                  }
                  console.log("Updated Folder List", s),
                    te.workspace.fs
                      .readDirectory(te.Uri.file(s.path))
                      .then((r) => {
                        let n = [];
                        console.log("Folder List", r),
                          r.forEach((a) => {
                            a[1] === te.FileType.Directory && n.push(a[0]);
                          }),
                          console.log("Folder String List", n),
                          this._panel.webview.postMessage({
                            type: s.type,
                            paths: n,
                          }),
                          console.log("Updated Folder List Finished ", s);
                      });
                  break;
                }
                case "createProject": {
                  let r =
                      le._languageOptionsList[
                        s.simple_project_settings.language_index
                      ].language,
                    n =
                      le._platformOptionsList[
                        s.simple_project_settings.platform_index
                      ].platform,
                    a = le._projectOptionsList.filter((p) =>
                      p.language === r && p.platform === n ? 1 : 0,
                    ),
                    c,
                    l;
                  if (r === "cpp") {
                    let p = a[s.simple_project_settings.project_index].platform,
                      f = a[s.simple_project_settings.project_index].language;
                    c = {
                      extension: { version: i.Extension.version(), json: 2 },
                      project: {
                        name: s.simple_project_settings.name,
                        description: s.simple_project_settings.description,
                        creationDate: i.Utils.getDateString(),
                        platform: p,
                        language: f,
                        slot: 1,
                        sdkVersion: "",
                        cpp: {
                          includePath: [],
                          printf_float: n !== i.Platform.IQ2,
                        },
                      },
                    };
                  } else
                    r === "python" &&
                      (c = {
                        extension: { version: i.Extension.version(), json: 2 },
                        project: {
                          name: s.simple_project_settings.name,
                          description: s.simple_project_settings.description,
                          creationDate: i.Utils.getDateString(),
                          platform:
                            a[s.simple_project_settings.project_index].platform,
                          language:
                            a[s.simple_project_settings.project_index].language,
                          slot: 1,
                          sdkVersion: "",
                          python: { main: "src/main.py" },
                        },
                      });
                  (o.event = "create"),
                    (o.projectPath = te.Uri.file(
                      s.simple_project_settings.projectPath,
                    ).fsPath),
                    (o.projectIndex = s.simple_project_settings.project_index),
                    (o.zipName =
                      a[s.simple_project_settings.project_index].zipName),
                    (o.vexSettings = c),
                    (le._isRunning = !1),
                    t.dispose();
                  break;
                }
                case "sdkOptions": {
                  let r = le._platformOptionsList[s.platform_index].platform,
                    n = le._languageOptionsList[s.language_index].language,
                    a,
                    c;
                  switch (n) {
                    case "python":
                      c = te.Uri.file(
                        te.workspace
                          .getConfiguration()
                          .get(
                            i.Extension.Settings.sdkPythonHomeID,
                            te.ConfigurationTarget.Global,
                          )
                          .toString(),
                      );
                      break;
                    case "cpp":
                      c = te.Uri.file(
                        te.workspace
                          .getConfiguration()
                          .get(
                            i.Extension.Settings.sdkCPPHomeID,
                            te.ConfigurationTarget.Global,
                          )
                          .toString(),
                      );
                      break;
                  }
                  console.log("Language", n),
                    (a = async () =>
                      i.Feedback_Extension.ResourceManager.getSDKVersions(
                        r,
                        n,
                        c,
                      )),
                    console.log("sdkOptions", s),
                    a().then((l) => {
                      let p = "",
                        f = [],
                        U = JSON.parse(l.json);
                      U.online.catalog.forEach((P) => {
                        U.local.catalog.some((x) => P === x)
                          ? (console.log(P),
                            f.push({ version: P, type: "local" }),
                            (U.local.catalog = U.local.catalog.filter(
                              (x) => x !== P,
                            )))
                          : f.push({ version: P, type: "online" });
                      }),
                        U.local.catalog.forEach((P) => {
                          f.push({ version: P, type: "local" });
                        }),
                        f.sort((P, x) =>
                          P.version > x.version
                            ? -1
                            : P.version < x.version
                              ? 1
                              : 0,
                        ),
                        f.forEach((P) => {
                          P.type === "online"
                            ? (p += `<vscode-option><div><span slot="start" class="codicon codicon-globe"></span>${P.version}</div></vscode-option>`)
                            : (p += `<vscode-option><div><span slot="start" class="codicon codicon-folder"></span>${P.version}</div></vscode-option>`);
                        }),
                        console.log("optionsList", p),
                        this._panel.webview.postMessage({
                          type: s.type,
                          sdkOptions: p,
                        });
                    });
                  break;
                }
                case "projectHomePath": {
                  let r = te.Uri.file(
                    te.workspace
                      .getConfiguration()
                      .get(
                        i.Extension.Settings.projectHomeID,
                        te.ConfigurationTarget.Global,
                      )
                      .toString(),
                  );
                  console.log("projectHomePath", r.fsPath),
                    this._panel.webview.postMessage({
                      type: s.type,
                      projectHomePath: r.fsPath,
                    });
                  break;
                }
                case "getLanguageList": {
                  let r = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "python-logo.png",
                      ),
                    ),
                    n = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "cpp-logo.png",
                      ),
                    );
                  le._languageOptionsList = [
                    {
                      languageTitle: "Python",
                      language: "python",
                      iconUri: r,
                      id: "0",
                    },
                    {
                      languageTitle: "C/C++",
                      language: "cpp",
                      iconUri: n,
                      id: "1",
                    },
                  ];
                  let a = to.getObjsFromOptionList(le._languageOptionsList);
                  this._panel.webview.postMessage({
                    type: s.type,
                    html: to.html(a),
                  });
                  break;
                }
                case "getPlatformList": {
                  let r = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeEXP.png",
                      ),
                    ),
                    n = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeIQGEN2.png",
                      ),
                    ),
                    a = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeV5.png",
                      ),
                    );
                  le._platformOptionsList = [
                    {
                      platformName: "IQ 2nd Generation",
                      iconUri: n,
                      id: "0",
                      platform: "IQ2",
                    },
                    {
                      platformName: "EXP",
                      iconUri: r,
                      id: "1",
                      platform: "EXP",
                    },
                    { platformName: "V5", iconUri: a, id: "2", platform: "V5" },
                  ];
                  let c = eo.getObjsFromOptionList(le._platformOptionsList);
                  this._panel.webview.postMessage({
                    type: s.type,
                    html: eo.html(c),
                  });
                  break;
                }
                case "getProjectList": {
                  let r = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeEXP.png",
                      ),
                    ),
                    n = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeIQGEN2.png",
                      ),
                    ),
                    a = t.webview.asWebviewUri(
                      te.Uri.joinPath(
                        this._extensionUri,
                        "resources",
                        "icons",
                        "vexcodeV5.png",
                      ),
                    ),
                    c = 0;
                  console.log(
                    le._languageOptionsList[s.language_index].language,
                    le._platformOptionsList[s.platform_index].platform,
                  );
                  let l = Po.filter((f) =>
                    f.language ===
                      le._languageOptionsList[s.language_index].language &&
                    f.platform ===
                      le._platformOptionsList[s.platform_index].platform
                      ? 1
                      : 0,
                  );
                  (le._projectOptionsList = []),
                    l.forEach((f) => {
                      let U = {
                        description: f.description,
                        iconUri: f.iconUri,
                        language: f.language,
                        platform: f.platform,
                        projectName: f.projectName,
                        tags: f.tags,
                        zipName: f.zipName,
                        id: c.toString(),
                      };
                      if ((c++, U.iconUri)) {
                        let P = te.Uri.joinPath(
                          this._extensionUri,
                          "resources",
                          "icons",
                          U.iconUri.fsPath,
                        );
                        (0, Yo.existsSync)(ji.resolve(P.fsPath))
                          ? (U.iconUri = t.webview.asWebviewUri(P))
                          : (U.iconUri = void 0);
                      }
                      f.iconUri === void 0 &&
                        (U.platform === "EXP" && (U.iconUri = r),
                        U.platform === "IQ2" && (U.iconUri = n),
                        U.platform === "V5" && (U.iconUri = a)),
                        le._projectOptionsList.push(U);
                    });
                  let p = zt.getObjsFromOptionList(le._projectOptionsList);
                  this._panel.webview.postMessage({
                    type: s.type,
                    html: zt.html(p),
                  });
                  break;
                }
                case "getProjectHtml": {
                  let r = le._projectOptionsList.filter((a) =>
                      a.language ===
                        le._languageOptionsList[s.language_index].language &&
                      a.platform ===
                        le._platformOptionsList[s.platform_index].platform
                        ? 1
                        : 0,
                    ),
                    n = zt.getObjsFromOptionList([r[s.project_index]]);
                  this._panel.webview.postMessage({
                    type: s.type,
                    html: n[0].html,
                    language:
                      le._languageOptionsList[s.language_index].language,
                  });
                  break;
                }
                case "getOSType": {
                  this._panel.webview.postMessage({
                    type: s.type,
                    osType: Ls.type(),
                  });
                  break;
                }
                case "folderPath": {
                  let r = te.workspace
                    .getConfiguration()
                    .get(
                      i.Extension.Settings.projectHomeID,
                      te.ConfigurationTarget.Global,
                    )
                    .toString();
                  this._panel.webview.postMessage({ type: s.type, path: r });
                }
              }
          }),
          t.onDidDispose(() => {
            le._isRunning && (console.log("Disposed"), (o.event = "disposed")),
              (e = !0),
              (le._isRunning = !1);
          });
        !e;

      )
        await new Promise((s) => setTimeout(s, 500));
      return console.log("Create Project DONE"), o;
    }
    static _getHtmlForWebview(t) {
      let e = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "dist",
            "webviews",
            "views",
            "newProject.js",
          ),
        ),
        o = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "libs",
            "jquery",
            "jquery.js",
          ),
        ),
        s = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "reset.css",
          ),
        ),
        r = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "vscode.css",
          ),
        ),
        n = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "main.css",
          ),
        ),
        a = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.js",
          ),
        ),
        c = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
          ),
        ),
        l = t.asWebviewUri(
          te.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.svg",
          ),
        ),
        p = Ti();
      return `<!DOCTYPE html>
			<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <!--
                        Use a content security policy to only allow loading images from https or from our extension directory,
                        and only allow scripts that have a specific nonce.
                    -->
					<!--
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${p}';">
					--> 
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

            
                    <link href="${s}" rel="stylesheet">
                    <link href="${n}"  rel="stylesheet">
					<link href="${n}"  rel="stylesheet">
					<link href="${c}"     rel="stylesheet">
					
                    <script nonce="${p}" src="${o}"><\/script>
					<script nonce="${p}" type="module" src="${a}"><\/script>
                    <script nonce="${p}" src="${e}"><\/script>


                    <title>Create new vex project</title>
                </head>
                <body>
					<div id="mainForm" class="main-section noselect">
						<div id="popUpWindow" class="main-popup-window">
							<section  class="strectch-row">
								<h2 id="contentTitle" class="h2-title">Create a New VEX Project</h2>
								<section  class="top-strectch-row">
								</section>
								<vscode-button id="cancelBtn" appearance="icon" aria-label="Close">
									<i class="btnIcon codicon codicon-close"></i>
								</vscode-button>							
							</section>

							<div class="component-container align-center">
								<h3 id="contentInstruction" class="instruction-text">Select a Project Platform</h3>
							</div>
							<div id="search">
								<section class="header-row">
									<vscode-text-field id="searchInput" placeHolder="Search">
										<span slot="start" class="codicon codicon-search"></span>
									</vscode-text-field>
								</section>
							</div>
							<div id="contentWindow"  class="component-container project-list">
							</div>
							<section  class="strectch-column">
							</section>
							<section  class="button-row">
								<section  class="button-row">
									<vscode-button id="createBtn" class="createBtn" appearance="primary"  aria-label="Create">
										Create
									</vscode-button>

								</section>
								<section  class="strectch-row">
								</section>
								<vscode-button id="backBtn" appearance="icon"  aria-label="Back">
								<i class="btnIcon codicon codicon-arrow-left"></i>
							</vscode-button>
							</section>
						</div>
					</div>
				</body>
			</html>`;
    }
  },
  go = le;
(go.viewType = "project.createNew"), (go._isRunning = !1);
function Ti() {
  let y = "",
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let e = 0; e < 32; e++)
    y += t.charAt(Math.floor(Math.random() * t.length));
  return y;
}
var se = L(require("vscode"));
var Os = L(require("os")),
  Bs = require("fs"),
  Te = class {
    static async Show(t, e) {
      if (Te._isRunning) {
        let r = se.window.activeTextEditor
          ? se.window.activeTextEditor.viewColumn
          : void 0;
        return (
          this._view.reveal(r || se.ViewColumn.One),
          {
            event: "isRunning",
            projectPath: "",
            vexSettings: {
              extension: { version: "", json: 1 },
              project: {
                sdkVersion: "",
                creationDate: "",
                description: "",
                language: void 0,
                name: "",
                platform: void 0,
                slot: 1,
              },
            },
          }
        );
      }
      (Te._isRunning = !0), (Te._extensionUri = t);
      let o = se.window.activeTextEditor
          ? se.window.activeTextEditor.viewColumn
          : void 0,
        s = se.window.createWebviewPanel(
          Te.viewType,
          Te._type,
          o || se.ViewColumn.One,
        );
      return await Te.resolveWebviewView(s, e);
    }
    static async Reset() {
      (Te._isRunning = !1), (Te._eventDataRecieved = !0);
    }
    static async resolveWebviewView(t, e) {
      this._view = t;
      let o = { event: "disposed", vexSettings: e, projectPath: "" };
      for (
        t.webview.options = {
          enableScripts: !0,
          localResourceRoots: [
            se.Uri.joinPath(Te._extensionUri, "resources", "icons"),
            se.Uri.joinPath(Te._extensionUri, "resources", "webviews"),
            se.Uri.joinPath(Te._extensionUri, "dist", "webviews", "views"),
            se.Uri.joinPath(
              Te._extensionUri,
              "node_modules",
              "@vscode",
              "webview-ui-toolkit",
              "dist",
            ),
            se.Uri.joinPath(
              Te._extensionUri,
              "node_modules",
              "@vscode",
              "codicons",
              "dist",
            ),
            se.Uri.joinPath(Te._extensionUri, "resources", "webviews", "libs"),
            se.Uri.joinPath(Te._extensionUri, "resources", "webviews", "style"),
          ],
        },
          t.webview.html = await Te._getHtmlForWebview(t.webview, e),
          t.webview.onDidReceiveMessage((s) => {
            switch (s.type) {
              case "cancelBtn": {
                (o.event = "cancel"), (o.vexSettings = void 0), t.dispose();
                break;
              }
              case "browseBtn": {
                console.log("browse btn clicked");
                let n = {
                  defaultUri: se.Uri.file(se.env.appHost),
                  canSelectFolders: !0,
                  canSelectFiles: !1,
                  canSelectMany: !1,
                };
                se.window.showOpenDialog(n).then((a) => {
                  if ((console.log(a[0]), a[0] === void 0)) {
                    console.log("undefined file uri");
                    return;
                  }
                  this._view.webview.postMessage({
                    type: s.type,
                    path: a[0].fsPath,
                  });
                });
                break;
              }
              case "saveProjectSettings": {
                console.log(s.simple_project_settings),
                  (o.event = "save"),
                  (o.vexSettings.project.name = s.simple_project_settings.name),
                  (o.vexSettings.project.description =
                    s.simple_project_settings.description),
                  (o.vexSettings.project.sdkVersion =
                    s.simple_project_settings.sdkVersion),
                  (o.projectPath = se.Uri.joinPath(
                    se.Uri.file(s.simple_project_settings.projectPath),
                    e.project.name,
                  ).fsPath),
                  (o.vexSettings.extension.version = i.Extension.version()),
                  (o.vexSettings.project.creationDate =
                    new Date().toUTCString()),
                  t.dispose();
                break;
              }
              case "getOSType": {
                this._view.webview.postMessage({
                  type: s.type,
                  osType: Os.type(),
                });
                break;
              }
              case "updateAndCheckFolderListAtPathFinal":
              case "updateAndCheckFolderListAtPath":
              case "updateFolderListAtPath": {
                if (!(0, Bs.existsSync)(s.path)) {
                  this._view.webview.postMessage({ type: s.type, paths: [] });
                  break;
                }
                console.log("Updated Folder List", s),
                  se.workspace.fs
                    .readDirectory(se.Uri.file(s.path))
                    .then((r) => {
                      let n = [];
                      console.log("Folder List", r),
                        r.forEach((a) => {
                          a[1] === se.FileType.Directory && n.push(a[0]);
                        }),
                        console.log("Folder String List", n),
                        this._view.webview.postMessage({
                          type: s.type,
                          paths: n,
                        }),
                        console.log("Updated Folder List Finished ", s);
                    });
                break;
              }
              case "folderPath": {
                let r = se.workspace
                  .getConfiguration()
                  .get(
                    i.Extension.Settings.projectHomeID,
                    se.ConfigurationTarget.Global,
                  )
                  .toString();
                this._view.webview.postMessage({ type: s.type, path: r });
              }
            }
          }),
          t.onDidDispose(() => {
            Te._eventDataRecieved = !0;
          });
        !Te._eventDataRecieved;

      )
        await new Promise((s) => setTimeout(s, 500));
      return (Te._eventDataRecieved = !1), (Te._isRunning = !1), o;
    }
    static async _getHtmlForWebview(t, e) {
      let o = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "dist",
            "webviews",
            "views",
            "projectSettings.js",
          ),
        ),
        s = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "libs",
            "jquery",
            "jquery.js",
          ),
        ),
        r = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "reset.css",
          ),
        ),
        n = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "vscode.css",
          ),
        ),
        a = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "main.css",
          ),
        ),
        c = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.js",
          ),
        ),
        l = t.asWebviewUri(
          se.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
          ),
        ),
        p = se.Uri.file(
          se.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.projectHomeID,
              se.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        f = se.Uri.file(
          se.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.sdkCPPHomeID,
              se.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        U = se.Uri.file(
          se.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.sdkPythonHomeID,
              se.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        P = se.Uri.joinPath(p, e.project.name, "bin"),
        x;
      e.project.language === "python" &&
        (x = await i.Feedback_Extension.ResourceManager.getSDKVersions(
          e.project.platform,
          e.project.language,
          U,
        )),
        e.project.language === "cpp" &&
          (x = await i.Feedback_Extension.ResourceManager.getSDKVersions(
            e.project.platform,
            e.project.language,
            f,
          ));
      let $ = JSON.parse(x.json);
      console.log($);
      let N = [],
        F = "",
        k = "";
      Te._type,
        (k = "Save"),
        $.online.catalog.forEach((ie) => {
          $.local.catalog.some((de) => ie === de)
            ? (console.log(ie),
              ie === e.project.sdkVersion
                ? N.push({ version: ie, type: "local", default: !0 })
                : N.push({ version: ie, type: "local", default: !1 }),
              ($.local.catalog = $.local.catalog.filter((de) => de !== ie)))
            : ie === e.project.sdkVersion &&
              N.push({ version: ie, type: "online", default: !0 });
        }),
        $.local.catalog.forEach((ie) => {
          ie === e.project.sdkVersion
            ? N.push({ version: ie, type: "local", default: !0 })
            : N.push({ version: ie, type: "local", default: !1 });
        }),
        N.sort(i.Utils.vexos._sortProjectSettingsSDKListCB),
        N.forEach((ie) => {
          let de = "";
          ie.default && (de = "selected"),
            ie.type === "online"
              ? (F += `<vscode-option ${de}><div><span slot="start" class="codicon codicon-globe"></span>${ie.version}</div></vscode-option>`)
              : (F += `<vscode-option ${de}><div><span slot="start" class="codicon codicon-folder"></span>${ie.version}</div></vscode-option>`);
        });
      let W = ki();
      return `<!DOCTYPE html>
			<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <!--
                        Use a content security policy to only allow loading images from https or from our extension directory,
                        and only allow scripts that have a specific nonce.
                    -->
					<!--
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${W}';">
					--> 
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

            
                    <link href="${r}" rel="stylesheet">
                    <link href="${a}"  rel="stylesheet">
					<link href="${a}"  rel="stylesheet">
					<link href="${l}"     rel="stylesheet">
                    <script nonce="${W}" src="${s}"><\/script>
					<script nonce="${W}" type="module" src="${c}"><\/script>
                    <script nonce="${W}" src="${o}"><\/script>


                    <title>${Te._type}</title>
                </head>
                <body>
					<div id="mainForm" class="main-section noselect">
					<div id="popUpWindow" class="main-popup-window">
						<section  class="strectch-row">
							<h2 id="contentTitle" class="h2-title">VEX ${e.project.platform} Project ${Te._type}</h2>
							<section  class="strectch-row">
							</section>
							<vscode-button id="cancelBtn" appearance="icon" aria-label="Close">
								<i class="btnIcon codicon codicon-close"></i>
							</vscode-button>							
						</section>
						<div id="contentWindow"  class="component-container project-list">
						<section class="component-container">
						<div>Project Name</div>
						<vscode-text-field id="projectNameInput" class="custom-textfield" placeHolder="myProjectName" value="${e.project.name}"></vscode-text-field>
						<i id="projectName-infoText" > </i>
				
						</section>
						<section class="component-container"> 
							<div>Description</div>
							<vscode-text-area id="projectDescriptionInput" class="custom-textarea" placeHolder="Write your project description here . . ." value="${e.project.description}"></vscode-text-field>
					
						</section>
						<section class="component-container">
							<p>SDK Version</p>
							<vscode-dropdown position="below" id="sdkDD">
								${F}
							</vscode-dropdown>    
						</section>
						</div>
						<section  class="strectch-column">
						</section>
						<section  class="button-row">
							<section  class="button-row">
								<vscode-button id="createBtn" class="createBtn" appearance="primary"  aria-label="Create">
									${k}
								</vscode-button>

							</section>
							<section  class="strectch-row">
							</section>

						</section>
					</div>
					</div>
				</body>
			</html>`;
    }
  },
  pt = Te;
(pt.viewType = "project.createNew"),
  (pt._type = "Settings"),
  (pt._isRunning = !1),
  (pt._eventDataRecieved = !1);
function ki() {
  let y = "",
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let e = 0; e < 32; e++)
    y += t.charAt(Math.floor(Math.random() * t.length));
  return y;
}
var ne = L(require("vscode"));
var Fs = L(require("os")),
  Xs = require("fs"),
  Xe = class {
    static get isRunning() {
      return Xe._isRunning;
    }
    static async Show(t, e, o = !0) {
      if (Xe._isRunning)
        return (
          this._panel.reveal(this._panel.viewColumn),
          {
            event: "isRunning",
            projectPath: "",
            vexSettings: {
              extension: { version: "", json: 1 },
              project: {
                sdkVersion: "",
                creationDate: "",
                description: "",
                language: void 0,
                name: "",
                platform: void 0,
                slot: 1,
              },
            },
          }
        );
      (Xe._isRunning = !0),
        (Xe._showProjectPathBrowser = o),
        (Xe._extensionUri = t);
      let s = ne.window.activeTextEditor
          ? ne.window.activeTextEditor.viewColumn
          : void 0,
        r = ne.window.createWebviewPanel(
          Xe.viewType,
          Xe._type,
          s || ne.ViewColumn.One,
        );
      return await Xe.resolveWebviewView(r, e);
    }
    static async resolveWebviewView(t, e) {
      this._panel = t;
      let o = !1,
        s = { event: "disposed", vexSettings: e, projectPath: "" };
      for (
        t.webview.options = {
          enableScripts: !0,
          localResourceRoots: [
            ne.Uri.joinPath(Xe._extensionUri, "resources", "icons"),
            ne.Uri.joinPath(Xe._extensionUri, "resources", "webviews"),
            ne.Uri.joinPath(Xe._extensionUri, "dist", "webviews", "views"),
            ne.Uri.joinPath(
              Xe._extensionUri,
              "node_modules",
              "@vscode",
              "webview-ui-toolkit",
              "dist",
            ),
            ne.Uri.joinPath(
              Xe._extensionUri,
              "node_modules",
              "@vscode",
              "codicons",
              "dist",
            ),
            ne.Uri.joinPath(Xe._extensionUri, "resources", "webviews", "libs"),
            ne.Uri.joinPath(Xe._extensionUri, "resources", "webviews", "style"),
          ],
        },
          t.webview.html = await Xe._getHtmlForWebview(t.webview, e),
          t.webview.onDidReceiveMessage((r) => {
            switch (r.type) {
              case "cancelBtn": {
                (s.event = "cancel"), (s.vexSettings = void 0), t.dispose();
                break;
              }
              case "browseBtn": {
                console.log("browse btn clicked");
                let a = {
                  defaultUri: ne.Uri.file(ne.env.appHost),
                  canSelectFolders: !0,
                  canSelectFiles: !1,
                  canSelectMany: !1,
                };
                ne.window.showOpenDialog(a).then((c) => {
                  if ((console.log(c[0]), c[0] === void 0)) {
                    console.log("undefined file uri");
                    return;
                  }
                  this._panel.webview.postMessage({
                    type: r.type,
                    path: c[0].fsPath,
                  });
                });
                break;
              }
              case "createProject": {
                console.log(r.simple_project_settings),
                  (s.event = "create"),
                  (s.vexSettings.project.name = r.simple_project_settings.name),
                  (s.vexSettings.project.description =
                    r.simple_project_settings.description),
                  (s.vexSettings.project.sdkVersion =
                    r.simple_project_settings.sdkVersion),
                  (s.projectPath = ne.Uri.joinPath(
                    ne.Uri.file(r.simple_project_settings.projectPath),
                    e.project.name,
                  ).fsPath),
                  (s.vexSettings.extension.version = i.Extension.version()),
                  (s.vexSettings.project.creationDate =
                    new Date().toUTCString()),
                  t.dispose();
                break;
              }
              case "getOSType": {
                this._panel.webview.postMessage({
                  type: r.type,
                  osType: Fs.type(),
                });
                break;
              }
              case "updateAndCheckFolderListAtPathFinal":
              case "updateAndCheckFolderListAtPath":
              case "updateFolderListAtPath": {
                if (!(0, Xs.existsSync)(r.path)) {
                  this._panel.webview.postMessage({ type: r.type, paths: [] });
                  break;
                }
                console.log("Updated Folder List", r),
                  ne.workspace.fs
                    .readDirectory(ne.Uri.file(r.path))
                    .then((n) => {
                      let a = [];
                      console.log("Folder List", n),
                        n.forEach((c) => {
                          c[1] === ne.FileType.Directory && a.push(c[0]);
                        }),
                        console.log("Folder String List", a),
                        this._panel.webview.postMessage({
                          type: r.type,
                          paths: a,
                        }),
                        console.log("Updated Folder List Finished ", r);
                    });
                break;
              }
              case "folderPath": {
                let n = ne.workspace
                  .getConfiguration()
                  .get(
                    i.Extension.Settings.projectHomeID,
                    ne.ConfigurationTarget.Global,
                  )
                  .toString();
                this._panel.webview.postMessage({ type: r.type, path: n });
              }
            }
          }),
          t.onDidDispose(() => {
            o = !0;
          });
        !o;

      )
        await new Promise((r) => setTimeout(r, 500));
      return (o = !1), (Xe._isRunning = !1), s;
    }
    static async _getHtmlForWebview(t, e) {
      let o = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "dist",
            "webviews",
            "views",
            "importProject.js",
          ),
        ),
        s = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "libs",
            "jquery",
            "jquery.js",
          ),
        ),
        r = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "reset.css",
          ),
        ),
        n = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "vscode.css",
          ),
        ),
        a = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "main.css",
          ),
        ),
        c = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.js",
          ),
        ),
        l = t.asWebviewUri(
          ne.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
          ),
        ),
        p = ne.Uri.file(
          ne.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.projectHomeID,
              ne.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        f = ne.Uri.file(
          ne.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.sdkCPPHomeID,
              ne.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        U = ne.Uri.file(
          ne.workspace
            .getConfiguration()
            .get(
              i.Extension.Settings.sdkPythonHomeID,
              ne.ConfigurationTarget.Global,
            )
            .toString(),
        ),
        P,
        x =
          e.project.platform === i.Platform.IQ2
            ? "IQ 2nd Generation"
            : e.project.platform;
      e.project.language === "python" &&
        (P = await i.Feedback_Extension.ResourceManager.getSDKVersions(
          e.project.platform,
          e.project.language,
          U,
        )),
        e.project.language === "cpp" &&
          (P = await i.Feedback_Extension.ResourceManager.getSDKVersions(
            e.project.platform,
            e.project.language,
            f,
          ));
      let $ = "";
      Xe._type === "Import" && ($ = "Import");
      let N = Ni(),
        F = "";
      return (
        Xe._showProjectPathBrowser &&
          (F = `
			<div>Location</div>
			<section class="project-path-row">
				<vscode-text-field id="projectHomePathInput" class="custom-textfield" placeHolder="Path to my project" value="${p.fsPath}"></vscode-text-field>
				<vscode-button id="browseProjectPathBtn" class="space-left"  appearance="secondary">Browse</vscode-button>
			</section>
			`),
        `<!DOCTYPE html>
			<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <!--
                        Use a content security policy to only allow loading images from https or from our extension directory,
                        and only allow scripts that have a specific nonce.
                    -->
					<!--
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${N}';">
					--> 
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

            
                    <link href="${r}" rel="stylesheet">
					<link href="${a}"  rel="stylesheet">
					<link href="${l}"     rel="stylesheet">
                    <script nonce="${N}" src="${s}"><\/script>
					<script nonce="${N}" type="module" src="${c}"><\/script>
                    <script nonce="${N}" src="${o}"><\/script>


                    <title>Import</title>
                </head>
                <body>
					<div id="mainForm" class="main-section noselect">
					<div id="popUpWindow" class="main-popup-window">
						<section  class="strectch-row">
							<h2 id="contentTitle" class="h2-title">VEX ${x} Project Import</h2>
							<section  class="strectch-row">
							</section>
							<vscode-button id="cancelBtn" appearance="icon" aria-label="Close">
								<i class="btnIcon codicon codicon-close"></i>
							</vscode-button>							
						</section>
						<div id="contentWindow"  class="component-container project-list">
						<section class="component-container">
						<div>Project Name</div>
						<vscode-text-field id="projectNameInput" class="custom-textfield" placeHolder="myProjectName" value="${e.project.name}"></vscode-text-field>
						<i id="projectName-infoText" > </i>
				
						</section>
						<section class="component-container"> 
							<div>Description</div>
							<vscode-text-area id="projectDescriptionInput" class="custom-textarea" placeHolder="Write your project description here . . ." value="${e.project.description}"></vscode-text-field>
					
						</section>
                        <section class="component-container">
						${F}
                        <div id="infoText-projecHomePath" ></div>
                        </section>						
                        </div>
						<section  class="strectch-column">
						</section>
						<section  class="button-row">
							<section  class="button-row">
								<vscode-button id="createBtn" class="createBtn" appearance="primary"  aria-label="Create">
									${$}
								</vscode-button>

							</section>
							<section  class="strectch-row">
							</section>

						</section>
					</div>
					</div>
				</body>
			</html>`
      );
    }
  },
  Nt = Xe;
(Nt.viewType = "project.createNew"),
  (Nt._type = "Import"),
  (Nt._isRunning = !1);
function Ni() {
  let y = "",
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let e = 0; e < 32; e++)
    y += t.charAt(Math.floor(Math.random() * t.length));
  return y;
}
var Ri = !1,
  Hs = new Map([
    ["280-7125", i.Platform.EXP],
    ["276-4810", i.Platform.V5],
    ["228-6480", i.Platform.IQ2],
  ]),
  $i = new Map([
    ["Windows_NT_x32", "toolchain_win32"],
    ["Windows_NT_x64", "toolchain_win32"],
    ["Darwin_x32", "toolchain_osx64"],
    ["Darwin_x64", "toolchain_osx64"],
    ["Darwin_arm64", "toolchain_osxarm64"],
    ["Linux_x32", "toolchain_linux64"],
    ["Linux_x64", "toolchain_linux64"],
  ]),
  V = class {
    constructor(t, e) {
      this._projectList = [];
      this._processEnv = {};
      (V._context = t), this.On("Log", e), V._logHandler("Starting");
    }
    async setup() {
      (this._isBuilding = !1),
        (this._cppIntellisenseTemplateUri = j.Uri.joinPath(
          V._context.extensionUri,
          "resources",
          "templates",
          "settings",
          "c_cpp_properties.json",
        )),
        (this._pythonIntellisenseTemplateUri = j.Uri.joinPath(
          V._context.extensionUri,
          "resources",
          "templates",
          "settings",
          "settings.json",
        )),
        this._setOSSpecificProps(),
        await this._setDefaultUserSettings(),
        console.log(V._context.extensionUri),
        this.checkToolchain();
      let t = j.workspace
        .getConfiguration()
        .get(i.Extension.Settings.projectHomeID, j.ConfigurationTarget.Global)
        .toString();
      V._logHandler(`Project Home Path: ${t}`),
        V._logHandler(`Toolchain Home:    ${this._cppToolchainHomeUri.fsPath}`),
        V._logHandler(`Toolchain Path:    ${this._cppToolchainUri.fsPath}`),
        V._logHandler(`Sdk CPP    Home:   ${this._cppSdkHomeUri.fsPath}`),
        V._logHandler(`Sdk Python Home:   ${this._pythonSdkHomeUri.fsPath}`),
        await this.searchForProjectsInWorkspace(),
        V._context.subscriptions.push(
          j.workspace.onDidChangeWorkspaceFolders((e) => {
            this._folderChange(e);
          }),
        );
    }
    static getErrorMessageFromCode(t) {
      return V.buildErrorCodesDetails.get(t);
    }
    async build() {
      return (this._currentAction = "Build"), this._runMake();
    }
    async clean() {
      return (this._currentAction = "Clean"), this._runMake();
    }
    async rebuild() {
      let t = await this.clean();
      return t !== 0 || ((t = await this.build()), console.log(t)), t;
    }
    async newProject() {
      return (
        V._logHandler("New Project"),
        go.Show(V._context.extensionUri).then(async (t) => {
          switch ((console.log("New Project Response", t), t.event)) {
            case "cancel":
            case "disposed":
              console.log("Create Project Canceled", t),
                new Error("Create Project Canceled");
              break;
            case "isRunning":
              return "Create Project is Open Already";
            case "create":
              console.log("Create Project On Create", t),
                V._logHandler(`Template Zip:        ${t.zipName}`),
                V._logHandler(`New Project Path: ${t.projectPath}`),
                V._logHandler(
                  `Project Settings: ${JSON.stringify(t.vexSettings)}`,
                );
              let e = j.Uri.joinPath(
                  j.Uri.file(t.projectPath),
                  t.vexSettings.project.name,
                ),
                o = j.Uri.joinPath(
                  V._context.extensionUri,
                  "resources",
                  "templates",
                  "projects",
                  t.vexSettings.project.platform,
                  t.zipName,
                ),
                s;
              be.existsSync(e.fsPath) ||
                (await j.workspace.fs.createDirectory(e)),
                await i.Utils.unzipFile(o, e);
              let r = "";
              switch (t.vexSettings.project.language) {
                case "python":
                  (s = JSON.parse(
                    (
                      await i.Feedback_Extension.ResourceManager.getSDKVersions(
                        t.vexSettings.project.platform,
                        t.vexSettings.project.language,
                        this._pythonSdkHomeUri,
                      )
                    ).json,
                  )),
                    (r = "py");
                  break;
                case "cpp":
                  (s = JSON.parse(
                    (
                      await i.Feedback_Extension.ResourceManager.getSDKVersions(
                        t.vexSettings.project.platform,
                        t.vexSettings.project.language,
                        this._cppSdkHomeUri,
                      )
                    ).json,
                  )),
                    (r = "cpp");
                  let l = (await j.workspace.fs.readDirectory(e)).filter(
                    (f) => f[1] === j.FileType.File && f[0].includes(".v5code"),
                  );
                  l.length &&
                    (await j.workspace.fs.delete(j.Uri.joinPath(e, l[0][0])));
                  let p = this.getMakeEnvFile(e);
                  if (p < "2022_06_26_01" || p === "") {
                    let f = j.Uri.joinPath(e, "vex", "mkenv.mk");
                    await j.workspace.fs.delete(f, {
                      recursive: !1,
                      useTrash: !1,
                    });
                    let U = j.Uri.joinPath(
                      V._context.extensionUri,
                      "resources",
                      "templates",
                      "mk",
                      t.vexSettings.project.platform,
                      "mkenv_2022_06_26_01.mk",
                    );
                    await j.workspace.fs.copy(U, f, { overwrite: !0 });
                  }
                  break;
              }
              s?.online?.latest !== ""
                ? (t.vexSettings.project.sdkVersion = s?.online?.latest)
                : (t.vexSettings.project.sdkVersion = s?.local?.latest);
              let n = j.Uri.joinPath(e, "src", `main.${r}`),
                a = be.readFileSync(n.fsPath, "utf8");
              be.writeFileSync(
                n.fsPath,
                this._expandCommentHeaderData(a, n, t.vexSettings),
              ),
                await Ct.writeProjectSettings(t.vexSettings, e),
                await this._createOrModifyGitIgnoreFile(e, t.vexSettings),
                await this._downloadSdkIfNotLocal(t.vexSettings),
                j.commands.executeCommand("vscode.openFolder", e);
              break;
          }
        })
      );
    }
    async importProject() {
      if (Nt.isRunning) {
        await Nt.Show(V._context.extensionUri, void 0);
        return;
      }
      let t = j.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.projectHomeID,
            j.ConfigurationTarget.Global,
          ),
        e = j.Uri.file(t.toString()),
        o = {
          title: "Import Project",
          defaultUri: e,
          canSelectFolders: !1,
          canSelectFiles: !0,
          canSelectMany: !1,
          filters: { vexcode: V.importExtensions },
        },
        s = await j.window.showOpenDialog(o);
      if ((console.log(s), !s?.length)) return "No File Selected";
      let r = s[0],
        n = j.Uri.file(qe.dirname(r.fsPath)),
        a = qe.basename(r.fsPath).split(".")[1];
      if (!be.existsSync(r.fsPath))
        throw new Error("Project file does not exist");
      if (a === "zip") {
        let x = qe.basename(r.fsPath, ".zip"),
          $ = j.Uri.joinPath(V._context.extensionUri, "temp", x);
        await i.Utils.unzipFile(r, $),
          (await j.workspace.fs.readDirectory($)).forEach((N) => {
            if (N[1] === j.FileType.File) {
              let F = N[0].split(".")[1],
                k = N[0] === "zip";
              V.importExtensions.includes(F) &&
                !k &&
                ((r = j.Uri.joinPath($, N[0])), (a = F));
            }
          });
      }
      let c = [void 0, ""],
        l = !1,
        p = !0;
      switch (a) {
        case "v5code":
          (c[0] = this._v5code2ProjectSettings(r)), (c[1] = ""), (p = !1);
          break;
        case "v5cpp":
          c = this._v5cppToProjectSettings(r);
          break;
        case "v5python":
          c = this._v5pythonToProjectSettings(r);
          break;
        case "iqcpp":
          c = this._iq2cppToProjectSettings(r);
          break;
        case "iqpython":
          c = this._iq2pythonToProjectSettings(r);
          break;
        case "expcpp":
          c = this._expcppToProjectSettings(r);
          break;
        case "exppython":
          c = this._exppythonToProjectSettings(r);
          break;
        default:
          throw new Error(`Project ${qe.basename(r.fsPath)}, not supported! `);
      }
      let f = await Nt.Show(V._context.extensionUri, c[0], p);
      if (f.event !== "create") return f.event;
      let U = j.Uri.file(qe.dirname(r.fsPath)),
        P = j.Uri.file(f.projectPath);
      if (a.includes("code")) {
        let x = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getSDKVersions(
              f.vexSettings.project.platform,
              f.vexSettings.project.language,
              this._cppSdkHomeUri,
            )
          ).json,
        );
        x.online.latest !== ""
          ? (f.vexSettings.project.sdkVersion = x.online.latest)
          : (f.vexSettings.project.sdkVersion = x.local.latest),
          (P = U);
        let $ = this.getMakeEnvFile(P);
        if ($ < "2022_06_26_01" || $ === "") {
          let F = j.Uri.joinPath(P, "vex", "mkenv.mk");
          await j.workspace.fs.delete(F, { recursive: !1, useTrash: !1 });
          let k = j.Uri.joinPath(
            V._context.extensionUri,
            "resources",
            "templates",
            "mk",
            f.vexSettings.project.platform,
            "mkenv_2022_06_26_01.mk",
          );
          await j.workspace.fs.copy(k, F, { overwrite: !0 });
        }
        (await j.workspace.fs.readDirectory(P)).forEach((F) => {
          F[1] === j.FileType.File &&
            F[0].includes("compile_commands.json") &&
            be.rmSync(j.Uri.joinPath(P, F[0]).fsPath, { force: !0 }),
            F[1] === j.FileType.Directory &&
              F[0].includes("build") &&
              be.rmSync(j.Uri.joinPath(P, F[0]).fsPath, {
                recursive: !0,
                force: !0,
              });
        });
      } else if (a.includes("python")) {
        let x = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getSDKVersions(
              f.vexSettings.project.platform,
              f.vexSettings.project.language,
              this._pythonSdkHomeUri,
            )
          ).json,
        );
        x.online.latest !== ""
          ? (f.vexSettings.project.sdkVersion = x.online.latest)
          : (f.vexSettings.project.sdkVersion = x.local.latest);
        let $ = j.Uri.joinPath(
          V._context.extensionUri,
          "resources",
          "templates",
          "projects",
          f.vexSettings.project.platform,
          `py_${f.vexSettings.project.platform.toLowerCase()}_vsc_empty.zip`,
        );
        console.log("Unzip Result: ", await i.Utils.unzipFile($, P));
        let N = j.Uri.joinPath(j.Uri.file(f.projectPath), "src", "main.py");
        await j.workspace.fs.delete(N),
          await j.workspace.fs.writeFile(N, new Qe.TextEncoder().encode(c[1]));
      } else if (a.includes("cpp")) {
        V._logHandler("Get SDK Info");
        let x = JSON.parse(
          (
            await i.Feedback_Extension.ResourceManager.getSDKVersions(
              f.vexSettings.project.platform,
              f.vexSettings.project.language,
              this._cppSdkHomeUri,
            )
          ).json,
        );
        x.online.latest !== ""
          ? (f.vexSettings.project.sdkVersion = x.online.latest)
          : (f.vexSettings.project.sdkVersion = x.local.latest),
          V._logHandler("Unzip empty project");
        let $ = j.Uri.joinPath(
          V._context.extensionUri,
          "resources",
          "templates",
          "projects",
          f.vexSettings.project.platform,
          `cpp_${f.vexSettings.project.platform.toLowerCase()}_vsc_empty.zip`,
        );
        await i.Utils.unzipFile($, P),
          V._logHandler("Delete template main.cpp");
        let N = j.Uri.joinPath(j.Uri.file(f.projectPath), "src", "main.cpp");
        await j.workspace.fs.delete(N),
          V._logHandler("Write project text content to main.cpp"),
          await j.workspace.fs.writeFile(N, new Qe.TextEncoder().encode(c[1]));
      }
      await Ct.writeProjectSettings(f.vexSettings, P),
        await this._createOrModifyGitIgnoreFile(P, f.vexSettings),
        await this._downloadSdkIfNotLocal(f.vexSettings),
        await j.commands.executeCommand("vscode.openFolder", P);
    }
    async showSettingsUI() {
      if (!this._selectedProject) throw new Error("No Project Selected");
      let t = this._selectedProject.lastProjectSettingsWrite;
      try {
        this._selectedProject.readProjectSettings();
      } catch (n) {
        V._logHandler(
          `Invalid Project Settings: Project ${this._selectedProject.name} @ ${this._selectedProject.settingsFileUri.fsPath}`,
        ),
          V._logHandler(`Error: ${n.message}`),
          V._logHandler(""),
          V._logHandler("Trying to recreate . . . "),
          j.window.showWarningMessage(
            `Invalid Project Settings: Project ${this._selectedProject.name}, Recovering Settings`,
          );
      }
      let e = await pt.Show(V._context.extensionUri, t);
      if (e.event !== "save") return;
      let o = this.getSDKHomeUriFromLanguage(e.vexSettings.project.language);
      if (!o)
        throw new Error(`Invalid Language: ${e.vexSettings.project.language}`);
      let s = await i.Feedback_Extension.ResourceManager.getSDKVersions(
        e.vexSettings.project.platform,
        e.vexSettings.project.language,
        o,
      );
      JSON.parse(s.json).local.catalog.includes(
        e.vexSettings.project.sdkVersion,
      ) ||
        (await i.Feedback_Extension.ResourceManager.downloadSDK(
          e.vexSettings.project.platform,
          e.vexSettings.project.language,
          e.vexSettings.project.sdkVersion,
          o,
        )),
        await this._selectedProject.writeProjectSettings(e.vexSettings),
        this._updateProjectIntellesense(this._selectedProject);
    }
    On(t, e) {
      switch (t) {
        case "Build-Data":
          this._buildDataCB = e;
          break;
        case "Build-Errors":
          this._buildErrorCB = e;
          break;
        case "Build-Exit":
          this._buildExitCB = e;
          break;
        case "Log":
          V._logCB = e;
          break;
      }
    }
    get projectList() {
      return this._projectList;
    }
    get selectedProject() {
      return this._selectedProject;
    }
    set selectedProject(t) {
      this.projectList.includes(t) &&
        (j.commands
          .executeCommand(
            "setContext",
            `${i.Extension.id}.vexProjectSettingsFolderArr`,
            [],
          )
          .then(() => {
            j.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexProjectSettingsFolderArr`,
              [this._selectedProject.settingsFileUri],
            );
          }),
        V._logHandler(`Selected Project: ${t.name}`),
        (this._selectedProject = t),
        this._updateProjectIntellesense(this._selectedProject));
    }
    get isBuilding() {
      return this._isBuilding;
    }
    getMakeEnvFile(t) {
      let e = j.Uri.joinPath(t, "vex", "mkenv.mk"),
        o = new Qe.TextDecoder().decode(be.readFileSync(e.fsPath)),
        s = new RegExp(/(?<=\s*VEXcode\s*mkenv.mk\s*)\d{4}_\d{2}_\d{2}_\d{2}/);
      return s.test(o) ? s.exec(o)[0] : "";
    }
    async checkCppSdk(t) {
      V._logHandler("Checking for latest SDK-------------");
      let e = t.readProjectSettings(),
        o = await i.Feedback_Extension.ResourceManager.getSDKVersions(
          e.project.platform,
          e.project.language,
          this._cppSdkHomeUri,
        );
      V._logHandler("SDK Versions Recieved");
      let s = JSON.parse(o.json),
        r = s.online.latest !== "",
        n = s.local.latest !== "";
      s.online.catalog.forEach((f) => {
        V._logHandler(`Online SDK: ${f}`);
      }),
        s.local.catalog.forEach((f) => {
          V._logHandler(`Local SDK : ${f}`);
        });
      let a = "";
      if (r || n)
        if (e.project.sdkVersion === "")
          a = `Project ${t.name}: No SDK selected in project settings, would you like change the project settings?`;
        else {
          if (
            !s.local.catalog.includes(e.project.sdkVersion) &&
            e.project.sdkVersion === s.online.latest &&
            r
          )
            return (
              (a = `Project ${t.name}: SDK ${e.project.sdkVersion} does not exist, Downloading SDK ${s.online.latest} `),
              V._logHandler(`SDK Check Result: ${a}`),
              await this._downloadSdkIfNotLocal(t.readProjectSettings()),
              a
            );
          if (
            !s.local.catalog.includes(s.online.latest) &&
            r &&
            s.local.latest < e.project.sdkVersion
          )
            a = `Project ${t.name}: New SDK ${s.online.latest} available online, would you like to update project settings?`;
          else if (s.local.latest > e.project.sdkVersion)
            a = `Project ${t.name}: New SDK ${s.local.latest} available locally, would you like to update project settings?`;
          else if (!s.local.catalog.includes(e.project.sdkVersion) && r)
            a = `Project ${t.name}: SDK ${e.project.sdkVersion} does not exist, New SDK ${s.online.latest} available online, would you like to update project settings?`;
          else if (!s.local.catalog.includes(e.project.sdkVersion) && !r)
            a = `Project ${t.name}: SDK ${e.project.sdkVersion} does not exist, New SDK ${s.local.latest} available locally, would you like to update project settings?`;
          else
            return (
              V._logHandler(
                `SDK Found @: ${this._cppSdkHomeUri.fsPath} ver:${e.project.sdkVersion}`,
              ),
              V._logHandler("SDK - Up To Date"),
              "SDK up to date"
            );
        }
      else
        throw new Error(
          "No Internet connection and no sdk availiable at current home directory",
        );
      V._logHandler(`SDK Check Result: ${a}`);
      let c = await j.window.showInformationMessage(a, "Settings", "Cancel");
      switch ((V._logHandler(`Project Settings Popup Click: ${c}`), c)) {
        case "Settings":
          break;
        case "Cancel":
          throw new Error("Cancel Clicked");
        case void 0:
          throw new Error("Cancel Clicked or Timedout");
        default:
          break;
      }
      let l = await pt.Show(V._context.extensionUri, e),
        p = l.vexSettings;
      switch (l.event) {
        case "isRunning":
          throw new Error("Create Project is Open Already");
        case "cancel":
        case "disposed":
          throw new Error("Cancel Clicked");
        case "create":
          await t.writeProjectSettings(p), await this._downloadSdkIfNotLocal(p);
          break;
      }
    }
    async _createOrModifyGitIgnoreFile(t, e) {
      let s = (await j.workspace.fs.readDirectory(t)).filter(
        (r) => r[0].includes(".gitignore") && r[1] === j.FileType.File,
      );
      if (s.length) {
        console.log(s[0]);
        let r = j.Uri.joinPath(t, s[0][0]),
          n = be.readFileSync(r.fsPath),
          a = new Qe.TextDecoder().decode(n),
          c = new RegExp(/(\\|\/|\s*|).vscode\s*/gi);
        c.test(a) &&
          (console.log(c.exec(a)),
          (a = a.replace(c, "")),
          be.writeFileSync(r.fsPath, a, { encoding: "utf-8" }));
      } else {
        let r = j.Uri.joinPath(t, ".gitignore"),
          n = "";
        e.project.language === i.Language.cpp &&
          ((n += `/bin
`),
          (n += `/build
`),
          (n += `compile_commands.json
`)),
          be.writeFileSync(r.fsPath, n, { encoding: "utf-8" });
      }
    }
    async _updateProjectIntellesense(t) {
      switch (t.language) {
        case "python":
          await t.updateIntellesenseJSON(this._pythonIntellisenseTemplateUri);
          break;
        case "cpp":
          await t.updateIntellesenseJSON(this._cppIntellisenseTemplateUri);
          break;
      }
    }
    async _downloadSdkIfNotLocal(t) {
      let e = this.getSDKHomeUriFromLanguage(t.project.language);
      if (!e) throw new Error(`Invalid Language: ${t.project.language}`);
      let o = await i.Feedback_Extension.ResourceManager.getSDKVersions(
        t.project.platform,
        t.project.language,
        e,
      );
      if (JSON.parse(o.json).local?.catalog.includes(t.project.sdkVersion))
        V._logHandler("No SDK Found");
      else {
        let r = await i.Feedback_Extension.ResourceManager.downloadSDK(
          t.project.platform,
          t.project.language,
          t.project.sdkVersion,
          e,
        );
        r.statusCode === 200
          ? V._logHandler("Download SDK Finish")
          : V._logHandler(
              `Download Error - StatusCode:${r.statusCode} Details:${r.details}`,
            );
      }
    }
    async checkPythonSdk(t) {
      V._logHandler("Checking for latest Stubs-------------");
      let e = t.readProjectSettings(),
        o = await i.Feedback_Extension.ResourceManager.getSDKVersions(
          e.project.platform,
          e.project.language,
          this._pythonSdkHomeUri,
        );
      V._logHandler("Stubs Versions Recieved");
      let s = JSON.parse(o.json),
        r = s.online.latest !== "",
        n = s.local.latest !== "";
      s.online.catalog.forEach((U) => {
        V._logHandler(`Online Stubs: ${U}`);
      }),
        s.local.catalog.forEach((U) => {
          V._logHandler(`Local Stubs : ${U}`);
        });
      let a = "",
        c = s.online.latest.split("_").slice(0, 5).join("_");
      if (r || n)
        if (e.project.sdkVersion === "")
          a = `Project ${t.name}: No Stubs selected in project settings, would you like project settings?`;
        else {
          if (
            !s.local.catalog.includes(e.project.sdkVersion) &&
            e.project.sdkVersion === s.online.latest &&
            r
          )
            return (
              (a = `Project ${t.name}: Sdk ${e.project.sdkVersion} does not exist, Downloading SDK ${s.online.latest} `),
              V._logHandler(`SDK Check Result: ${a}`),
              await this._downloadSdkIfNotLocal(t.readProjectSettings()),
              a
            );
          if (
            !s.local.catalog.includes(c) &&
            r &&
            s.local.latest < e.project.sdkVersion
          )
            a = `Project ${t.name}: New Sdk ${c} available online, would you like to update project settings?`;
          else if (s.local.latest > e.project.sdkVersion)
            a = `Project ${t.name}: New Sdk ${s.local.latest} available locally, would you like to update project settings?`;
          else if (!s.local.catalog.includes(c) && r)
            a = `Project ${t.name}: Sdk ${e.project.sdkVersion} does not exist, New SDK ${c} available online, would you like to update project settings?`;
          else if (!s.local.catalog.includes(e.project.sdkVersion) && !r)
            a = `Project ${t.name}: Sdk ${e.project.sdkVersion} does not exist, New SDK ${s.local.latest} available locally, would you like to update project settings?`;
          else
            return (
              V._logHandler(
                `Stubs Found @: ${this._pythonSdkHomeUri.fsPath} ver:${e.project.sdkVersion}`,
              ),
              V._logHandler("Stubs - Up To Date"),
              "SDK up to date"
            );
        }
      else
        throw new Error(
          "No Internet connection and no Stubs availiable at current home directory",
        );
      V._logHandler(`SDK Check Result: ${a}`);
      let l = await j.window.showInformationMessage(a, "Settings", "Cancel");
      switch ((V._logHandler(`Project Settings Popup Click: ${l}`), l)) {
        case "Settings":
          break;
        case "Cancel":
          throw new Error("Cancel Clicked");
        case void 0:
          throw new Error("Cancel Clicked or Timedout");
        default:
          break;
      }
      let p = await pt.Show(V._context.extensionUri, e),
        f = p.vexSettings;
      switch (p.event) {
        case "isRunning":
          throw new Error("Create Project is Open Already");
        case "cancel":
        case "disposed":
          throw new Error("Cancel Clicked");
        case "create":
          await t.writeProjectSettings(f);
          break;
      }
      if (!s.local.catalog.includes(f.project.sdkVersion))
        if (
          (V._logHandler("Downloading Stubs"),
          (o = await i.Feedback_Extension.ResourceManager.downloadSDK(
            f.project.platform,
            f.project.language,
            f.project.sdkVersion,
            this._pythonSdkHomeUri,
          )),
          o.statusCode === 0)
        )
          V._logHandler("Download Stubs Finish");
        else
          throw new Error(
            `Download Error - StatusCode:${o.statusCode} Details:${o.details}`,
          );
    }
    async checkToolchain(t = !1) {
      if (
        (V._logHandler("Checking if toolchain exist-------------"),
        !be.existsSync(this._cppToolchainUri.fsPath) || t)
      ) {
        V._logHandler(`Toolchain Not Found @: ${this._cppToolchainUri.fsPath}`),
          V._logHandler(
            `Download Toolchain @: ${this._cppToolchainUri.fsPath}`,
          );
        let e = await i.Feedback_Extension.ResourceManager.downloadToolchain(
          this._cppToolchainHomeUri,
        );
        return V._logHandler(`Download Toolchain Finish: ${e.statusCode}`), e;
      } else
        V._logHandler(`Toolchain Found @: ${this._cppToolchainUri.fsPath}`);
    }
    async _runMake() {
      V._logHandler(`${this._selectedProject.name}: Save All`),
        await j.workspace.saveAll(),
        this._selectedProject.updateProjectSettings();
      let t = this._getBuildArgs(),
        e = this._setUpBuildEnv();
      if (((this._isBuilding = !0), e !== 0)) {
        let s = `${V.buildErrorCodesDetails.get(e)} - ErrorCode: ${e}`,
          r = `${V.buildErrorCodesDetails.get(e)}`;
        throw (
          (this._buildErrorHandler(e, s),
          this._buildExitHandler(e),
          (this._isBuilding = !1),
          new Error(r))
        );
      }
      Ri &&
        (this._buildDataHandler(`\r
Build Args`),
        this._buildDataHandler(""),
        this._buildDataHandler(`OS:           ${Je.type()}`),
        this._buildDataHandler(`Project Name: ${this.selectedProject.name}`),
        this._buildDataHandler(
          `Project Path: ${this.selectedProject.projectUri.fsPath}`,
        ),
        this._buildDataHandler(`SDK:          ${this._cppSdkPathUri.fsPath}`),
        this._buildDataHandler(`Toochain:     ${this._cppToolchainUri.fsPath}`),
        this._buildDataHandler(`Make:         ${this._makeUri.fsPath}`),
        this._buildDataHandler(`GCC:          ${this._gccUri.fsPath}`),
        this._buildDataHandler(`Clang:        ${this._clangUri.fsPath}`),
        this._buildDataHandler(`CWD:          ${this._envOptions.cwd}`),
        this._buildDataHandler(`Build Args:   ${t}`),
        this._buildDataHandler("")),
        V._logHandler(
          `${this._selectedProject.name}: Build Type: ${this._currentAction}`,
        ),
        V._logHandler(`${this._selectedProject.name}: Spawning Make Process`);
      let o = Ws.spawn(this._makeUri.fsPath, t, {
        shell: !1,
        env: this._envOptions.env,
        cwd: this._envOptions.cwd,
      });
      for (
        console.log("Process Started"),
          o.stdout.on("data", (s) => {
            this._buildDataHandler(s);
          }),
          o.stderr.on("data", (s) => {
            this._buildErrorHandler(V.BuildErrorCodes.COMPILER_ERROR, s);
          }),
          o.on("exit", (s) => {
            this._buildExitHandler(s);
          });
        o.exitCode === null;

      )
        console.log(o.exitCode), await new Promise((s) => setTimeout(s, 500));
      return (
        (this._isBuilding = !1),
        console.log(`EXIT CODE: ${o.exitCode}`),
        V._logHandler(
          `${this._selectedProject.name}: Make Process EXIT CODE: ${o.exitCode}`,
        ),
        o.exitCode
      );
    }
    _setUpBuildEnv() {
      if (!this._selectedProject) return V.BuildErrorCodes.NO_PROJECT_SELECTED;
      V._logHandler(`${this._selectedProject.name}: Setup Build Env`);
      let t = this._selectedProject.readProjectSettings(),
        e = qe.delimiter;
      if (
        ((this._makeUri = j.Uri.joinPath(
          this._cppToolchainUri,
          "tools",
          "bin",
          this._makeName,
        )),
        (this._gccUri = j.Uri.joinPath(this._cppToolchainUri, "gcc", "bin")),
        (this._clangUri = j.Uri.joinPath(
          this._cppToolchainUri,
          "clang",
          "bin",
        )),
        (this._cppSdkPathUri = j.Uri.joinPath(
          this._cppSdkHomeUri,
          t.project.platform,
          t.project.sdkVersion,
        )),
        this._isBuilding)
      )
        return V.BuildErrorCodes.BUILD_ACTION_IN_PROCESS;
      if (!j.workspace.workspaceFolders.length)
        return V.BuildErrorCodes.NO_WORKSPACE_OPEN;
      if (!this._selectedProject.projectUri)
        return V.BuildErrorCodes.NOT_DEFINED_PROJECT;
      if (!be.existsSync(this._selectedProject.projectUri.fsPath))
        return (
          console.log(this._selectedProject.projectUri.fsPath),
          V.BuildErrorCodes.PROJECT_PATH_DOES_NOT_EXIST
        );
      if (
        (V._logHandler(
          `${this._selectedProject.name}: Project Path: ${this._selectedProject.projectUri.fsPath}`,
        ),
        !this._cppToolchainUri)
      )
        return V.BuildErrorCodes.NOT_DEFINED_TOOLCHAIN;
      if (!be.existsSync(this._cppToolchainHomeUri.fsPath))
        return V.BuildErrorCodes.TOOLCHAIN_DOES_NOT_EXIST;
      if (
        (V._logHandler(
          `${this._selectedProject.name}: Toolchain Path: ${this._cppToolchainHomeUri.fsPath}`,
        ),
        (!this._cppSdkPathUri && t.project.language === "cpp") ||
          t.project.sdkVersion === "")
      )
        return V.BuildErrorCodes.NOT_DEFINED_SDK;
      if (
        !be.existsSync(this._cppSdkPathUri.fsPath) &&
        t.project.language === "cpp"
      )
        return V.BuildErrorCodes.MISSING_SDK;
      if (
        (V._logHandler(
          `${this.selectedProject.name}: SDK NAME: ${t.project.sdkVersion} SDK Path: ${this._cppSdkPathUri.fsPath}`,
        ),
        !be.existsSync(this._makeUri.fsPath))
      )
        return V.BuildErrorCodes.MAKE_DOES_NOT_EXIST;
      V._logHandler(
        `${this._selectedProject.name}: Make Path: ${this._makeUri.fsPath}`,
      ),
        (this._processEnv.PATH = "");
      let o = new RegExp(/\$\{\s*workspaceFolder\s*\}/),
        s = new RegExp(/\$\{\s*workspaceFolderBasename\s*\}/),
        r = new RegExp(/\$\{\s*userHome\s*\}/),
        n = new RegExp(/\$\{\s*pathSeparator\s*\}/);
      return (
        this._selectedProject?.includeEnvUris?.length &&
          this._selectedProject.includeEnvUris.forEach((a) => {
            let c = a;
            o.test(c) &&
              (c = c.replace(o, this._selectedProject.projectUri.fsPath)),
              s.test(c) &&
                (c = c.replace(
                  s,
                  qe.basename(this._selectedProject.projectUri.fsPath),
                )),
              r.test(c) && (c = c.replace(r, this._userHomeUri.fsPath)),
              n.test(c) && (c = c.replace(n, this._pathSeparator)),
              (this._processEnv.PATH += c + e);
          }),
        (this._processEnv.PATH += this._cppSdkPathUri.fsPath + e),
        (this._processEnv.PATH += this._gccUri.fsPath + e),
        (this._processEnv.PATH += this._clangUri.fsPath + e),
        (this._processEnv.PATH += process.env.PATH),
        (this._envOptions = {
          cwd: this._selectedProject.projectUri.fsPath,
          env: this._processEnv,
        }),
        V._logHandler(
          `${this._selectedProject.name}: EnvOptions: ${JSON.stringify(this._envOptions)}`,
        ),
        V.BuildErrorCodes.NO_ERROR
      );
    }
    _getBuildArgs() {
      let t = this._selectedProject.readProjectSettings().project,
        e = [];
      switch (this._currentAction) {
        case "Build":
          (e = [
            `P=${this._selectedProject.name.replace(" ", "_")}`,
            `T=${j.Uri.joinPath(this._cppSdkHomeUri, t.platform, t.sdkVersion).fsPath}`,
            `OS=${Je.type()}`,
          ]),
            t?.cpp?.printf_float && e.push("PRINTF_FLOAT=1");
          break;
        case "Clean":
          (e = [
            "clean",
            `P=${this._selectedProject.name.replace(" ", "_")}`,
            `T=${j.Uri.joinPath(this._cppSdkHomeUri, t.platform, t.sdkVersion).fsPath}`,
            `OS=${Je.type()}`,
          ]),
            t?.cpp?.printf_float && e.push("PRINTF_FLOAT=1");
          break;
        case "Rebuild":
          break;
      }
      return (
        V._logHandler(`${this._selectedProject.name}: Build Args: ${e}`), e
      );
    }
    getSDKHomeUriFromLanguage(t) {
      let e;
      switch (t) {
        case "cpp":
          e = this._cppSdkHomeUri;
          break;
        case "python":
          e = this._pythonSdkHomeUri;
          break;
        default:
      }
      return e;
    }
    _setOSSpecificProps() {
      let t = new Qe.TextDecoder();
      Je.type() === "Windows_NT"
        ? ((this._osEndLine = t.decode(new Uint8Array([13, 10]).buffer)),
          (this._makeName = "make.exe"),
          (this._compilerName = "clang.exe"),
          (this._userHomeUri = j.Uri.file(process.env.USERPROFILE)),
          (this._pathSeparator = "\\"))
        : Je.type() === "Darwin"
          ? ((this._osEndLine = t.decode(new Uint8Array([13]).buffer)),
            (this._makeName = "make"),
            (this._compilerName = "clang"),
            (this._userHomeUri = j.Uri.file(process.env.HOME)),
            (this._pathSeparator = "/"))
          : (console.log(
              V._classType,
              new Error(`OS Not Recongnized: ${Je.type()}`),
            ),
            V._logHandler(`OS Not Supported: ${Je.type()}`),
            (this._osEndLine = t.decode(new Uint8Array([13]).buffer)),
            (this._makeName = "make"),
            (this._compilerName = "clang"),
            (this._userHomeUri = j.Uri.file(process.env.HOME)),
            (this._pathSeparator = "/")),
        V._logHandler(`Platform: ${Je.type()}`),
        V._logHandler(`Arch: ${Je.arch()}`),
        V._logHandler(
          `OS Endline: ${new Qe.TextEncoder().encode(this._osEndLine)}`,
        ),
        V._logHandler(`Make  Type: ${this._makeName}`),
        V._logHandler(`Clang Type: ${this._compilerName}`);
    }
    async _setDefaultUserSettings() {
      V._logHandler("Setting Default User Settings");
      let t,
        e = j.workspace
          .getConfiguration()
          .get(i.Extension.Settings.projectHomeID, j.ConfigurationTarget.Global)
          .toString();
      console.log(V._classType, "Home Configuration", `${e}`),
        Je.type() === "Darwin"
          ? (this._userName = process.env.USER)
          : Je.type() === "Linux"
            ? (this._userName = process.env.USER)
            : (this._userName = process.env.USERNAME),
        e === "" &&
          (V._logHandler("Project Global Home Path Not Set"),
          Je.type() === "Windows_NT"
            ? (t = j.Uri.joinPath(
                j.Uri.file(process.env.USERPROFILE),
                "Documents",
                "vex-vscode-projects",
              ))
            : Je.type() === "Darwin"
              ? (t = j.Uri.joinPath(
                  j.Uri.file(process.env.HOME),
                  "Documents",
                  "vex-vscode-projects",
                ))
              : Je.type() === "Linux" &&
                (t = j.Uri.joinPath(
                  j.Uri.file(process.env.HOME),
                  "Documents",
                  "vex-vscode-projects",
                )),
          console.log("OS Home URI", t),
          (e = t.fsPath),
          await j.workspace
            .getConfiguration()
            .update(
              i.Extension.Settings.projectHomeID,
              t.fsPath,
              j.ConfigurationTarget.Global,
            ),
          be.existsSync(t.path) || (await j.workspace.fs.createDirectory(t)));
      let o = `${Je.type()}_${Je.arch()}` ? `${Je.type()}_${Je.arch()}` : "";
      (this._cppToolchainHomeUri = j.Uri.joinPath(
        V._context.globalStorageUri,
        "tools",
        "cpp",
      )),
        (this._cppToolchainUri = j.Uri.joinPath(
          this._cppToolchainHomeUri,
          $i.get(o),
        )),
        await j.workspace
          .getConfiguration()
          .update(
            i.Extension.Settings.toolchainCPPPathID,
            this._cppToolchainUri.fsPath,
            j.ConfigurationTarget.Global,
          ),
        (this._cppSdkHomeUri = j.Uri.joinPath(
          V._context.globalStorageUri,
          "sdk",
          "cpp",
        )),
        await j.workspace
          .getConfiguration()
          .update(
            i.Extension.Settings.sdkCPPHomeID,
            this._cppSdkHomeUri.fsPath,
            j.ConfigurationTarget.Global,
          ),
        be.existsSync(this._cppSdkHomeUri.fsPath) ||
          (await j.workspace.fs.createDirectory(this._cppSdkHomeUri)),
        (this._pythonSdkHomeUri = j.Uri.joinPath(
          V._context.globalStorageUri,
          "sdk",
          "python",
        )),
        await j.workspace
          .getConfiguration()
          .update(
            i.Extension.Settings.sdkPythonHomeID,
            this._pythonSdkHomeUri.fsPath,
            j.ConfigurationTarget.Global,
          ),
        be.existsSync(this._pythonSdkHomeUri.fsPath) ||
          (await j.workspace.fs.createDirectory(this._pythonSdkHomeUri));
    }
    _expandCommentHeaderData(t, e, o) {
      let s = (f, U) => {
          let P = U.length + (U.length - f.length);
          if (f === "") return U;
          let x = U.length > f.length ? f.padEnd(P, " ") : f;
          return console.log("padHelper", x, U.length > f.length), x;
        },
        r = qe.basename(e.fsPath),
        n = s(r, "{file}"),
        a = "{file}                ".slice(0, n.length);
      (t = t.replace(a, n)), (n = s(o.project.creationDate, "{date}"));
      let c = "{date}                ".slice(0, n.length);
      (t = t.replace(c, n)), (n = s(this._userName, "{author}"));
      let l = "{author}                                    ".slice(0, n.length);
      (t = t.replace(l, n)),
        (n = s(`${o.project.platform} project`, "{description}"));
      let p = "{description}                ".slice(0, n.length);
      return (t = t.replace(p, n)), t;
    }
    _v5code2ProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e)),
        s = Hs.get(o.device.uid) ? o.device.uid : void 0,
        r = qe.dirname(t.fsPath),
        n = j.Uri.file(r),
        a = j.Uri.joinPath(n, "vex", "mkenv.mk"),
        c = new Qe.TextDecoder().decode(be.readFileSync(a.fsPath)),
        l = new RegExp(/(?<=PLATFORM\s*=\s*vex)(exp|v5|iq2)/),
        p = i.Platform.V5;
      l.test(c)
        ? (p = l.exec(c)[0].toUpperCase())
        : s && (p = Hs.get(o.device.uid));
      let f = {
        project: {
          name: o.title,
          slot: o.device.slot ? o.device.slot : 1,
          description: o.description ? o.description : "",
          platform: p || i.Platform.V5,
          creationDate: "",
          language: o.language,
          sdkVersion: o.sdk,
          cpp: { includePath: [] },
        },
        extension: { version: i.Extension.version(), json: 1 },
      };
      if (!!f) return f;
    }
    _v5cppToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e)),
        s = {
          project: {
            name: qe.basename(t.fsPath, ".v5cpp"),
            slot: o.slot ? o.slot : 1,
            description: "",
            platform: o.platform ? o.platform : i.Platform.V5,
            creationDate: "",
            language: o.textLanguage,
            sdkVersion: o.sdkVersion,
            cpp: { includePath: [] },
          },
          extension: { version: i.Extension.version(), json: 1 },
        };
      if (!!s) return [s, o.textContent];
    }
    _iq2cppToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e));
      if (o?.targetBrainGen !== "Second")
        throw Error(
          `${o.platform} ${o?.targetBrainGen} Gen Projects Not supported`,
        );
      let s = {
        project: {
          name: qe.basename(t.fsPath, ".iqcpp"),
          slot: o.slot ? o.slot : 1,
          description: "",
          platform: i.Platform.IQ2,
          creationDate: "",
          language: o.textLanguage,
          sdkVersion: o.sdkVersion,
          cpp: { includePath: [] },
        },
        extension: { version: i.Extension.version(), json: 1 },
      };
      if (!!s) return [s, o.textContent];
    }
    _expcppToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e)),
        s = {
          project: {
            name: qe.basename(t.fsPath, ".expcpp"),
            slot: o.slot ? o.slot : 1,
            description: "",
            platform: o.platform ? o.platform : i.Platform.EXP,
            creationDate: "",
            language: o.textLanguage,
            sdkVersion: o.sdkVersion,
            cpp: { includePath: [] },
          },
          extension: { version: i.Extension.version(), json: 1 },
        };
      if (!!s) return [s, o.textContent];
    }
    _v5pythonToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o;
      try {
        o = JSON.parse(new Qe.TextDecoder().decode(e));
      } catch (r) {
        throw r;
      }
      let s = {
        project: {
          name: qe.basename(t.fsPath, ".v5python"),
          slot: o.slot ? o.slot : 1,
          description: "",
          platform: o.platform ? o.platform : i.Platform.V5,
          creationDate: "",
          language: o.textLanguage,
          python: { main: j.Uri.joinPath(j.Uri.file("src"), "main.py").fsPath },
          sdkVersion: o.sdkVersion,
        },
        extension: { version: i.Extension.version(), json: 1 },
      };
      if (!!s) return [s, o.textContent];
    }
    _iq2pythonToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e));
      if (o?.targetBrainGen !== "Second")
        throw Error(
          `Import Failed: ${o.platform} ${o?.targetBrainGen} Gen Projects Not supported`,
        );
      let s = {
        project: {
          name: qe.basename(t.fsPath, ".iqpython"),
          slot: o.slot ? o.slot : 1,
          description: "",
          platform: i.Platform.IQ2,
          creationDate: "",
          language: o.textLanguage,
          python: { main: j.Uri.joinPath(j.Uri.file("src"), "main.py").fsPath },
          sdkVersion: o.sdkVersion,
        },
        extension: { version: "", json: 1 },
      };
      if (!!s) return [s, o.textContent];
    }
    _exppythonToProjectSettings(t) {
      let e = be.readFileSync(t.fsPath),
        o = JSON.parse(new Qe.TextDecoder().decode(e)),
        s = {
          project: {
            name: qe.basename(t.fsPath, ".exppython"),
            slot: o.slot ? o.slot : 1,
            description: "",
            platform: o.platform ? o.platform : i.Platform.EXP,
            creationDate: "",
            language: o.textLanguage,
            sdkVersion: o.sdkVersion,
            python: {
              main: j.Uri.joinPath(j.Uri.file("src"), "main.py").fsPath,
            },
          },
          extension: { version: i.Extension.version(), json: 1 },
        };
      if (!!s) return [s, o.textContent];
    }
    async searchForProjectsInWorkspace() {
      V._logHandler(""),
        V._logHandler("Looking for Projects in workspace ----------------");
      let t = j.workspace.workspaceFolders ? j.workspace.workspaceFolders : [];
      if (
        ((this._projectList = []),
        t.forEach((e) => {
          try {
            let o = j.Uri.joinPath(e.uri, ".vscode", Ct.vexProjectSettingsName);
            if (!be.existsSync(o.fsPath)) {
              V._logHandler(`WS Folder is not a VEX Project: ${e}`);
              return;
            }
            let s = Ct.readProjectSettings(o);
            if (s) {
              let r = new Ct(e.uri, s);
              this._projectList.push(r),
                V._logHandler(`Project found: ${r.name}`);
            }
          } catch (o) {
            console.log(
              V._classType,
              "Invalid Project Settings Error",
              e.name,
              e.uri,
              o,
            ),
              V._logHandler(`Error adding project: ${e.name}, ${o}`);
          }
        }),
        this._projectList.length)
      ) {
        (this._selectedProject = this._selectedProject
          ? this._selectedProject
          : this._projectList[0]),
          await j.commands.executeCommand(
            "setContext",
            `${i.Extension.id}.vexProjectSettingsFolderArr`,
            [],
          ),
          await j.commands.executeCommand(
            "setContext",
            `${i.Extension.id}.vexProjectSettingsFolderArr`,
            [this._selectedProject.settingsFileUri],
          ),
          await this._updateProjectIntellesense(this._selectedProject);
        let e = this._selectedProject.readProjectSettings();
        e.project.language === "python"
          ? this.checkPythonSdk(this._selectedProject)
          : e.project.language === "cpp" &&
            this.checkCppSdk(this._selectedProject);
      } else V._logHandler("No VEX Projects found in workspace");
    }
    _buildDataHandler(t) {
      let e;
      console.log("Build Data CB", this._buildDataCB),
        typeof t == "string"
          ? (e = new Qe.TextEncoder().encode(t + this._osEndLine))
          : (e = t),
        this._buildDataCB && this._buildDataCB(e);
    }
    _buildErrorHandler(t, e) {
      let o;
      typeof e == "string"
        ? (o = new Qe.TextEncoder().encode(e + this._osEndLine))
        : (o = e),
        this._buildErrorCB && this._buildErrorCB(t, o);
    }
    _buildExitHandler(t) {
      this._buildExitCB && this._buildExitCB(t, this._currentAction);
    }
    static _logHandler(t) {
      let e = `[${V._classType}]: ${t}`;
      V._logCB && V._logCB(e);
    }
    _folderChange(t) {
      console.log(
        V._classType,
        "Worspace Folder Change------------------------",
        t,
      ),
        this.searchForProjectsInWorkspace();
    }
  },
  ot = V;
(ot._classType = "Project Manager"),
  (ot.importExtensions = [
    "v5code",
    "v5cpp",
    "iqcpp",
    "expcpp",
    "iqpython",
    "v5python",
    "exppython",
    "zip",
  ]);
((o) => {
  let y;
  ((N) => (
    (N[(N.NO_ERROR = 0)] = "NO_ERROR"),
    (N[(N.NO_WORKSPACE_OPEN = -10)] = "NO_WORKSPACE_OPEN"),
    (N[(N.MISSING_SDK = -11)] = "MISSING_SDK"),
    (N[(N.NOT_DEFINED_PROJECT = -12)] = "NOT_DEFINED_PROJECT"),
    (N[(N.NOT_DEFINED_TOOLCHAIN = -13)] = "NOT_DEFINED_TOOLCHAIN"),
    (N[(N.NOT_DEFINED_SDK = -14)] = "NOT_DEFINED_SDK"),
    (N[(N.PROJECT_PATH_DOES_NOT_EXIST = -15)] = "PROJECT_PATH_DOES_NOT_EXIST"),
    (N[(N.BUILD_ACTION_IN_PROCESS = -16)] = "BUILD_ACTION_IN_PROCESS"),
    (N[(N.MAKE_DOES_NOT_EXIST = -17)] = "MAKE_DOES_NOT_EXIST"),
    (N[(N.TOOLCHAIN_DOES_NOT_EXIST = -18)] = "TOOLCHAIN_DOES_NOT_EXIST"),
    (N[(N.NO_PROJECT_SELECTED = -19)] = "NO_PROJECT_SELECTED"),
    (N[(N.COMPILER_ERROR = -20)] = "COMPILER_ERROR")
  ))((y = o.BuildErrorCodes || (o.BuildErrorCodes = {}))),
    (o.buildErrorCodesDetails = new Map([
      [-10, "No Workspace Folder is open"],
      [-11, "SDK not found"],
      [-12, "Project Folder not defined"],
      [-13, "Toolchain Folder not defined"],
      [-14, "SDK Path not defined"],
      [-15, "No Workspace Folder is open"],
      [-16, "Build action in progress"],
      [-17, "make.exe utillity doesn't not exist"],
      [-18, "toolchain does not exist"],
      [-19, "No Project Selected"],
      [-20, "Compiler Error"],
    ]));
  let e = !0;
})(ot || (ot = {}));
var Ve = L(require("vscode"));
var zs = L(require("path")),
  Rt = class {
    constructor(t) {
      (this._deviceListButton = Ve.window.createStatusBarItem(
        Ve.StatusBarAlignment.Left,
        6,
      )),
        (this._deviceListButton.command = Rt.listDevicesCmdId),
        (this._deviceListButton.text = ""),
        (this._deviceListButton.tooltip = "List VEX Devices"),
        (this._selectSlotButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          5,
        )),
        (this._selectSlotButton.command = Rt.slotCmdId),
        (this._selectSlotButton.text = "$(vex-slot) Slot 1"),
        (this._selectSlotButton.tooltip = "Select Slot"),
        (this._buildButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          4,
        )),
        (this._buildButton.command = Rt.buildCmdId),
        (this._buildButton.text = "$(vex-build)"),
        (this._buildButton.tooltip = "Build Project"),
        (this._playButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          3,
        )),
        (this._playButton.command = Rt.playCmdId),
        (this._playButton.text = "$(vex-play)"),
        (this._playButton.tooltip = "Play User Program"),
        (this._stopButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          2,
        )),
        (this._stopButton.command = Rt.stopCmdId),
        (this._stopButton.text = "$(vex-stop)"),
        (this._stopButton.tooltip = "Stop User Program"),
        (this._selectProjectButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          1,
        )),
        (this._selectProjectButton.command = Rt.selectProjectCmdId),
        (this._selectProjectButton.text = "No Project Selected"),
        (this._selectProjectButton.tooltip = "Select Active Project"),
        (this._pythonFileButton = Ve.window.createStatusBarItem(
          Ve.StatusBarAlignment.Left,
          0,
        )),
        (this._pythonFileButton.command = Rt.selectPythonCmdId),
        (this._pythonFileButton.text = ".py"),
        (this._pythonFileButton.tooltip = "Select Python File");
    }
    async selectSlot() {
      let t = "Select Slot",
        e = [
          "$(vex-slot) Slot 1",
          "$(vex-slot) Slot 2",
          "$(vex-slot) Slot 3",
          "$(vex-slot) Slot 4",
          "$(vex-slot) Slot 5",
          "$(vex-slot) Slot 6",
          "$(vex-slot) Slot 7",
          "$(vex-slot) Slot 8",
        ],
        o = await Ve.window.showQuickPick(e, {
          placeHolder: t,
          onDidSelectItem: () => {},
        }),
        s = 1;
      return (
        o
          ? (s = Number(o.split(" ")[2]))
          : (s = Number(this._selectSlotButton.text.split(" ")[2])),
        (this._selectSlotButton.text = `$(vex-slot) Slot ${s}`),
        s
      );
    }
    async selectProject(t) {
      let e = "Select Project",
        o = [],
        s = 1,
        r;
      t.searchForProjectsInWorkspace(),
        t.projectList.forEach((a) => {
          a.updateProjectSettings(),
            a.projectUri.fsPath === t.selectedProject.projectUri.fsPath
              ? (r = a)
              : o.push({
                  label: a.name,
                  description: a.language,
                  detail: a.projectUri.fsPath,
                }),
            s++;
        }),
        o.unshift({
          label: `$(star-full)${r.name}`,
          description: r.language,
          detail: r.projectUri.fsPath,
        }),
        Ve.window.showInputBox();
      let n = await Ve.window.showQuickPick(o, {
        placeHolder: e,
        onDidSelectItem: () => {},
        canPickMany: !1,
      });
      if (!!n)
        return t.projectList.filter((a) => a.projectUri.fsPath === n.detail)[0];
    }
    async pickPythonFile(t) {
      let e = "Select Python File",
        o = [],
        s = 1;
      t.selectedProject.updateProjectSettings();
      let r = new Ve.RelativePattern(t.selectedProject.projectUri, "**/*.py"),
        n = new Ve.RelativePattern(t.selectedProject.projectUri, "**/build/**");
      (await Ve.workspace.findFiles(r, n)).forEach((c) => {
        let l = {
          description: Ve.workspace.asRelativePath(c, !1),
          label: `$(python-qp)${zs.basename(c.fsPath)}`,
        };
        o.push(l);
      });
      let a = await Ve.window.showQuickPick(o, {
        placeHolder: e,
        onDidSelectItem: () => {},
        canPickMany: !1,
      });
      if (!!a) return a;
    }
    get buildBtn() {
      return this._buildButton;
    }
    get playBtn() {
      return this._playButton;
    }
    get stopBtn() {
      return this._stopButton;
    }
    get deviceListBtn() {
      return this._deviceListButton;
    }
    get selectSlotBtn() {
      return this._selectSlotButton;
    }
    get selectProjectBtn() {
      return this._selectProjectButton;
    }
    get selectPythonFileBtn() {
      return this._pythonFileButton;
    }
  },
  He = Rt;
(He.playCmdId = `${i.Extension.id}.statusbar.play`),
  (He.stopCmdId = `${i.Extension.id}.statusbar.stop`),
  (He.buildCmdId = `${i.Extension.id}.statusbar.build`),
  (He.listDevicesCmdId = `${i.Extension.id}.statusbar.listDevices`),
  (He.slotCmdId = `${i.Extension.id}.statusbar.pickSlot`),
  (He.selectProjectCmdId = `${i.Extension.id}.statusbar.pickProject`),
  (He.selectPythonCmdId = `${i.Extension.id}.statusbar.pickPythonFile`);
var mt = L(require("fs")),
  $o = L(require("os")),
  wt = L(require("vscode"));
var ee;
((n) => {
  function y(c, l) {}
  n.splitTerminal = y;
  let t;
  ((F) => (
    (F.black = "\x1B[30m"),
    (F.red = "\x1B[31m"),
    (F.green = "\x1B[32m"),
    (F.yellow = "\x1B[33m"),
    (F.blue = "\x1B[34m"),
    (F.magenta = "\x1B[35m"),
    (F.cyan = "\x1B[36m"),
    (F.white = "\x1B[37m"),
    (F.reset = "\x1B[0m")
  ))((t = n.TextColors || (n.TextColors = {})));
  let e;
  ((k) => (
    (k.arrowUp = "\x1B[A"),
    (k.arrowDown = "\x1B[B"),
    (k.arrowRight = "\x1B[C"),
    (k.arrowLeft = "\x1B[D"),
    (k.insert = "\x1B[@"),
    (k.delete = "\x1B[P"),
    (k.clearScreen = "'\x1B[2J\x1B[3J\x1B[;H'"),
    (k.clearLineToEnd = "\x1B[0K"),
    (k.clearLineToStart = "\x1B[1K"),
    (k.clearLineEntire = "\x1B[2K")
  ))((e = n.AnsiEscapeCodes || (n.AnsiEscapeCodes = {})));
  function o(c, l) {
    return `${l}${c}${"\x1B[0m"}`;
  }
  n.colorText = o;
  class s {
    constructor(l, p) {
      (this._name = l || "Interactive Terminal"),
        (this._line = []),
        (this._writeEmitter = new wt.EventEmitter()),
        (this._position = 0),
        (this._cmdIndex = 0),
        (this._previousCmds = []),
        (this._recieveInputDataCB = this.defaultTerminalInputHandler);
      let f = {
          onDidWrite: this._writeEmitter.event,
          open: () => {},
          close: () => {},
          handleInput: (P) => {
            this._recieveInputDataCB(this, P);
          },
        },
        U = wt.Uri.joinPath(
          i.Extension.context.extensionUri,
          "resources",
          "icons",
          "vex.svg",
        );
      if (p) {
        let P = { parentTerminal: p };
        this._terminal = wt.window.createTerminal({
          name: l,
          location: P,
          pty: f,
          iconPath: U,
        });
      } else
        this._terminal = wt.window.createTerminal({
          name: l,
          pty: f,
          iconPath: U,
        });
    }
    write(l, p) {
      let f = "";
      l instanceof Uint8Array
        ? l.forEach((P) => {
            f += String.fromCharCode(P);
          })
        : (f = l);
      let U = p ? n.colorText(f, p) : f;
      this._writeEmitter.fire(U);
    }
    writeLine(l, p) {
      this.write(
        l +
          `\r
`,
        p,
      );
    }
    clear() {
      this._writeEmitter.fire("\x1B[2J\x1B[3J\x1B[;H");
    }
    registerCB(l, p) {
      switch (l) {
        case "Input":
          this._onDataRecievedCB = p;
          break;
      }
    }
    defaultTerminalInputHandler(l, p) {
      this._onDataRecievedCB && this._onDataRecievedCB(p);
    }
    get terminal() {
      return this._terminal;
    }
  }
  n.Interactive = s;
  let a = class {
      static setBuildLogFileHome(l) {
        mt.existsSync(l.fsPath) || mt.mkdirSync(l.fsPath),
          l && (a._LogHomeUri = wt.Uri.joinPath(l, a._LogFile));
      }
      static writeToTempLog(l) {
        !a._LogHomeUri ||
          mt.appendFileSync(a._LogHomeUri.fsPath, l, { encoding: "utf-8" });
      }
      static read() {
        return !a._LogHomeUri || !mt.existsSync(a._LogHomeUri.fsPath)
          ? ""
          : mt.readFileSync(a._LogHomeUri.fsPath, { encoding: "utf-8" });
      }
      static clearTempLog() {
        !a._LogHomeUri ||
          (mt.existsSync(a._LogHomeUri.fsPath) &&
            mt.rmSync(a._LogHomeUri.fsPath, { force: !0 }));
      }
      constructor(l) {
        (this._regexError = new RegExp(/(error:|Error \d)/)),
          (this._regexWarning = new RegExp(/(warning:|Warning \d)/)),
          (this._regexCodeLineOrCaret = new RegExp(
            /(\^|\;|\)\;|\w;|\w\(|\w\[|\]\;)/,
          )),
          (this._regexWarningErrorText = new RegExp(
            /\d\s(warning|warnings|error|errors)\s/,
          )),
          (this._writeEmitter = new wt.EventEmitter()),
          (this._msg = "");
        let p = "",
          f = {
            onDidWrite: this._writeEmitter.event,
            open: () =>
              this._writeEmitter.fire(`Log\r
`),
            close: () => {},
            handleInput: (x) => {
              if (x === "\r") {
                p.includes("clear") || p.includes("cls")
                  ? this.clear()
                  : this.write(`\r
`),
                  (p = "");
                return;
              }
              if (x === "\x7F") {
                if (p.length === 0) return;
                (p = p.substr(0, p.length - 1)),
                  this._writeEmitter.fire("\x1B[D"),
                  this._writeEmitter.fire("\x1B[P");
                return;
              }
              (p += x), this.write(x);
            },
          },
          U = { parentTerminal: l },
          P = wt.Uri.joinPath(
            i.Extension.context.extensionUri,
            "resources",
            "icons",
            "vex.svg",
          );
        this._terminal = wt.window.createTerminal({
          name: "Log",
          location: U,
          pty: f,
          iconPath: P,
        });
      }
      write(l, p) {
        if (typeof l == "string") {
          let f = p ? n.colorText(l, p) : l;
          a.writeToTempLog(f), this._writeEmitter.fire(f);
          return;
        } else if (typeof l != "string") {
          let f = p ? n.colorText(l.toString(), p) : l.toString();
          a.writeToTempLog(f), this._writeEmitter.fire(f);
          return;
        }
      }
      writeLogText(l, p) {
        let f = p ? n.colorText(l, p) : l;
        this._writeEmitter.fire(l);
      }
      writeBuildText(l) {
        if (l instanceof Uint8Array) {
          this.parseBuildText(l, "\x1B[37m", !1);
          return;
        }
      }
      writeBuildErrorText(l) {
        if (l instanceof Uint8Array) {
          this.parseBuildText(l, "\x1B[31m", !0);
          return;
        }
      }
      clear() {
        n.Log.clearTempLog(), this._writeEmitter.fire("\x1B[2J\x1B[3J\x1B[;H");
      }
      parseBuildText(l, p, f = !1) {
        let U = [],
          P = "",
          x = !1;
        if (
          (l.forEach((k) => {
            (P += k.toString(16) + " "),
              $o.type() === "Linux" &&
                (k === 10
                  ? ((this._msg += String.fromCharCode(13)),
                    (this._msg += String.fromCharCode(k)),
                    U.push(this._msg),
                    (this._previousChar = 0),
                    (this._msg = ""),
                    (x = !0),
                    (P = ""))
                  : (this._msg += String.fromCharCode(k))),
              $o.type() === "Darwin" &&
                (k === 10
                  ? ((this._msg += String.fromCharCode(13)),
                    (this._msg += String.fromCharCode(k)),
                    U.push(this._msg),
                    (this._previousChar = 0),
                    (this._msg = ""),
                    (x = !0),
                    (P = ""))
                  : (this._msg += String.fromCharCode(k))),
              $o.type() === "Windows_NT" &&
                (k === 13
                  ? ((this._msg += String.fromCharCode(k)),
                    (this._previousChar = k))
                  : this._previousChar !== 13 && k === 10
                    ? ((this._msg += String.fromCharCode(k)),
                      (this._msg += String.fromCharCode(13)),
                      U.push(this._msg),
                      (this._previousChar = 0),
                      (this._msg = ""),
                      (x = !0))
                    : this._previousChar === 13 && k === 10
                      ? ((this._msg += String.fromCharCode(k)),
                        U.push(this._msg),
                        (this._previousChar = 0),
                        (this._msg = ""),
                        (x = !0))
                      : (this._msg += String.fromCharCode(k)));
          }),
          !x || U.length === 0)
        )
          return;
        if (!f) {
          U.forEach((k) => this.write(k, p));
          return;
        }
        let $ = this._previousTextColor ? this._previousTextColor : p,
          N = "",
          F = !1;
        U.forEach((k) => {
          this._regexWarning.test(k)
            ? (($ = "\x1B[33m"),
              (N += k),
              (this._previousTextColor = "\x1B[33m"))
            : this._regexError.test(k)
              ? (($ = "\x1B[31m"),
                (N += k),
                (this._previousTextColor = "\x1B[31m"))
              : this._regexCodeLineOrCaret.test(k)
                ? (N += o(`${k}`, $))
                : this._regexWarningErrorText.test(k)
                  ? ((N += o(`${k}`, "\x1B[36m")),
                    (N += `\r
`),
                    (F = !0))
                  : (N += k);
        }),
          (this._previousTextColor = $),
          this.write(N, $),
          F ? (this._previousTextColor = p) : (this._previousTextColor = $);
      }
      get terminal() {
        return this._terminal;
      }
    },
    r = a;
  (r._LogFile = "tempBuildLog.txt"), (n.Log = r);
})(ee || (ee = {}));
var Zo = L(require("ws"));
var Be = class {
    constructor(t, e) {
      this._deviceURL = `${i.Extension.id}/device`;
      this._vscodeURL = `${i.Extension.id}/vscode-command`;
      this._websocketServer = void 0;
      this._websocketDeviceList = [];
      this._websocketVSCodeCommand = [];
      this._wssConfig = {};
      this._isRunning = !1;
      this._DEFAULT_PORT = 7071;
      this._DEFAULT_HOST = "0.0.0.0";
      this._PORT_MIN = 1;
      this._PORT_MAX = 65535;
      (this._wssConfig = t || {
        port: this._DEFAULT_PORT,
        host: this._DEFAULT_HOST,
      }),
        this.on("Log", e),
        Be._logHandler("VEX Websocket Server Initialized");
    }
    start(t) {
      this._isRunning ||
        ((this._isRunning = !0),
        (this._wssConfig = t || this._wssConfig),
        Be._logHandler(
          `Starting Websocket Server on Host:${this._wssConfig.host} Port:${this._wssConfig.port}`,
        ),
        this._setupWebsocketServer());
    }
    stop() {
      !this._isRunning ||
        (this._websocketDeviceList.forEach((t) => {
          t[0].close(
            Be.ExitCode.CLOSE_GOING_AWAY,
            "Vex websocket server closing, server disabled",
          );
        }),
        (this._websocketDeviceList = []),
        this._websocketVSCodeCommand.forEach((t) => {
          t[0].close(
            Be.ExitCode.CLOSE_GOING_AWAY,
            "Vex websocket server closing, server disabled",
          );
        }),
        (this._websocketVSCodeCommand = []),
        Be._logHandler(
          `Stoping Websocket Server on Host:${this._wssConfig.host} Port:${this._wssConfig.port}`,
        ),
        this._websocketServer.close());
    }
    _setupWebsocketServer() {
      let t = this.validateServerConfig(this._wssConfig);
      if (t !== Be.ValidateErrorCodes.VALID_CONFIG) {
        (this._isRunning = !0), Be._logHandler(`Invalid Server Config: ${t}`);
        return;
      }
      this.websocketServer && this._websocketServer.removeAllListeners(),
        (this._websocketServer = new Zo.Server(this._wssConfig)),
        this._websocketServer.on("error", (e) => this._eventWSSError(e)),
        this._websocketServer.on("close", () => this._eventWSSClose()),
        this._websocketServer.on("connection", (e, o) =>
          this._eventWSSConnection(e, o),
        );
    }
    _eventWSSConnection(t, e) {
      let o = this.uuidv4(),
        s = Math.floor(Math.random() * 360),
        r = { id: o, color: s };
      console.log(o, s),
        console.log(t),
        console.log(e),
        e.url.includes(this._deviceURL)
          ? (console.log(e.socket.remoteAddress),
            console.log(e.socket.localAddress),
            this._websocketDeviceList.push([t, e, o]))
          : e.url.includes(this._vscodeURL)
            ? this._websocketVSCodeCommand.push([t, e, o])
            : t.close(
                Be.ExitCode.CLOSE_PROTOCOL_ERROR,
                `Vex websocket server error, URL: ${e.url}, not accepted.
  Try "ws://${e.socket.localAddress}:${e.socket.localPort}/${this._deviceURL}
" to access user port stream and try ""ws://${e.socket.localAddress}:${e.socket.localPort}/${this._vscodeURL}"`,
              ),
        t.on("close", () => {
          this._websocketDeviceList.pop();
        }),
        t.on("", () => {}),
        this._onConnectionHandler(t, e);
    }
    _eventWSSError(t) {
      Be._logHandler(`Error: ${t}`), (this._isRunning = !1);
    }
    _eventWSSClose() {
      this._isRunning = !1;
    }
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (t) {
          var e = (Math.random() * 16) | 0,
            o = t === "x" ? e : (e & 3) | 8;
          return o.toString(16);
        },
      );
    }
    updateServerConfig(t) {
      this._websocketDeviceList.forEach((e) => {
        e[0].close(
          Be.ExitCode.SERVICE_RESTART,
          "Vex websocket server restarting, server settings changed",
        );
      }),
        this.vscodeWSList.forEach((e) => {
          e[0].close(
            Be.ExitCode.SERVICE_RESTART,
            "Vex websocket server restarting, server settings changed",
          );
        }),
        this._websocketServer.close(),
        (this._websocketServer = new Zo.Server(t));
    }
    validateServerConfig(t) {
      if (t.port <= this._PORT_MIN && t.port >= this._PORT_MAX)
        return Be.ValidateErrorCodes.INVALID_PORT;
      let e = /.*\..*\..*\..*/,
        o = /[0-255]\.[0-255]\.[0-255]\.[0-255]/,
        s = /.*\:.*\:.*\:.*\:.*\:.*\:.*\:.*/,
        r =
          /[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}\:[0-9a-fA-F]{4}/,
        n = /[A-Za-z\-]*/;
      if (e.test(t.host)) {
        if ((console.log(o.test(t.host)), !o.test(t.host)))
          return Be.ValidateErrorCodes.INVALID_IPV4;
      } else if (s.test(t.host)) {
        if (!r.test(t.host)) return Be.ValidateErrorCodes.INVALID_IPV6;
      } else if (!n.test(t.host)) return Be.ValidateErrorCodes.INVALID_HOSTNAME;
      return Be.ValidateErrorCodes.VALID_CONFIG;
    }
    get websocketServer() {
      return this._websocketServer;
    }
    get deviceWSList() {
      return this._websocketDeviceList;
    }
    get vscodeWSList() {
      return this._websocketVSCodeCommand;
    }
    get deviceURL() {
      return this._deviceURL;
    }
    get vscodeURL() {
      return this._vscodeURL;
    }
    get host() {
      return this._wssConfig.host;
    }
    get port() {
      return this._wssConfig.port;
    }
    on(t, e) {
      switch (t) {
        case "Log":
          Be._logCB = e;
          break;
        case "connection":
          this._connectionCB = e;
          break;
      }
    }
    static _logHandler(t) {
      let e = `[${Be._classType}]: " ${t}`;
      console.log(e), Be._logCB && Be._logCB(e);
    }
    _onConnectionHandler(t, e) {
      this._connectionCB && this._connectionCB(t, e);
    }
  },
  Jt = Be;
Jt._classType = "VEX Websocket Server";
((e) => {
  let y;
  ((W) => (
    (W[(W.CLOSE_NORMAL = 1e3)] = "CLOSE_NORMAL"),
    (W[(W.CLOSE_GOING_AWAY = 1001)] = "CLOSE_GOING_AWAY"),
    (W[(W.CLOSE_PROTOCOL_ERROR = 1002)] = "CLOSE_PROTOCOL_ERROR"),
    (W[(W.CLOSE_UNSUPPORTED = 1003)] = "CLOSE_UNSUPPORTED"),
    (W[(W.RESERVED = 1004)] = "RESERVED"),
    (W[(W.CLOSED_NO_STATUS = 1005)] = "CLOSED_NO_STATUS"),
    (W[(W.CLOSE_ABNORMAL = 1006)] = "CLOSE_ABNORMAL"),
    (W[(W.UNSUPPORTED_PAYLOAD = 1007)] = "UNSUPPORTED_PAYLOAD"),
    (W[(W.POLICY_V = 1008)] = "POLICY_V"),
    (W[(W.CLOSE_TOO_LARGE = 1009)] = "CLOSE_TOO_LARGE"),
    (W[(W.MANDATORY_EXTENSION = 1010)] = "MANDATORY_EXTENSION"),
    (W[(W.SERVER = 1011)] = "SERVER"),
    (W[(W.SERVICE_RESTART = 1012)] = "SERVICE_RESTART"),
    (W[(W.TRY_AGAIN_LATER = 1013)] = "TRY_AGAIN_LATER"),
    (W[(W.BAD_GATEWAY = 1014)] = "BAD_GATEWAY"),
    (W[(W.TLS_HANDSHAKE_FAIL = 1015)] = "TLS_HANDSHAKE_FAIL")
  ))((y = e.ExitCode || (e.ExitCode = {})));
  let t;
  ((c) => (
    (c[(c.VALID_CONFIG = 0)] = "VALID_CONFIG"),
    (c[(c.INVALID_PORT = -1)] = "INVALID_PORT"),
    (c[(c.INVALID_IPV4 = -2)] = "INVALID_IPV4"),
    (c[(c.INVALID_IPV6 = -3)] = "INVALID_IPV6"),
    (c[(c.INVALID_HOSTNAME = -4)] = "INVALID_HOSTNAME")
  ))((t = e.ValidateErrorCodes || (e.ValidateErrorCodes = {})));
})(Jt || (Jt = {}));
var $t = L(require("os"));
var Mo = class {
  constructor(t) {
    this._onDidChangeTreeData = new g.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this._systemInfo = [];
    this._deviceInfo = {};
    this._getDeviceType = (t, e) => {
      if (e === i.Platform.V5)
        switch (t) {
          case 2:
            return "Motor";
          case 3:
            return "LED";
          case 4:
            return "Rotation";
          case 5:
            return "Motor";
          case 6:
            return "Inertial";
          case 7:
            return "Distance";
          case 8:
            return "Radio";
          case 9:
            return "Controller";
          case 10:
            return "Brain";
          case 11:
            return "Vision";
          case 12:
            return "3wire";
          case 13:
            return "Partner";
          case 14:
            return "Battery";
          case 15:
            return "Solenoid";
          case 16:
            return "Optical";
          case 17:
            return "Magnet";
          case 22:
            return "Radio - Internal";
          case 26:
            return "3D AI Camera";
          case -127:
            return "Generic";
          default:
            return t.toString();
        }
      else if (e === i.Platform.EXP)
        switch (t) {
          case 2:
            return "Motor";
          case 3:
            return "LED";
          case 4:
            return "Rotation";
          case 5:
            return "Motor";
          case 6:
            return "Inertial";
          case 7:
            return "Distance";
          case 8:
            return "Radio";
          case 9:
            return "Controller";
          case 10:
            return "Brain";
          case 11:
            return "Vision";
          case 12:
            return "3wire";
          case 13:
            return "Partner";
          case 14:
            return "Battery";
          case 15:
            return "Solenoid";
          case 16:
            return "Optical";
          case 17:
            return "Magnet";
          case 22:
            return "Radio - Internal";
          case 26:
            return "3D AI Camera";
          case -127:
            return "Generic";
          default:
            return t.toString();
        }
      else if (e === i.Platform.IQ2)
        switch (t) {
          case 2:
            return "Motor";
          case 3:
            return "Touchled";
          case 4:
            return "Color";
          case 5:
            return "Bumper";
          case 6:
            return "Gyro";
          case 7:
            return "Sonar";
          case 8:
            return "Radio";
          case 11:
            return "Vision";
          case 16:
            return "Optical";
          case 19:
            return "Distance";
          case -127:
            return "Generic";
          default:
            return t.toString();
        }
    };
    (this.context = t),
      (this._cautionIcon = new g.ThemeIcon(
        "warning",
        new g.ThemeColor("list.warningForeground"),
      )),
      (this._errorIcon = new g.ThemeIcon(
        "error",
        new g.ThemeColor("list.errorForeground"),
      ));
  }
  async getSystemInfo() {
    let t = [],
      e = await this.pickSystemToParse(this._device);
    if ((e && t.push(e), !this._externalDeviceList[0])) return t;
    let o = this._externalDeviceList?.length;
    return (
      await new Promise(async (r, n) => {
        let a = 0;
        for (
          this._externalDeviceList.forEach(async (c) => {
            let l = await this.pickSystemToParse(c);
            l && t.push(l), a++;
          });
          a !== o;

        )
          await i.Utils.asyncSleep(500);
        r(0);
      }),
      t
    );
  }
  async pickSystemToParse(t) {
    if (t instanceof H) {
      let e = this._parseAppParentNode(t);
      if (t instanceof Dt) return (e.items = this._parseV5Brain(t)), e;
      if (t instanceof tt) return (e.items = this._parseV5Controller(t)), e;
      if (t instanceof bt)
        return t.bootMode === _.BootMode.app
          ? ((e.items = this._parseIQ2Brain(t)), e)
          : ((t.bootMode === _.BootMode.rom || t.bootMode === _.BootMode.ram) &&
              (e.items = this._parseBootloaderIQ2Brain(t)),
            e);
      if (t instanceof Ye) return (e.items = this._parseIQ2Controller(t)), e;
      if (t instanceof xt)
        return (
          t.bootMode === _.BootMode.app && (e.items = this._parseEXPBrain(t)),
          (t.bootMode === _.BootMode.rom || t.bootMode === _.BootMode.ram) &&
            (e.items = this._parseBootloaderEXPBrain(t)),
          e
        );
      if (t instanceof nt) return (e.items = this._parseEXPController(t)), e;
      if (t instanceof Ue) return e;
    } else if (t instanceof Fe) {
      let e = this._parseDFUParentNode(t);
      if (t instanceof Ht || t instanceof Xt)
        return (e.items = this._parseBootloaderBrain(t)), e;
      if (t instanceof kt || t instanceof Tt)
        return (e.items = this._parseBootloaderController(t)), e;
    } else if (t instanceof co) {
      let e = this._parseAIAppParentNode(t);
      if (t instanceof Ue) return (e.items = this._parseAI3DCamera(t)), e;
    } else if (t instanceof lo) {
      let e = this._parseAIDFUParentNode(t);
      if (t instanceof Wt) return (e.items = this._parseDFUAI3DCamera(t)), e;
    } else return;
  }
  _parseAIAppParentNode(t) {
    let e = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      o = !1,
      s = !1,
      r = t.bootMode === _.BootMode.app ? `( ${t.name} )` : `( ${t.bootMode} )`;
    if (!(t instanceof Ue)) return e;
    (o = t?.ssidChanged ? !0 : o),
      (o = t?.passwordChanged ? !0 : o),
      (o = t?.needsUpdate ? !0 : o),
      (o = t?.updateList.length ? !0 : o),
      (o = t?.isVexupdateMissing ? !0 : o),
      t.ssidChanged || t.passwordChanged
        ? (r =
            t.bootMode === _.BootMode.app
              ? `( ${t.name} ) - reboot needed`
              : `( ${t.bootMode} ) - reboot needed`)
        : t.isVexupdateMissing && !t.isAlive
          ? (r = " ( vexupdate app is missing)")
          : t.isAlive
            ? t.systemInfo
              ? (r =
                  t.bootMode === _.BootMode.app
                    ? `( ${t.name} )`
                    : `( ${t.bootMode} )`)
              : (r = `( ${t.bootMode} )`)
            : (r = "initializing . . .");
    let n = e.type;
    return (
      t.json === "" || t.isVexupdateMissing || !t.isAlive
        ? (n = g.TreeItemCollapsibleState.None)
        : (n = g.TreeItemCollapsibleState.Expanded),
      s
        ? (e = {
            icon: new g.ThemeIcon(
              "device-camera",
              new g.ThemeColor("list.errorForeground"),
            ),
            name: `${t.platform} ${t.device} ${r}`,
            type: n,
            tag: `${t.platform} ${t.device}`,
            items: [],
          })
        : o
          ? (e = {
              icon: new g.ThemeIcon(
                "device-camera",
                new g.ThemeColor("list.warningForeground"),
              ),
              name: `${t.platform} ${t.device} ${r}`,
              type: n,
              tag: `${t.platform} ${t.device}`,
              items: [],
            })
          : (e = {
              icon: new g.ThemeIcon(
                "device-camera",
                new g.ThemeColor("charts.green"),
              ),
              name: `${t.platform} ${t.device} ${r}`,
              type: n,
              tag: `${t.platform} ${t.device}`,
              items: [],
            }),
      e
    );
  }
  _parseAppParentNode(t) {
    let e = !1,
      o = !1,
      s =
        t.bootMode === _.BootMode.app
          ? `( ${t.robotName} )`
          : `( ${t.bootMode} )`;
    t.device === i.Device.Brain
      ? (s =
          t.bootMode === _.BootMode.app
            ? `( ${t.robotName} )`
            : `( ${t.bootMode} )`)
      : t.device === i.Device.Controller
        ? ((s =
            t.bootMode === _.BootMode.app
              ? `( ${t.robotName} )`
              : `( ${t.bootMode} )`),
          (s = s === "(  )" ? "" : s))
        : (s =
            t.bootMode === _.BootMode.app
              ? `( ${t.robotName} )`
              : `( ${t.bootMode} )`),
      (t.needsVexosUpdate && t.bootMode === _.BootMode.app) ||
      (t.device === i.Device.Brain &&
        (t.bootMode === _.BootMode.rom || t.bootMode === _.BootMode.ram))
        ? (e = !0)
        : ((t.device === i.Device.Controller &&
            t.bootMode === _.BootMode.rom) ||
            t.bootMode === _.BootMode.dfu) &&
          (o = !0);
    let r = t.platform === "IQ2" ? "IQ 2nd Generation" : t.platform,
      n = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    return (
      o
        ? (n = {
            icon: new g.ThemeIcon(
              `vex-${t.platform}-${t.device}`,
              new g.ThemeColor("list.errorForeground"),
            ),
            name: `${r} ${t.device} ${s}`,
            type: g.TreeItemCollapsibleState.Expanded,
            tag: `${r} ${t.device} ${t.bootMode}`,
            items: [],
          })
        : e
          ? (n = {
              icon: new g.ThemeIcon(
                `vex-${t.platform}-${t.device}`,
                new g.ThemeColor("list.warningForeground"),
              ),
              name: `${r} ${t.device} ${s}`,
              type: g.TreeItemCollapsibleState.Expanded,
              tag: `${r} ${t.device} ${t.bootMode}`,
              items: [],
            })
          : (n = {
              icon: new g.ThemeIcon(
                `vex-${t.platform}-${t.device}`,
                new g.ThemeColor("charts.green"),
              ),
              name: `${r} ${t.device} ${s}`,
              type: g.TreeItemCollapsibleState.Expanded,
              tag: `${r} ${t.device} ${t.bootMode}`,
              items: [],
            }),
      n
    );
  }
  _parseAIDFUParentNode(t) {
    let e =
      t.bootMode === _.BootMode.app ? `( ${t.name} )` : `( ${t.bootMode} )`;
    e = t.bootMode === _.BootMode.app ? `( ${t.name} )` : `( ${t.bootMode} )`;
    let o = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      s = g.TreeItemCollapsibleState.Expanded;
    return (
      (o = {
        icon: new g.ThemeIcon(
          "device-camera",
          new g.ThemeColor("list.warningForeground"),
        ),
        name: `${t.platform} ${t.device} ${e}`,
        type: s,
        tag: `${t.platform} ${t.device}`,
        items: [],
      }),
      o
    );
  }
  _parseDFUParentNode(t) {
    let e = !1,
      o = !1,
      s = `( ${t.bootMode} )`;
    t.bootMode === _.BootMode.dfu && (o = !0);
    let r = t.platform === "IQ2" ? "IQ 2nd Generation" : t.platform,
      n = { items: [], name: "", type: g.TreeItemCollapsibleState.Expanded };
    return (
      o
        ? (n = {
            icon: new g.ThemeIcon(
              `vex-${t.platform}-${t.device}`,
              new g.ThemeColor("list.errorForeground"),
            ),
            name: `${r} ${t.device} ${s}`,
            type: g.TreeItemCollapsibleState.Expanded,
            tag: `${r} ${t.device} ${t.bootMode}`,
            items: [],
          })
        : e
          ? (n = {
              icon: new g.ThemeIcon(
                `vex-${t.platform}-${t.device}`,
                new g.ThemeColor("list.warningForeground"),
              ),
              name: `${r} ${t.device} ${s}`,
              type: g.TreeItemCollapsibleState.Expanded,
              tag: `${r} ${t.device} ${t.bootMode}`,
              items: [],
            })
          : (n = {
              icon: new g.ThemeIcon(
                `vex-${t.platform}-${t.device}`,
                new g.ThemeColor("charts.green"),
              ),
              name: `${r} ${t.device} ${s}`,
              type: g.TreeItemCollapsibleState.Expanded,
              tag: `${r} ${t.device} ${t.bootMode}`,
              items: [],
            }),
      n
    );
  }
  _parseV5Brain(t) {
    this._systemInfo = [];
    let e = 0,
      o = 1,
      s = 2,
      r = 3;
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      t.needsVexosUpdate
        ? (a = {
            icon: this.getVEXThemeIcon(
              t.platform,
              t.device,
              "list.warningForeground",
            ),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-update",
            items: [],
          })
        : (a = {
            icon: this.getVEXThemeIcon(t.platform, t.device, ""),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            items: [],
          });
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[e].items;
      t.needsVexosUpdate
        ? p.push({
            icon: this._cautionIcon,
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "",
            items: [],
          })
        : p.push({
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "vexos-good",
            items: [],
          }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[o].items = this._getSerialNode(t)),
        (l[s].items = this._getProgramsTree(n)),
        (l[r].items = this._getDeviceNode(n, t.platform));
    }
    return (
      n?.system?.radio_linked
        ? (c = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
            name: " Controller - linked",
            type: g.TreeItemCollapsibleState.None,
            items: [],
          })
        : n?.system?.controller_tethered
          ? (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - tethered",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            })
          : (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - not linked",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            }),
      [a, c]
    );
  }
  _parseV5Controller(t) {
    this._systemInfo = [];
    let e = 0,
      o = 1,
      s = 2,
      r = 3;
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      t.needsVexosUpdate
        ? (a = {
            icon: this.getVEXThemeIcon(
              t.platform,
              i.Device.Brain,
              "list.warningForeground",
            ),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-update",
            items: [],
          })
        : (a = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Brain, ""),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            items: [],
          });
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[e].items;
      t.needsVexosUpdate
        ? p.push({
            icon: this._cautionIcon,
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "",
            items: [],
          })
        : p.push({
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "vexos-good",
            items: [],
          }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[o].items = this._getSerialNode(t)),
        (l[s].items = this._getProgramsTree(n)),
        (l[r].items = this._getDeviceNode(n, t.platform));
    } else
      a = {
        icon: this.getVEXThemeIcon(
          t.platform,
          i.Device.Brain,
          "list.warningForeground",
        ),
        name: " Brain - not linked",
        type: g.TreeItemCollapsibleState.None,
        items: [],
      };
    if (
      n?.controller &&
      (this._device instanceof Ye || this._device instanceof tt)
    ) {
      c = {
        icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
        name: " Controller",
        type: g.TreeItemCollapsibleState.Expanded,
        tag: "controller",
        items: [],
      };
      let l = c.items;
      l.push({
        name: "radio		: " + i.Utils.vexos.toVersion(n.controller.radio),
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
        l.push({
          name: "usb			: " + i.Utils.vexos.toVersion(n.controller.version),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        });
    }
    return [a, c];
  }
  _parseBootloaderIQ2Brain(t) {
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.bootloader) {
      a = {
        icon: this.getVEXThemeIcon(
          t.platform,
          t.device,
          "list.warningForeground",
        ),
        name: " Brain",
        type: g.TreeItemCollapsibleState.Expanded,
        tag: "vexos-update",
        items: [],
      };
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      p.push({
        icon: this._cautionIcon,
        name: "VEXos		 : 0.0.0.0",
        type: g.TreeItemCollapsibleState.None,
        tag: "vexos-update",
        items: [],
      }),
        p.push({
          name: "bootloader	 : " + n.brain.bootloader,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        p.push({
          name: "version		 : " + i.Utils.vexos.toVersion(n.brain.version),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        (p = l[1].items),
        p.push({
          name: "communication	 : " + t.communication,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        });
      let f = $t.type() === "Windows_NT" ? "user				 : " : "user			 : ";
      p.push({
        name: f + t.user,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      });
    }
    return [a];
  }
  _parseIQ2Brain(t) {
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      t.needsVexosUpdate
        ? (a = {
            icon: this.getVEXThemeIcon(
              t.platform,
              t.device,
              "list.warningForeground",
            ),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-update",
            items: [],
          })
        : (a = {
            icon: this.getVEXThemeIcon(t.platform, t.device, ""),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "brain",
            items: [],
          });
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      t.needsVexosUpdate
        ? p.push({
            icon: this._cautionIcon,
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "",
            items: [],
          })
        : p.push({
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "vexos-good",
            items: [],
          }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[1].items = this._getSerialNode(t)),
        (l[2].items = this._getProgramsTree(n)),
        (l[3].items = this._getDeviceNode(n, t.platform));
    }
    return (
      n?.system?.radio_linked
        ? (c = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
            name: " Controller - linked",
            type: g.TreeItemCollapsibleState.None,
            items: [],
          })
        : n?.system?.controller_tethered
          ? (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - tethered",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            })
          : (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - not linked",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            }),
      [a, c]
    );
  }
  _parseIQ2Controller(t) {
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      a = {
        icon: this.getVEXThemeIcon(t.platform, i.Device.Brain, ""),
        name: " Brain",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      };
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      p.push({
        name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
        type: g.TreeItemCollapsibleState.None,
        tag: "vexos-good",
        items: [],
      }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[1].items = this._getSerialNode(t)),
        (l[2].items = this._getProgramsTree(n)),
        (l[3].items = this._getDeviceNode(n, t.platform));
    } else
      a = {
        icon: this.getVEXThemeIcon(
          t.platform,
          i.Device.Brain,
          "list.warningForeground",
        ),
        name: " Brain - not linked",
        type: g.TreeItemCollapsibleState.None,
        items: [],
      };
    if (n?.controller) {
      t.needsRadioUpdate || t.needsUsbUpdate
        ? (c = {
            icon: this.getVEXThemeIcon(
              t.platform,
              i.Device.Controller,
              "list.warningForeground",
            ),
            name: " Controller",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-controller-update",
            items: [],
          })
        : (c = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
            name: " Controller",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "controller",
            items: [],
          });
      let l = c.items;
      t.needsRadioUpdate
        ? l.push({
            icon: this._cautionIcon,
            name: "radio		: " + i.Utils.vexos.toVersion(n.controller.version),
            type: g.TreeItemCollapsibleState.None,
            tag: "controller-radio",
            items: [],
          })
        : l.push({
            name: "radio		: " + i.Utils.vexos.toVersion(n.controller.version),
            type: g.TreeItemCollapsibleState.None,
            tag: "controller-radio",
            items: [],
          }),
        t.needsUsbUpdate
          ? l.push({
              icon: this._cautionIcon,
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            })
          : l.push({
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            });
    } else if (n?.controller_boot) {
      c = {
        icon: this.getVEXThemeIcon(
          t.platform,
          i.Device.Controller,
          "list.errorForeground",
        ),
        name: " Controller",
        type: g.TreeItemCollapsibleState.Expanded,
        tag: "vexos-controller-update",
        items: [],
      };
      let l = c.items;
      l.push({
        icon: this._errorIcon,
        name: "radio		: 0.0.0.0",
        type: g.TreeItemCollapsibleState.None,
        tag: "controller-radio",
        items: [],
      }),
        t.needsUsbUpdate
          ? l.push({
              icon: this._cautionIcon,
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller_boot.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            })
          : l.push({
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller_boot.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            });
    }
    return [a, c];
  }
  _parseEXPBrain(t) {
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      t.needsVexosUpdate
        ? (a = {
            icon: this.getVEXThemeIcon(
              t.platform,
              t.device,
              "list.warningForeground",
            ),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-update",
            items: [],
          })
        : (a = {
            icon: this.getVEXThemeIcon(t.platform, t.device, ""),
            name: " Brain",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "brain",
            items: [],
          });
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      t.needsVexosUpdate
        ? p.push({
            icon: this._cautionIcon,
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "",
            items: [],
          })
        : p.push({
            name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
            type: g.TreeItemCollapsibleState.None,
            tag: "vexos-good",
            items: [],
          }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[1].items = this._getSerialNode(t)),
        (l[2].items = this._getProgramsTree(n)),
        (l[3].items = this._getDeviceNode(n, t.platform));
    }
    return (
      n?.system?.radio_linked
        ? (c = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
            name: " Controller - linked",
            type: g.TreeItemCollapsibleState.None,
            items: [],
          })
        : n?.system?.controller_tethered
          ? (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - tethered",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            })
          : (c = {
              icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
              name: " Controller - not linked",
              type: g.TreeItemCollapsibleState.None,
              items: [],
            }),
      [a, c]
    );
  }
  _parseBootloaderEXPBrain(t) {
    if (t.json === "{}" || t.json === "") return;
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.bootloader) {
      a = {
        icon: this.getVEXThemeIcon(
          t.platform,
          t.device,
          "list.warningForeground",
        ),
        name: " Brain",
        type: g.TreeItemCollapsibleState.Expanded,
        tag: "vexos-update",
        items: [],
      };
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      p.push({
        icon: this._cautionIcon,
        name: "VEXos		 : 0.0.0.0",
        type: g.TreeItemCollapsibleState.None,
        tag: "vexos-update",
        items: [],
      }),
        p.push({
          name: "bootloader	 : " + n.brain.bootloader,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        p.push({
          name: "version		 : " + i.Utils.vexos.toVersion(n.brain.version),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        (p = l[1].items),
        p.push({
          name: "communication	 : " + t.communication,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        });
      let f = $t.type() === "Windows_NT" ? "user				 : " : "user			 : ";
      p.push({
        name: f + t.user,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      });
    }
    return [a];
  }
  _parseEXPController(t) {
    let n = t.vexComSystemInfo,
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      c = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (n?.brain?.name) {
      a = {
        icon: this.getVEXThemeIcon(t.platform, i.Device.Brain, ""),
        name: " Brain",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      };
      let l = a.items;
      l.push({
        name: "system",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        l.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "programs",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        l.push({
          name: "devices",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[0].items;
      p.push({
        name: "VEXos	 : " + i.Utils.vexos.toVersion(n.brain.vexos),
        type: g.TreeItemCollapsibleState.None,
        tag: "vexos-good",
        items: [],
      }),
        p.push({
          name: "name	 : " + n.brain.name,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "name",
        }),
        p.push({
          name: "team	 : " + n.brain.team,
          type: g.TreeItemCollapsibleState.None,
          items: [],
          tag: "team",
        }),
        p.push({
          name: "id		 : " + n.brain.ssn.substring(2),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.vms &&
          n.vms.count > 0 &&
          p.push({
            name:
              "python	 : " +
              i.Utils.vexos.toVersion(n.vms.items[0].version) +
              " (" +
              n.vms.items[0].crc32 +
              ")",
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: 0,
          }),
        (l[1].items = this._getSerialNode(t)),
        (l[2].items = this._getProgramsTree(n)),
        (l[3].items = this._getDeviceNode(n, t.platform));
    } else
      n?.system?.controller_tethered
        ? (a = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Brain, ""),
            name: " Brain - tethered",
            type: g.TreeItemCollapsibleState.None,
            items: [],
          })
        : (a = {
            icon: this.getVEXThemeIcon(
              t.platform,
              i.Device.Brain,
              "list.warningForeground",
            ),
            name: " Brain - not linked",
            type: g.TreeItemCollapsibleState.None,
            items: [],
          });
    if (n?.controller) {
      t.needsRadioUpdate || t.needsUsbUpdate
        ? (c = {
            icon: this.getVEXThemeIcon(
              t.platform,
              i.Device.Controller,
              "list.warningForeground",
            ),
            name: " Controller",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "vexos-controller-update",
            items: [],
          })
        : (c = {
            icon: this.getVEXThemeIcon(t.platform, i.Device.Controller, ""),
            name: " Controller",
            type: g.TreeItemCollapsibleState.Expanded,
            tag: "controller",
            items: [],
          });
      let l = c.items;
      t.needsRadioUpdate
        ? l.push({
            icon: this._cautionIcon,
            name: "radio		: " + i.Utils.vexos.toVersion(n.controller.version),
            type: g.TreeItemCollapsibleState.None,
            tag: "controller-radio",
            items: [],
          })
        : l.push({
            name: "radio		: " + i.Utils.vexos.toVersion(n.controller.version),
            type: g.TreeItemCollapsibleState.None,
            tag: "controller-radio",
            items: [],
          }),
        t.needsUsbUpdate
          ? l.push({
              icon: this._cautionIcon,
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            })
          : l.push({
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            });
    } else if (n?.controller_boot) {
      c = {
        icon: this.getVEXThemeIcon(
          t.platform,
          i.Device.Controller,
          "list.errorForeground",
        ),
        name: " Controller",
        type: g.TreeItemCollapsibleState.Expanded,
        tag: "vexos-controller-update",
        items: [],
      };
      let l = c.items;
      l.push({
        icon: this._errorIcon,
        name: "radio		: 0.0.0.0",
        type: g.TreeItemCollapsibleState.None,
        tag: "controller-radio",
        items: [],
      }),
        t.needsUsbUpdate
          ? l.push({
              icon: this._cautionIcon,
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller_boot.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            })
          : l.push({
              name: "usb			: " + i.Utils.vexos.toVersion(n.controller_boot.atmel),
              type: g.TreeItemCollapsibleState.None,
              tag: "controller-atmel",
              items: [],
            });
    }
    return [a, c];
  }
  _parseDFUEXPBrain(t) {}
  _parseAI3DCamera(t) {
    if (t.json === "{}" || t.json === "") return;
    let r = t.systemInfo,
      n = { items: [], name: "", type: g.TreeItemCollapsibleState.None },
      a = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    if (r?.device?.name) {
      let c = n.items;
      c.push({
        name: "device",
        type: g.TreeItemCollapsibleState.Expanded,
        items: [],
      }),
        c.push({
          name: "serial port",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        }),
        c.push({
          name: "apps",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let l = c[0].items;
      l.push({
        name: "id			 : " + r?.device?.id,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
        t.needsUpdate
          ? l.push({
              icon: this._cautionIcon,
              name: "version		 : " + r?.device?.version,
              type: g.TreeItemCollapsibleState.None,
              tag: "3D-AI-Update-Image",
              items: [],
            })
          : l.push({
              name: "version		 : " + r?.device?.version,
              type: g.TreeItemCollapsibleState.None,
              items: [],
            }),
        l.push({
          name: "access point",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let p = l[2].items;
      t.ssidChanged
        ? p.push({
            icon: this._cautionIcon,
            name: "ssid		 : " + r?.device?.name + " - reboot needed ",
            type: g.TreeItemCollapsibleState.None,
            tag: "",
            items: [],
          })
        : p.push({
            name: "ssid			 : " + r?.device?.name,
            type: g.TreeItemCollapsibleState.None,
            items: [],
            tag: "3d-ssid",
          }),
        t.passwordChanged
          ? p.push({
              icon: this._cautionIcon,
              name: "password		 :: ****** - reboot needed ",
              type: g.TreeItemCollapsibleState.None,
              tag: "",
              items: [],
            })
          : p.push({
              name: "password		 : ******",
              type: g.TreeItemCollapsibleState.None,
              items: [],
              tag: "3d-password",
            });
      let U = $t.networkInterfaces()["Wi-Fi"],
        P = !1;
      console.log(U);
      let x;
      U?.forEach((F) => {
        F.family === "IPv4" && (x = F);
      }),
        U &&
          x &&
          r?.device?.access_point.client_macs.forEach((F) => {
            if (x.mac === F) {
              P = !0;
              return;
            }
          }),
        p.push({
          name: `connected	 : ${P}`,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        p.push({
          name: "mac address",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
      let $ = p[3].items,
        N = r?.device?.access_point?.host_mac
          ? r?.device?.access_point?.host_mac
          : "";
      if (
        ($.push({
          name: "host	: " + N,
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        r?.device?.access_point.client_macs)
      ) {
        $.push({
          name: "clients",
          type: g.TreeItemCollapsibleState.Expanded,
          items: [],
        });
        let F = $[1].items;
        (r?.device?.access_point.client_macs).length &&
          r?.device?.access_point.client_macs.forEach((k) => {
            U
              ? x.mac === k
                ? F.push({
                    name: `${k}	 : ( ${$t.hostname} ) `,
                    type: g.TreeItemCollapsibleState.None,
                    items: [],
                  })
                : F.push({
                    name: k,
                    type: g.TreeItemCollapsibleState.None,
                    items: [],
                  })
              : F.push({
                  name: k,
                  type: g.TreeItemCollapsibleState.None,
                  items: [],
                });
          });
      } else
        $.push({
          name: "clients",
          type: g.TreeItemCollapsibleState.None,
          items: [],
        });
      (c[1].items = this._getAISerialNode(t)),
        (c[2].items = this._getAIAppsTree(r, t));
    }
    return n.items;
  }
  _parseDFUAI3DCamera(t) {
    let n = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    n = {
      name: "device",
      type: g.TreeItemCollapsibleState.Expanded,
      items: [],
    };
    let a = n.items;
    return (
      a.push({
        icon: this._cautionIcon,
        name: "version		 :",
        type: g.TreeItemCollapsibleState.None,
        tag: "3D-AI-Update-Image",
        items: [],
      }),
      a.push({
        name: "bootloader	 : " + t.bootMode,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      a.push({
        name: "vid			 : 0x" + t.vid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      a.push({
        name: "pid			 : 0x" + t.pid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      [n]
    );
  }
  _parseBootloaderBrain(t) {
    let n = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    t.bootMode === _.BootMode.dfu
      ? (n = {
          icon: this.getVEXThemeIcon(
            t.platform,
            t.device,
            "list.errorForeground",
          ),
          name: ` ${t.device}`,
          type: g.TreeItemCollapsibleState.Expanded,
          tag: "dfu-recover",
          items: [],
        })
      : (n = {
          icon: this.getVEXThemeIcon(
            t.platform,
            t.device,
            "list.errorForeground",
          ),
          name: ` ${t.device}`,
          type: g.TreeItemCollapsibleState.Expanded,
          tag: "vexos-update",
          items: [],
        });
    let a = n.items;
    a.push({
      name: "system",
      type: g.TreeItemCollapsibleState.Expanded,
      items: [],
    });
    let c = a[0].items;
    return (
      t.bootMode === _.BootMode.dfu
        ? c.push({
            icon: this._errorIcon,
            name: "VEXos		 : 0.0.0.0 ",
            type: g.TreeItemCollapsibleState.None,
            tag: "recover",
            items: [],
          })
        : c.push({
            icon: this._errorIcon,
            name: "VEXos		 : 0.0.0.0 ",
            type: g.TreeItemCollapsibleState.None,
            tag: "vexos-update",
            items: [],
          }),
      c.push({
        name: "bootloader	 : " + t.bootMode,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      c.push({
        name: "vid			 : 0x" + t.vid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      c.push({
        name: "pid			 : 0x" + t.pid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      [n]
    );
  }
  _parseBootloaderController(t) {
    let n = { items: [], name: "", type: g.TreeItemCollapsibleState.None };
    n = {
      icon: this.getVEXThemeIcon(t.platform, t.device, "list.errorForeground"),
      name: ` ${t.device}`,
      type: g.TreeItemCollapsibleState.Expanded,
      tag: "dfu-recover",
      items: [],
    };
    let a = n.items;
    a.push({
      name: "system",
      type: g.TreeItemCollapsibleState.Expanded,
      items: [],
    });
    let c = a[0].items;
    c.push({
      icon: this._errorIcon,
      name: "radio		 : 0.0.0.0 ",
      type: g.TreeItemCollapsibleState.None,
      tag:
        t.bootMode === _.BootMode.dfu
          ? `controller-radio-${t.bootMode}`
          : "controller-radio",
      items: [],
    }),
      c.push({
        icon: this._errorIcon,
        name: "usb			 : 0.0.0.0 ",
        type: g.TreeItemCollapsibleState.None,
        tag: "controller-atmel",
        items: [],
      });
    let l = {
      name: "bootloader	 : " + t.bootMode,
      type: g.TreeItemCollapsibleState.Expanded,
      items: [],
    };
    return (
      l.items.push({
        name: "vid	 : 0x" + t.vid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      l.items.push({
        name: "pid	 : 0x" + t.pid,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      c.push(l),
      [n]
    );
  }
  _getSerialNode(t) {
    let e = [];
    e.push({
      name: "communication	 : " + t.communication,
      type: g.TreeItemCollapsibleState.None,
      items: [],
    });
    let o = $t.type() === "Windows_NT" ? "user				 : " : "user			 : ";
    return (
      e.push({
        name: o + t.user,
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
      e
    );
  }
  _getAISerialNode(t) {
    let e = [];
    e.push({
      name: "admin	 : " + t.communication,
      type: g.TreeItemCollapsibleState.None,
      items: [],
    });
    let o = $t.type() === "Windows_NT" ? "terminal	 : " : "terminal : ";
    return (
      e.push({
        name: o + t.user,
        type: g.TreeItemCollapsibleState.None,
        items: [],
        tag: "3D-AI-Reset-Terminal",
      }),
      e
    );
  }
  _getProgramsTree(t) {
    let e = [];
    return (
      t.programs.items.forEach((o) => {
        if (o) {
          let s = Number(o.slot) + 1,
            r = Uo.join("vex", s.toString()),
            n = "C++",
            a = Uo.join(r, o.file + ".cpp");
          o.type === "bina" &&
            ((n = "Python"), (a = Uo.join(r, o.file + ".py")));
          let c = {
            icon: g.ThemeIcon.File,
            name: `${s}:	 ${o.file}`,
            type: g.TreeItemCollapsibleState.Collapsed,
            items: [],
            data: s,
            tag: "program",
            slot: s,
            uri: a,
          };
          c.items.push({
            name: "slot		: " + s,
            type: g.TreeItemCollapsibleState.None,
            items: [],
            data: s,
          }),
            c.items.push({
              name: "file		: " + o.binfile,
              type: g.TreeItemCollapsibleState.None,
              items: [],
              data: o.binfile,
              tag: "binfile",
            }),
            c.items.push({
              name: "type		: " + n,
              type: g.TreeItemCollapsibleState.None,
              items: [],
              data: n,
            }),
            c.items.push({
              name: `size		: ${(o.size / 1024).toFixed(2)}kB`,
              type: g.TreeItemCollapsibleState.None,
              items: [],
              data: o.size,
            }),
            c.items.push({
              name: "time		: " + o.time,
              type: g.TreeItemCollapsibleState.None,
              items: [],
              data: o.time,
            }),
            e.push(c);
        }
      }),
      e.sort((o, s) => {
        let r = o.slot,
          n = s.slot;
        return r < n ? -1 : r > n ? 1 : 0;
      }),
      e
    );
  }
  _getDeviceNode(t, e) {
    let o = [],
      s = 23;
    for (let r = 0; r < t.devices.count; r++) {
      if (t.devices.items[r].type === 22 && e === i.Platform.EXP) continue;
      t.devices.items[r].port !== s
        ? o.push({
            name:
              "port_" +
              t.devices.items[r].port +
              "	 (" +
              this._getDeviceType(t.devices.items[r].type, e) +
              ")",
            type: g.TreeItemCollapsibleState.Collapsed,
            items: [],
          })
        : o.push({
            name: "Battery",
            type: g.TreeItemCollapsibleState.Collapsed,
            items: [],
          });
      let n = o[r].items;
      n.push({
        name: "type		 : " + this._getDeviceType(t.devices.items[r].type, e),
        type: g.TreeItemCollapsibleState.None,
        items: [],
      }),
        n.push({
          name:
            "version	 : " + i.Utils.vexos.toVersion(t.devices.items[r].version),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        n.push({
          name: "boot	 : " + i.Utils.vexos.toVersion(t.devices.items[r].boot),
          type: g.TreeItemCollapsibleState.None,
          items: [],
        });
    }
    return o;
  }
  _getAIAppsTree(t, e) {
    let o = [];
    return (
      t.apps.forEach((s) => {
        let r = !1,
          n = !1,
          a = !1;
        s.Status !== "install ok installed" &&
          ((r = !0),
          s.Status === "App Missing"
            ? (n = !0)
            : s.Status.includes("not-installed") && (a = !0));
        let c = r,
          l = !1;
        e?.updateList?.includes(s.Package) && (l = !0);
        let p = l;
        if (s) {
          let f = Uo.join(`${s.Package}_${s.Version}_${s.Architecture}.deb`),
            U;
          c
            ? (U = {
                icon: this._errorIcon,
                name: `${s.Package}`,
                type: g.TreeItemCollapsibleState.Collapsed,
                items: [],
                uri: f,
                tag: "3D-AI-App-Update",
                appMissing: n,
              })
            : p
              ? (U = {
                  icon: this._cautionIcon,
                  name: `${s.Package}`,
                  type: g.TreeItemCollapsibleState.Collapsed,
                  items: [],
                  uri: f,
                  tag: "3D-AI-App-Update",
                })
              : (U = {
                  icon: g.ThemeIcon.File,
                  name: `${s.Package}`,
                  type: g.TreeItemCollapsibleState.Collapsed,
                  items: [],
                  uri: f,
                }),
            U.items.push({
              name: `package			: ${s.Package}`,
              type: g.TreeItemCollapsibleState.None,
              items: [],
            }),
            !n &&
              !a &&
              (l
                ? U.items.push({
                    icon: this._cautionIcon,
                    name: "version		  : " + s.Version,
                    type: g.TreeItemCollapsibleState.None,
                    items: [],
                    tag: "3D-AI-App-Update",
                  })
                : U.items.push({
                    name: "version			: " + s.Version,
                    type: g.TreeItemCollapsibleState.None,
                    items: [],
                  }),
              U.items.push({
                name: "description		: " + s.Description,
                type: g.TreeItemCollapsibleState.None,
                items: [],
              }),
              U.items.push({
                name: "maintainer		: " + s.Maintainer,
                type: g.TreeItemCollapsibleState.None,
                items: [],
              })),
            r
              ? U.items.push({
                  icon: this._errorIcon,
                  name: "status		  : " + s.Status,
                  type: g.TreeItemCollapsibleState.None,
                  items: [],
                  tag: "3D-AI-App-Update",
                })
              : U.items.push({
                  name: "status			: " + s.Status,
                  type: g.TreeItemCollapsibleState.None,
                  items: [],
                }),
            o.push(U);
        }
      }),
      o
    );
  }
  getVEXThemeIcon(t, e, o) {
    let s = i.Extension.Icons.getIconStr(t, e);
    return new g.ThemeIcon(s, new g.ThemeColor(o));
  }
  refresh(t, e) {
    (this._device = t),
      (this._externalDeviceList = e),
      this.getSystemInfo()
        .then((o) => {
          (this._systemInfo = o), this._onDidChangeTreeData.fire(void 0);
        })
        .catch((o) => {
          console.log(o);
        });
  }
  clear(t) {
    this._systemInfo.length,
      (this._systemInfo = []),
      this._onDidChangeTreeData.fire(void 0);
  }
  clearSD() {
    (this._device = void 0),
      this.refresh(this._device, this._externalDeviceList);
  }
  clearAISD() {
    (this._externalDeviceList = []),
      this.refresh(this._device, this._externalDeviceList);
  }
  getTreeItem(t) {
    var e;
    if (t === void 0)
      e = new g.TreeItem("No systemInfo", g.TreeItemCollapsibleState.None);
    else {
      if (t.name === void 0) return;
      (e = new g.TreeItem(t.name, t.type)),
        t.icon !== void 0 && (e.iconPath = t.icon),
        t.tag !== void 0 &&
          (t.tag === "program" && (e.contextValue = "progItem"),
          t.tag === "EXP Brain app" && (e.contextValue = "expBrainItem"),
          (t.tag === "EXP Brain rom" ||
            t.tag === "EXP Brain ram" ||
            t.tag === "EXP Brain dfu") &&
            (e.contextValue = "expBrainItemBoot"),
          t.tag === "IQ 2nd Generation Brain app" &&
            (e.contextValue = "iq2BrainItem"),
          (t.tag === "IQ 2nd Generation Brain rom" ||
            t.tag === "IQ 2nd Generation Brain ram" ||
            t.tag === "IQ 2nd Generation Brain dfu") &&
            (e.contextValue = "iq2BrainItemBoot"),
          t.tag === "V5 Brain app" && (e.contextValue = "v5BrainItem"),
          t.tag === "EXP Controller app" &&
            (e.contextValue = "expControllerItem"),
          (t.tag === "EXP Controller rom" ||
            t.tag === "EXP Controller ram" ||
            t.tag === "EXP Controller dfu") &&
            (e.contextValue = "expControllerItemBoot"),
          t.tag === "IQ 2nd Generation Controller app" &&
            (e.contextValue = "iq2ControllerItem"),
          (t.tag === "IQ 2nd Generation Controller rom" ||
            t.tag === "IQ 2nd Generation Controller ram" ||
            t.tag === "IQ 2nd Generation Controller dfu") &&
            (e.contextValue = "iq2ControllerItemBoot"),
          t.tag.includes("V5 Controller") &&
            (e.contextValue = "v5ControllerItem"),
          t.tag === "program-empty" && (e.contextValue = "progEmptyItem"),
          t.tag === "binfile" && (e.contextValue = "fileItem"),
          t.tag === "slot" && (e.contextValue = "slotItem"),
          t.tag === "name" && (e.contextValue = "brainNameItem"),
          t.tag === "team" && (e.contextValue = "teamNumberItem"),
          t.tag === "vexos-update" && (e.contextValue = "vexosUpdateItem"),
          t.tag === "dfu-recover" && (e.contextValue = "dfuRecoverItem"),
          t.tag === "vexos-controller-update" &&
            (e.contextValue = "vexosControllerUpdateItem"),
          t.tag === "vexos-brain-update" &&
            (e.contextValue = "vexosBrainUpdateItem"),
          t.tag === "vexos-good" && (e.contextValue = "vexosGoodItem"),
          t.tag === "controller-atmel" &&
            (e.contextValue = "controllerAtmelItem"),
          t.tag === "controller-radio" &&
            (e.contextValue = "controllerRadioItem"),
          t.tag === "controller" && (e.contextValue = "controllerItem"),
          t.tag === "brain" && (e.contextValue = "brainItem")),
        t.uri !== void 0 && (e.resourceUri = g.Uri.file(t.uri)),
        t.data !== void 0 &&
          t.name.match("python") &&
          t.tag === "vmrefresh" &&
          (e.contextValue = "python");
    }
    return e;
  }
  getChildren(t) {
    return this._systemInfo.length === 0
      ? (this._systemInfo.push({
          name: "No VEX Device Connected",
          type: g.TreeItemCollapsibleState.None,
          items: [],
        }),
        Promise.resolve(this._systemInfo))
      : t === void 0
        ? Promise.resolve(this._systemInfo)
        : Promise.resolve(t.items);
  }
  get deviceInfo() {
    return this._deviceInfo;
  }
};
var We = L(require("vscode"));
var yo = class {
  constructor(t, e) {
    this._context = t;
    this._vexcomInfo = e;
    this._visable = !1;
    this._isFirst = !0;
  }
  resolveWebviewView(t, e, o) {
    (this._view = t),
      (t.webview.options = {
        enableScripts: !0,
        localResourceRoots: [
          We.Uri.joinPath(this._context.extensionUri, "resources", "icons"),
          We.Uri.joinPath(this._context.extensionUri, "resources", "webviews"),
          We.Uri.joinPath(
            this._context.extensionUri,
            "dist",
            "webviews",
            "views",
          ),
          We.Uri.joinPath(
            this._context.extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
          ),
          We.Uri.joinPath(
            this._context.extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
          ),
          We.Uri.joinPath(
            this._context.extensionUri,
            "resources",
            "webviews",
            "libs",
          ),
          We.Uri.joinPath(this._context.extensionUri, "webviews", "view"),
          We.Uri.joinPath(
            this._context.extensionUri,
            "node_modules",
            "fomantic-ui-css",
          ),
          We.Uri.joinPath(this._context.extensionUri, "resources", "icons"),
        ],
      }),
      t.onDidChangeVisibility(() => {}),
      (t.webview.html = this._getHtmlForWebview(t.webview)),
      t.webview.onDidReceiveMessage((s) => {
        switch (s.type) {
          case "newProjectBtn": {
            console.log("New Project Button Clicked"),
              i.Extension.Command.newProject();
            break;
          }
          case "importProjectBtn": {
            console.log("Import Project Button Clicked"),
              i.Extension.Command.importProject();
            break;
          }
          case "vexcomVersion": {
            console.log("VEXCOM VERSION Called");
            break;
          }
          case "setContext":
            return i.Extension.Context.setDebug(!0);
          case "isFirst":
            this._view.webview.postMessage({
              type: s.type,
              result: this._isFirst,
            }),
              (this._isFirst = !1);
        }
      }),
      t.onDidDispose(() => {
        console.log("Home View Disposed");
      }),
      this.resetProgressState();
  }
  updateProgress(t, e = !0) {
    (this._lastMsg = t),
      !(!this._view || !this._view.visible) &&
        this._view.webview.postMessage({
          type: "progress-update",
          content: t,
          visable: e,
        });
  }
  showProgress(t) {
    (this._visable = t),
      this._view &&
        this._view.webview.postMessage({
          type: "progress-visable",
          visable: t,
        });
  }
  resetProgressState() {
    (this._visable = !1),
      this._view.webview.postMessage({ type: "progress-reset" });
  }
  _getHtmlForWebview(t) {
    let e = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "dist",
          "webviews",
          "views",
          "homeView.js",
        ),
      ),
      o = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "webviews",
          "libs",
          "jquery",
          "jquery.js",
        ),
      ),
      s = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "webviews",
          "style",
          "reset.css",
        ),
      ),
      r = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "webviews",
          "style",
          "vscode.css",
        ),
      ),
      n = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "webviews",
          "style",
          "homeView.css",
        ),
      ),
      a = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "node_modules",
          "@vscode",
          "webview-ui-toolkit",
          "dist",
          "toolkit.js",
        ),
      ),
      c = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "node_modules",
          "@vscode",
          "codicons",
          "dist",
          "codicon.css",
        ),
      ),
      l = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "webviews",
          "style",
          "progress.css",
        ),
      ),
      p = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "node_modules",
          "fomantic-ui-css",
          "semantic.css",
        ),
      ),
      f = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "node_modules",
          "fomantic-ui-css",
          "semantic.js",
        ),
      ),
      U = t.asWebviewUri(
        We.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "icons",
          "vexai.svg",
        ),
      ),
      P = i.Extension.version(),
      x = Mi();
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<!--
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${x}';">
				--> 
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
				<!--Semantic-->

				<script nonce="${x}" src="${o}"><\/script>
				<link href="${p}"     rel="stylesheet">

				<link href="${s}" rel="stylesheet">
				<link href="${n}"  rel="stylesheet">
				<link href="${c}"     rel="stylesheet">
				<link href="${l}"     rel="stylesheet">

				<script nonce="${x}" src="${f}"><\/script>
				<script nonce="${x}" type="module" src="${a}"><\/script>
				<script nonce="${x}" src="${e}"><\/script>


				<title>Vex</title>
			</head>
			<body>
				<div style="display:flex; flex-direction:column; height:100%;">
					<vscode-button class="strectch-row buttonMargin" id="newProjectBtn" appearance="primary" aria-label="New Projet" >New Project</vscode-button>
					<vscode-button class="strectch-row buttonMargin" id="importProjectBtn" appearance="primary" aria-label="Import Project">Import Project</vscode-button>
					<div class="strectch-column-div"></div>
					<div style="display:flex; flex-direction:column; width:100%; height:100%;"></div>
					<div id="progList" style="noselect padding-left:5px; padding-right:5px;"></div>
					<div class="page-footer noselect">
						<h4 id="extVersion" class="version" style="font-weight:bold;">${P}</h4>
						<h4 id="vexcomVersion" class="version" style="font-weight:bold;">vexcom:${this._vexcomInfo.app.version}</h4>
					</div>
				</div>

			</body>
			</html>`;
  }
};
yo.viewType = "vex.vex-sidebar-home-webview";
function Mi() {
  let y = "",
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let e = 0; e < 32; e++)
    y += t.charAt(Math.floor(Math.random() * t.length));
  return y;
}
var _e = L(require("vscode"));
var qs = L(require("os")),
  Lo = require("fs");
var oo = L(require("vscode-textmate")),
  vo = L(require("vscode-oniguruma")),
  es = L(require("json5")),
  Me = L(require("vscode")),
  yt = L(require("fs")),
  Js = L(require("os")),
  Gs = L(require("path"));
var Ao = class {
  constructor() {
    (this._wasmBin = yt.readFileSync(
      Me.Uri.joinPath(
        i.Extension.context.extensionUri,
        "node_modules",
        "vscode-oniguruma",
        "release",
        "onig.wasm",
      ).fsPath,
    ).buffer),
      (this._vscodeOnigurumaLib = vo.loadWASM(this._wasmBin).then(() => ({
        createOnigScanner(t) {
          return new vo.OnigScanner(t);
        },
        createOnigString(t) {
          return new vo.OnigString(t);
        },
      }))),
      this._registerLanguages(),
      this._updateBackupColorThemeList(),
      this.updateActiveTheme(),
      console.log(this.activeColorThemeId),
      this.setTheme({
        name: this._currentColorTheme.label,
        settings: this._currentColorTheme.tokenColors,
      }),
      Me.window.onDidChangeActiveColorTheme(async (t) => {
        await i.Utils.asyncSleep(500),
          console.log(t),
          this.updateActiveTheme(),
          console.log(this._currentColorTheme),
          console.log(this?._registry?.getColorMap()),
          this.setTheme({
            name: this._currentColorTheme.label,
            settings: this._currentColorTheme.tokenColors,
          }),
          console.log(this?._registry?.getColorMap());
      });
  }
  _registerLanguages() {
    this._registry = new oo.Registry({
      onigLib: this._vscodeOnigurumaLib,
      loadGrammar: this._loadGrammer,
    });
  }
  async _loadGrammer(t) {
    let e = null,
      o,
      s;
    switch (t) {
      case "source.cpp":
        Me.extensions.all,
          (o = Me.extensions.getExtension("vscode.cpp")),
          (o = i.Backup.Extensions.getExtension("vscode.cpp")),
          console.log(o),
          (s = o.packageJSON.contributes.grammars.filter(
            (n) => n.scopeName === t,
          )[0]),
          (e = Me.Uri.joinPath(o.extensionUri, s.path));
        break;
      case "source.python":
        (o = Me.extensions.getExtension("vscode.python")),
          (o = i.Backup.Extensions.getExtension("vscode.python")),
          (s = o.packageJSON.contributes.grammars.filter(
            (n) => n.scopeName === t,
          )[0]),
          console.log(s),
          (e = Me.Uri.joinPath(o.extensionUri, s.path));
        break;
      default:
        e = null;
        break;
    }
    if (!e || !yt.existsSync(e.fsPath)) return null;
    let r = yt.readFileSync(e.fsPath);
    return oo.parseRawGrammar(r.toString(), e.fsPath);
  }
  _updateColorThemeList() {
    let e = Me.extensions.all.filter(
        (s) => !!s.packageJSON?.contributes?.themes,
      ),
      o = [];
    e.forEach((s) => {
      let r = s.packageJSON;
      r.contributes.themes.forEach((n) => {
        o.push({
          extensionId: r.id,
          label: n.label,
          id: n.id ? n.id : n.label,
          themeUri: Me.Uri.joinPath(s.extensionUri, n.path),
        });
      });
    }),
      (this._colorThemeList = o);
  }
  _updateBackupColorThemeList() {
    let e = i.Backup.Extensions.all.filter(
        (s) => !!s.packageJSON?.contributes?.themes,
      ),
      o = [];
    e.forEach((s) => {
      let r = s.packageJSON;
      r.contributes.themes.forEach((n) => {
        o.push({
          extensionId: r.id,
          label: n.label,
          id: n.id ? n.id : n.label,
          themeUri: Me.Uri.joinPath(s.extensionUri, n.path),
        });
      });
    }),
      (this._colorThemeListBackup = o);
  }
  get activeColorThemeId() {
    return Me.workspace.getConfiguration().get("workbench.colorTheme");
  }
  updateActiveTheme() {
    let t = this.activeColorThemeId,
      e = this._colorThemeList?.filter((n) => n.id === t)[0];
    if (
      (e ||
        (this._updateColorThemeList(),
        (e = this._colorThemeList?.filter((n) => n.id === t)[0])),
      e || (e = this._colorThemeListBackup?.filter((n) => n.id === t)[0]),
      !e)
    )
      switch (Me.window.activeColorTheme.kind) {
        case Me.ColorThemeKind.Dark:
          e = this._colorThemeListBackup?.filter(
            (n) => n.id === "Default Dark+",
          )[0];
          break;
        case Me.ColorThemeKind.HighContrast:
          e = this._colorThemeListBackup?.filter(
            (n) => n.id === "Default Dark+",
          )[0];
          break;
        case Me.ColorThemeKind.Light:
          e = this._colorThemeListBackup?.filter(
            (n) => n.id === "Default High Contrast",
          )[0];
          break;
        case Me.ColorThemeKind.HighContrastLight:
          e = this._colorThemeListBackup?.filter(
            (n) => n.id === "Default High Contrast Light",
          )[0];
          break;
      }
    this._currentColorTheme = e ? this.getColorThemeJSON(e) : void 0;
    let o = this._currentColorTheme,
      s = this._currentColorTheme.tokenColors
        ? this._currentColorTheme.tokenColors
        : [],
      r = !!o?.include;
    for (; r; ) {
      let n = Gs.dirname(e?.themeUri.path),
        a = Me.Uri.joinPath(Me.Uri.file(n), o?.include);
      console.log(yt.existsSync(a.fsPath)),
        console.log(yt.readFileSync(a.fsPath));
      let c = es.parse(yt.readFileSync(a.fsPath).toString());
      (s = (c.tokenColors ? c.tokenColors : []).concat(s)),
        c?.include ? ((o = c), (r = !0)) : ((o = void 0), (r = !1)),
        console.log(r);
    }
    (this._currentColorTheme.tokenColors = s),
      (this._currentColorTheme.label = e.label);
  }
  getColorThemeJSON(t) {
    if (!yt.existsSync(t.themeUri.fsPath)) return;
    let e = new TextDecoder().decode(yt.readFileSync(t.themeUri.fsPath));
    console.log(e);
    let o;
    try {
      o = es.parse(e);
    } catch {
      o = void 0;
    }
    return o;
  }
  async loadGrammar(t) {
    this._grammar = await this._registry.loadGrammar(t);
  }
  async loadGrammarWithConfiguration(t) {}
  setTheme(t, e) {
    this?._registry?.setTheme(t, e),
      this?._registry?.getColorMap(),
      console.log(t, this?._registry?.getColorMap());
  }
  getColorMap(t, e) {
    this?._registry?.getColorMap();
  }
  getCSSRules() {
    let t = [],
      e = 1;
    this?._registry?.getColorMap().forEach((s) => {
      switch (e) {
        case 1:
          t.push(`.mtk${e} { color:var(--vscode-editor-foreground); }`);
          break;
        case 2:
          t.push(`.mtk${e} { color:var(--vscode-editor-background); }`);
          break;
        default:
          t.push(`.mtk${e} { color:${s}; }`);
          break;
      }
      e++;
    }),
      t.push(".mtki { font-style: italic; }"),
      t.push(".mtkb { font-weight: bold;  }"),
      t.push(
        ".mtku { text-decoration: underline; text-underline-position: under; }",
      ),
      t.push(".mtks { text-decoration: line-through; }"),
      t.push(
        ".mtks.mtku { text-decoration: underline line-through; text-underline-position: under; }",
      ),
      t.push(
        ".mtkback { background-color:var(--vscode-editor-hoverHighlightBackground); padding:15px; padding-top:10px; padding-bottom:10px; font-family: var(--vscode-editor-font-family); font-weight: var(--vscode-editor-font-weight); font-size: var(--vscode-editor-font-size);}",
      ),
      t.push(
        ".mtkback-inline { background-color:var(--vscode-editor-hoverHighlightBackground); padding-left:5px; padding-right:5px; }",
      );
    let o = "";
    return (
      t.forEach((s) => {
        o += `${s}${Js.EOL}`;
      }),
      o
    );
  }
  textHighlight(t) {
    let e,
      o = [],
      s = oo.INITIAL,
      r = oo.INITIAL,
      n = "";
    for (let a = 0; a < [t].length; a++) {
      let c = [t][a],
        l = this._grammar.tokenizeLine(c, s),
        p = this._grammar.tokenizeLine2(c, r);
      console.log(`
Tokenizing line: ${l}`);
      let f = this._registry.getColorMap();
      e = p.tokens;
      for (let U = 0; U < l.tokens.length; U++) {
        let P = !1,
          x = l.tokens[U];
        for (let $ = 0; $ < p.tokens.length; $ = $ + 2)
          if (e[$] === x.startIndex) {
            let N = _t.getForeground(e[$ + 1]),
              F = _t.getBackground(e[$ + 1]),
              k = _t.getFontStyle(e[$ + 1]),
              W = _t.getLanguageId(e[$ + 1]),
              ie = _t.getInlineStyleFromMetadata(e[$ + 1], f),
              de = _t.containsBalancedBrackets(e[$ + 1]),
              w = _t.getPresentationFromMetadata(e[$ + 1]),
              O = _t.getTokenType(e[$ + 1]),
              q = _t.getClassNameFromMetadata(e[$ + 1]);
            n = q;
            let R = `Text:'${t.substring(x.startIndex, x.endIndex)}'
                        	${x.scopes}
                        	${N}
                        	${F}
                        	${k}
                        	${W}
                        	${ie}
                        	${N}
                        	${de}
                        	${w}
                        	${O}`;
            console.log(R),
              o.push({
                html: `<span class="${q}">${t.substring(x.startIndex, x.endIndex)}</span>`,
              }),
              (P = !0);
            continue;
          }
        P ||
          o.push({
            html: `<span class="${n}">${t.substring(x.startIndex, x.endIndex)}</span>`,
          });
      }
      (s = l.ruleStack), (r = p.ruleStack);
    }
    return console.log(o), o;
  }
};
var _t = class {
  static getLanguageId(t) {
    return (t & 255) >>> 0;
  }
  static getTokenType(t) {
    return (t & 768) >>> 8;
  }
  static containsBalancedBrackets(t) {
    return (t & 1024) !== 0;
  }
  static getFontStyle(t) {
    return (t & 30720) >>> 11;
  }
  static getForeground(t) {
    return (t & 16744448) >>> 15;
  }
  static getBackground(t) {
    return (t & 4278190080) >>> 24;
  }
  static getClassNameFromMetadata(t) {
    let e = this.getForeground(t),
      o = "mtk" + e,
      s = this.getFontStyle(t);
    return (
      s & 1 && (o += " mtki"),
      s & 2 && (o += " mtkb"),
      s & 4 && (o += " mtku"),
      s & 8 && (o += " mtks"),
      o
    );
  }
  static getInlineStyleFromMetadata(t, e) {
    let o = this.getForeground(t),
      s = this.getFontStyle(t),
      r = `color: ${e[o]};`;
    s & 1 && (r += "font-style: italic;"), s & 2 && (r += "font-weight: bold;");
    let n = "";
    return (
      s & 4 && (n += " underline"),
      s & 8 && (n += " line-through"),
      n && (r += `text-decoration:${n};`),
      r
    );
  }
  static getPresentationFromMetadata(t) {
    let e = this.getForeground(t),
      o = this.getFontStyle(t);
    return {
      foreground: e,
      italic: Boolean(o & 1),
      bold: Boolean(o & 2),
      underline: Boolean(o & 4),
      strikethrough: Boolean(o & 8),
    };
  }
};
var Li = require("path"),
  Oi = require("markdown-it"),
  _c = require("highlight.js").default,
  Bi = require("markdown-it-front-matter"),
  Ce = class {
    constructor(t) {
      this.v5PythonMdList = [];
      this.v5CppMdList = [];
      this.expPythonMdList = [];
      this.expCppMdList = [];
      this.iq2PythonMdList = [];
      this.iq2CppMdList = [];
      try {
        (this._context = t),
          (Ce._extensionUri = t.extensionUri),
          (Ce._grammar = new Ao()),
          _e.window.onDidChangeActiveColorTheme((e) =>
            this.reloadOnThemeChange(e, this),
          );
      } catch (e) {
        console.error("VEX Command Help Error", e);
      }
    }
    async initMarkList() {
      (this.v5CppMdList = await this.buildMDList(
        i.Platform.V5,
        i.Language.cpp,
      )),
        (this.v5PythonMdList = await this.buildMDList(
          i.Platform.V5,
          i.Language.python,
        )),
        (this.expCppMdList = await this.buildMDList(
          i.Platform.EXP,
          i.Language.cpp,
        )),
        (this.expPythonMdList = await this.buildMDList(
          i.Platform.EXP,
          i.Language.python,
        )),
        (this.iq2CppMdList = await this.buildMDList(
          i.Platform.IQ2,
          i.Language.cpp,
        )),
        (this.iq2PythonMdList = await this.buildMDList(
          i.Platform.IQ2,
          i.Language.python,
        ));
    }
    async buildMDList(t, e) {
      let o = Ce.mdFolderNames.get(`${t}_${e}`)
        ? Ce.mdFolderNames.get(`${t}_${e}`)
        : void 0;
      if (!o) return [];
      let s = _e.Uri.joinPath(
          this._context.extensionUri,
          "resources",
          "md",
          o,
          "en",
        ),
        r = [];
      return (0, Lo.existsSync)(s.fsPath)
        ? ((await _e.workspace.fs.readDirectory(s)).forEach((a) => {
            let c = _e.Uri.joinPath(s, a[0], `${a[0]}.md`),
              p = new TextDecoder()
                .decode((0, Lo.readFileSync)(c.fsPath))
                .split(qs.EOL),
              f = new RegExp(/(?<=\s*category:\s+)\w*(?=\s+)/),
              U = new RegExp(/(?<=\s*signature:\s+).*(?=\s*)/),
              P = new RegExp(/(?<=\s*device_class:\s+)\w*(?=\s+)/),
              x = new RegExp(/(?<=\s*description:\s+).*/);
            if (
              (U.test(p[1]) || console.log(p[1], f.exec(p[0])[0]),
              a[1] === _e.FileType.Directory)
            ) {
              let $ = "";
              U.test(p[1]) &&
                ($ = U.exec(p[1])[0].replace(/\\n|\\t|pass/gi, ""));
              let N = {
                language: e,
                platform: t,
                mdUri: c,
                name: `${a[0]}`,
                category: f.test(p[0]) ? f.exec(p[0])[0] : "",
                signature: $,
                device_class: P.test(p[2]) ? P.exec(p[2])[0] : "",
                description: x.test(p[3]) ? x.exec(p[3])[0] : "",
                markdown: p.slice(4).join(`\r
`),
              };
              r.push(N);
            }
          }),
          r || [])
        : [];
    }
    async getActiveList(t, e) {
      return (
        await Ce._grammar.loadGrammar(`source.${e}`),
        t === i.Platform.EXP && e === i.Language.cpp
          ? this.expCppMdList
          : t === i.Platform.EXP && e === i.Language.python
            ? this.expPythonMdList
            : t === i.Platform.V5 && e === i.Language.cpp
              ? this.v5CppMdList
              : t === i.Platform.V5 && e === i.Language.python
                ? this.v5PythonMdList
                : t === i.Platform.IQ2 && e === i.Language.cpp
                  ? this.iq2CppMdList
                  : t === i.Platform.IQ2 && e === i.Language.python
                    ? this.iq2PythonMdList
                    : []
      );
    }
    async reloadOnThemeChange(t, e) {
      Ce._view.dispose(),
        await i.Utils.asyncSleep(500),
        await Ce._grammar.updateActiveTheme(),
        Ce._currentMarkdownFile && (await e.Show(Ce._currentMarkdownFile));
    }
    async Show(t) {
      if (
        ((Ce._currentMarkdownFile = t),
        console.log("resolve Webview"),
        Ce._isRunning)
      ) {
        (this._panel.webview.html = Ce._getHtmlForWebview(
          this._panel.webview,
          t,
        )),
          this._panel.reveal(this._panel.viewColumn);
        return;
      }
      return (
        (this._panel = _e.window.createWebviewPanel(
          Ce.viewType,
          "Vex Command Help",
          { viewColumn: _e.ViewColumn.Two, preserveFocus: !1 },
        )),
        (Ce._isRunning = !0),
        (Ce._projectOptionsList = Po),
        await Ce.resolveWebviewView(this._panel, t)
      );
    }
    static async resolveWebviewView(t, e) {
      console.log("resolve Webview"), (this._view = t);
      let o = !1;
      console.log("resolve Webview");
      let s = {
        event: "create",
        projectPath: "",
        projectIndex: -1,
        vexSettings: {
          extension: { json: 1, version: "" },
          project: {
            sdkVersion: "",
            creationDate: "",
            description: "",
            language: void 0,
            name: "",
            platform: void 0,
            slot: 1,
          },
        },
        zipName: "",
      };
      for (
        t.webview.options = {
          enableScripts: !0,
          localResourceRoots: [
            _e.Uri.joinPath(Ce._extensionUri, "resources", "icons"),
            _e.Uri.joinPath(Ce._extensionUri, "dist", "views"),
            _e.Uri.joinPath(
              Ce._extensionUri,
              "node_modules",
              "@vscode",
              "webview-ui-toolkit",
              "dist",
            ),
            _e.Uri.joinPath(
              Ce._extensionUri,
              "node_modules",
              "@vscode",
              "codicons",
              "dist",
            ),
            _e.Uri.joinPath(Ce._extensionUri, "resources", "webviews", "libs"),
            _e.Uri.joinPath(Ce._extensionUri, "resources", "md"),
          ],
        },
          t.webview.html = Ce._getHtmlForWebview(t.webview, e),
          t.webview.onDidReceiveMessage((r) => {
            if ((console.log("Provider Recieved", r), !!r))
              switch (r.type) {
                case "cancelBtn": {
                  (Ce._isRunning = !1),
                    (s.event = "cancel"),
                    (s.projectIndex = -1),
                    (s.zipName = ""),
                    (s.vexSettings = void 0),
                    t.dispose();
                  break;
                }
              }
          }),
          t.onDidDispose(() => {
            Ce._isRunning && (console.log("Disposed"), (s.event = "disposed")),
              (o = !0),
              (Ce._isRunning = !1);
          });
        !o;

      )
        await new Promise((r) => setTimeout(r, 500));
      return console.log("Create Project DONE"), s;
    }
    static _getHtmlForWebview(t, e) {
      let o = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "libs",
            "jquery",
            "jquery.js",
          ),
        ),
        s = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "highlight.css",
          ),
        ),
        r = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "reset.css",
          ),
        ),
        n = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "markdown.css",
          ),
        ),
        a = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "webviews",
            "style",
            "main.css",
          ),
        ),
        c = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "md",
            "v5",
            "sensing_vision_objects_angle.md",
          ),
        ),
        l = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "resources",
            "md",
            "v5",
            "_sensing_vision_objects_angle.html",
          ),
        ),
        p = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.js",
          ),
        ),
        f = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
          ),
        ),
        U = t.asWebviewUri(
          _e.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.svg",
          ),
        ),
        P = (k) => {
          k.core.ruler.push("source_map_data_attribute", (w) => {
            console.log(w.tokens);
            for (let O of w.tokens)
              O.tag === "p"
                ? (console.log(O.type),
                  O.attrJoin("style", "color:var(--vscode-foreground);"))
                : O.tag === "code"
                  ? console.log(O.type)
                  : O.map &&
                    O.type !== "inline" &&
                    (O.attrSet("data-line", String(O.map[0])),
                    O.attrJoin("class", "code-line"),
                    O.attrJoin("dir", "auto")),
                console.log(O?.children);
          });
          let W = k.renderer.rules.html_block;
          W &&
            (k.renderer.rules.html_block = (w, O, q, R, fe) =>
              `<div ${fe.renderAttrs(w[O])} ></div>
` + W(w, O, q, R, fe));
          let ie = t,
            de = k.renderer.rules.image;
          (k.renderer.rules.image = (w, O, q, R, fe) => {
            let E = w[O];
            E.attrJoin("class", "loading");
            let Z = E.attrGet("src");
            if (Z) {
              R.containingImages?.push({ src: Z });
              let we = Xi(Z);
              if (
                (E.attrSet("id", `image-hash-${we}`), !E.attrGet("data-src"))
              ) {
                let Ze = _e.Uri.file(Li.dirname(e.mdUri.fsPath)),
                  Re = ie.asWebviewUri(_e.Uri.joinPath(Ze, Z));
                E.attrSet("src", Re.toString()), E.attrSet("data-src", Z);
              }
            }
            return de ? de(w, O, q, R, fe) : fe.renderToken(w, O, q);
          }),
            console.log(k.renderer.rules.code_inline),
            (k.renderer.rules.code_inline = (w, O, q, R, fe) => {
              console.log(w, O, q, R, fe);
              let E = [];
              w[O].content.includes("%") && !w[O].content.includes('"')
                ? (E = Ce._grammar.textHighlight(`"${w[O].content}"`))
                : (E = Ce._grammar.textHighlight(w[O].content));
              let Z = "";
              return (
                E.forEach((we) => {
                  Z += we.html;
                }),
                `<code class="mtkback-inline">${Z}</code>`
              );
            });
        },
        x = Oi({
          html: !0,
          highlight: (k, W) => {
            let ie = Ce._grammar.textHighlight(k),
              de = "";
            ie.forEach((O) => {
              de += O.html;
            }),
              console.log(de);
            let w = 100 - de.length;
            return `<pre class="mtkback">${de.padEnd(w, " ")}</pre>`;
          },
        });
      x.linkify.set({ fuzzyLink: !1 });
      let $;
      Bi(
        {
          block: {
            ruler: {
              before: (k, W, ie) => {
                $ = ie;
              },
            },
          },
        },
        () => {},
      ),
        x.block.ruler.before("fence", "front_matter", $, {
          alt: ["paragraph", "reference", "blockquote", "list"],
        });
      let N = x.use(P).render(e.markdown),
        F = Fi();
      return `<!DOCTYPE html>
			<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <!--
                        Use a content security policy to only allow loading images from https or from our extension directory,
                        and only allow scripts that have a specific nonce.
                    -->
					<!--
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${F}';">
					--> 
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

					




                    <title>Create new vex project</title>
					<style>
						${this._grammar.getCSSRules()}
					</style>

                </head>


                <body>
                    ${N}
				</body>
			</html>`;
    }
  },
  Mt = Ce;
(Mt.viewType = "general.commandHelp"), (Mt._isRunning = !1);
((t) =>
  (t.mdFolderNames = new Map([
    ["V5_cpp", "V5 CPP"],
    ["V5_python", "V5 Python"],
    ["EXP_cpp", "EXP CPP"],
    ["EXP_python", "EXP Python"],
    ["IQ2_cpp", "IQ CPP"],
    ["IQ2_python", "IQ Python"],
  ])))(Mt || (Mt = {}));
function Fi() {
  let y = "",
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let e = 0; e < 32; e++)
    y += t.charAt(Math.floor(Math.random() * t.length));
  return y;
}
function Qs(y, t) {
  return ((t << 5) - t + y) | 0;
}
function Xi(y) {
  let t = Qs(149417, 0);
  for (let e = 0, o = y.length; e < o; e++) t = Qs(y.charCodeAt(e), t);
  return t;
}
var Gt = L(require("path")),
  Ke = L(require("os")),
  Ks = L(require("fs"));
var So;
((Ji) => {
  let y,
    t,
    e,
    o,
    s,
    r,
    n,
    a,
    c,
    l,
    p,
    f,
    U = !1,
    P = !1,
    x = !1,
    $;
  async function N(m, u) {
    (i.Extension.context = m),
      (y = m),
      (t = u),
      await i.Extension.setVexlogColor();
    let v = await new h(i.Extension.getVexcomUri(y).fsPath, "").getVersion();
    E(i.Utils._toCommandResponse(v));
    let C = JSON.parse(v.stdout);
    (i.Extension.vexcomVersion = C.app),
      t.appendLine(`VEXCOM Version:        ${C.app.version} ${C.app.date}`),
      t.appendLine("");
    let I = (z, Y = "") => t.appendLine(`${z}`);
    (r = new Mo(y)), (n = new yo(y, C));
    let B =
      d.workspace
        .getConfiguration()
        .get(
          i.Extension.Settings.enableAI3dCameraUserTerminalID,
          d.ConfigurationTarget.Global,
        )
        .toString() === "Enable";
    d.window.registerTreeDataProvider("vex-sidebar-view", r),
      d.window.registerWebviewViewProvider("vex-sidebar-home-webview", n),
      (a = new Mt(y)),
      a.initMarkList(),
      (e = new pe(y, I)),
      (o = new ot(y, I));
    let T = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.hostNameID, d.ConfigurationTarget.Global)
        .toString(),
      me = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.portID, d.ConfigurationTarget.Global);
    if (
      (($ = new Jt({ port: me, host: T }, I)),
      d.workspace
        .getConfiguration()
        .get(
          i.Extension.Settings.enableWebsocketServerID,
          d.ConfigurationTarget.Global,
        )
        .toString() === "Enable")
    ) {
      p?.write(`Starting VEX Websocket ${$.websocketServer.address()}`);
      let z = d.workspace
          .getConfiguration()
          .get(i.Extension.Settings.hostNameID, d.ConfigurationTarget.Global)
          .toString(),
        Y = d.workspace
          .getConfiguration()
          .get(i.Extension.Settings.portID, d.ConfigurationTarget.Global);
      $.start({ port: Y, host: z });
    }
    $.on("connection", (z, Y) => {
      let ze = $.deviceWSList.concat($.vscodeWSList);
      if (Y.url.includes($.deviceURL)) {
        let ge = ee.colorText(
          `Device Websocket Connection: ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}`,
          ee.TextColors.green,
        );
        p.write(`${ge}\r
`),
          z.on("message", (xe) => {
            let vt = ee.colorText(
              `ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}->`,
              ee.TextColors.cyan,
            );
            p.write(`${vt}${xe}`);
          });
      } else if (Y.url.includes($.vscodeURL)) {
        let ge = ee.colorText(
          `VEX Command Websocket Connection: ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}`,
          ee.TextColors.green,
        );
        p.write(`${ge}\r
`),
          z.on("message", (xe) => {
            let vt = ee.colorText(
                `ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}->`,
                ee.TextColors.blue,
              ),
              ho = xe.toString().split(" "),
              Wo = ho.shift().toString();
            d.commands.executeCommand(Wo, ho).then((xo) => {
              z.send(JSON.stringify(xo));
            }),
              p.write(`${vt}${xe}\r
`);
          });
      }
      z.on("close", () => {
        let ge;
        Y.url.includes($.deviceURL)
          ? (ge = ee.colorText(
              `Device Websocket Disconnected: ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}`,
              ee.TextColors.red,
            ))
          : Y.url.includes($.vscodeURL) &&
            (ge = ee.colorText(
              `VEX Command Websocket Disconnected: ws://${Y.socket.remoteAddress}:${Y.socket.remotePort}`,
              ee.TextColors.red,
            )),
          p?.write(`${ge}\r
`);
      });
    }),
      (s = new Zt(y)),
      (c = new He(y)),
      o.On("Build-Data", (z) => {
        l.writeBuildText(z);
      }),
      o.On("Build-Errors", (z, Y) => {
        switch (z) {
          case ot.BuildErrorCodes.NOT_DEFINED_SDK:
          case ot.BuildErrorCodes.MISSING_SDK:
            o.selectedProject.readProjectSettings().project.language === "cpp"
              ? o.checkCppSdk(o.selectedProject)
              : o.selectedProject.readProjectSettings().project.language ===
                  "python" && o.checkPythonSdk(o.selectedProject),
              l.write(Y);
            break;
          case ot.BuildErrorCodes.MAKE_DOES_NOT_EXIST:
          case ot.BuildErrorCodes.TOOLCHAIN_DOES_NOT_EXIST:
          case ot.BuildErrorCodes.NOT_DEFINED_TOOLCHAIN:
            o.checkToolchain(!0), l.write(Y);
            break;
          case ot.BuildErrorCodes.COMPILER_ERROR:
            l.writeBuildErrorText(Y);
            break;
          default:
            l.write(Y);
        }
      }),
      o.On("Build-Exit", (z, Y) => {
        z === void 0 || z !== 0
          ? t.appendLine(
              `[Command]: ${Y} Failed: make process closed with exit code : ${z}`,
            )
          : t.appendLine(`[Command]: ${Y} Finished: Exit Code ${z}`),
          l.write(`\r
`);
      }),
      setInterval(async () => {
        try {
          if (
            (e.selectedDevice && d.window.state.focused
              ? e.selectedDevice instanceof tt
                ? r.refresh(e.selectedDevice, [e.selectedAIDevice])
                : At()
              : r.refresh(e.selectedDevice, [e.selectedAIDevice]),
            e.selectedAIDevice && d.window.state.focused && !st)
          )
            if (e.selectedAIDevice instanceof Ue)
              if (!e.selectedAIDevice.isAlive)
                E(await e.selectedAIDevice.checkAlive(), !1),
                  r.refresh(e.selectedDevice, [e.selectedAIDevice]);
              else
                try {
                  Bo();
                } catch (z) {
                  console.log(z);
                }
            else
              try {
                Bo();
              } catch (z) {
                console.log(z);
              }
        } catch (z) {
          t.appendLine(`[Error]: ${z}`);
        }
      }, 3e3),
      e.on("VEX_Device_Detected", je),
      e.on("VEX_Device_Disconnected", ue),
      e.on("VEX_DFU_Device_Detected", oe),
      e.on("VEX_DFU_Device_Disconnected", Ee),
      y.subscriptions.push(d.commands.registerCommand(He.slotCmdId, Oo)),
      y.subscriptions.push(d.commands.registerCommand(He.playCmdId, ae)),
      y.subscriptions.push(d.commands.registerCommand(He.stopCmdId, ce)),
      y.subscriptions.push(d.commands.registerCommand(He.buildCmdId, ke)),
      y.subscriptions.push(d.commands.registerCommand(He.listDevicesCmdId, Ae)),
      y.subscriptions.push(
        d.commands.registerCommand(He.selectProjectCmdId, $e),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(He.selectPythonCmdId, Se),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.buildID, gt),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.cleanID, Qt),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.rebuildID, ts),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.newProjectID, os),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.importID, ss),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.settingUIID, is),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.eraseID, ve),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.downloadID, he),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.systemInfoID, At),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.systemInfoAllID, cs),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.screenGrabID, rs),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.brainNameID, ls),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.teamNumberID, ds),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.batteryMedicID, as),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.systemUpdateVEXosID, Eo),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.systemUpdatePythonVmID,
          us,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.controllerUpdateFirmwareID,
          Fo,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.dfuUpdateFirmwareID, Vo),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.uploadEventLogID, ns),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.vexcomVersionID, F),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.installDrivers, gs),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.vexCommandHelpID, ms),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.vexCommandHelpShowAllID,
          Xo,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.downloadSDKID, Q),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.downloadToolchainID, oi),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.clearLogTerminalID, si),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.clearInterativeTerminalID,
          ii,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.createNewTerminalSetID,
          ri,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.controllerUpdateFirmwareAtmelID,
          ai,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.controllerUpdateFirmwareRadioDEVID,
          ni,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.controllerUpdateFirmwareDEVID,
          ci,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.brainUpdateFirmwareDEVID,
          li,
        ),
      ),
      y.subscriptions.push(
        d.commands.registerCommand(i.Extension.Command.downloadAI, async () => {
          if (!(e.selectedAIDevice instanceof Ue)) return;
          let z = d.workspace
              .getConfiguration()
              .get(
                i.Extension.Settings.aiCameraHomeID,
                d.ConfigurationTarget.Global,
              )
              .toString(),
            Y = d.Uri.file(z),
            ze = {
              title: "Update Controller Radio",
              defaultUri: Y,
              canSelectFolders: !1,
              canSelectFiles: !0,
              canSelectMany: !1,
              filters: { deb: ["deb"] },
            },
            ge = await d.window.showOpenDialog(ze);
          if (!ge) {
            d.window.showWarningMessage("No VEXOS File Selected");
            return;
          }
          let xe = Gt.basename(ge[0].fsPath),
            vt = d.Uri.file(`/home/root/${xe}`),
            jt = await e.selectedAIDevice.downloadApp(ge[0], vt);
          E(jt);
        }),
      );
    let st = !1;
    y.subscriptions.push(
      d.commands.registerCommand(
        i.Extension.Command.download3DApp,
        async (z) => {
          if (e.selectedAIDevice instanceof Ue)
            try {
              if (!z || st) return;
              let Y = e.selectedAIDevice.systemInfo.apps;
              (st = !0), console.log(z);
              let ze = d.workspace
                  .getConfiguration()
                  .get(
                    i.Extension.Settings.aiCameraHomeID,
                    d.ConfigurationTarget.Global,
                  )
                  .toString(),
                ge =
                  await i.Feedback_Extension.ResourceManager.getVEXaiAppVersions(
                    z.name,
                    d.Uri.file(ze),
                  ),
                xe = JSON.parse(ge.json),
                vt = "";
              xe.local.catalog.includes(xe.online.latest) ||
                (await i.Feedback_Extension.ResourceManager.downloadVEXaiApp(
                  z.name,
                ));
              let jt = await e.selectedAIDevice.clear();
              if (
                (E(jt, !1),
                Y.forEach(async (Ot) => {
                  if (
                    e.selectedAIDevice instanceof Ue &&
                    Ot.Package !== "vexupdate" &&
                    !(Ot.Package === z.name && z.appMissing)
                  ) {
                    let bo = await e.selectedAIDevice.systemCtlService(
                      `${Ot.Package}.service`,
                      "stop",
                    );
                    E(bo, !1);
                  }
                }),
                !z.appMissing)
              ) {
                let Ot = z.name + ".service",
                  bo = await e.selectedAIDevice.removeApp(Ot);
                E(bo, !1);
              }
              (ge =
                await i.Feedback_Extension.ResourceManager.getVEXaiAppVersions(
                  z.name,
                  d.Uri.file(ze),
                )),
                (xe = JSON.parse(ge.json));
              let ho = Gt.basename(xe.local.latest),
                Wo = d.Uri.joinPath(d.Uri.file(ze), "3d", "apps", ho + ".deb"),
                xo = d.Uri.file(`/home/root/${ho}.deb`),
                vs = await e.selectedAIDevice.downloadApp(Wo, xo);
              if ((E(vs), vs.statusCode === A.StatusCodes.port_not_open)) {
                st = !1;
                return;
              }
              (ge = await e.selectedAIDevice.installApp(xo)),
                JSON.parse(ge.json).exitcode === 0
                  ? (E(ge, !1),
                    d.window.showInformationMessage("VEXAI: Install Success"))
                  : E(ge),
                Y.forEach(async (Ot) => {
                  if (Ot.Package !== "vexupdate") {
                    if (!(e.selectedAIDevice instanceof Ue)) return;
                    let bo = await e.selectedAIDevice.systemCtlService(
                      `${Ot.Package}.service`,
                      "start",
                    );
                    E(bo, !1);
                  }
                });
              let di = await e.selectedAIDevice.removeFile(xo.path);
              E(di);
              let pi = await e.selectedAIDevice.systemCtlService(
                z.name,
                "start",
              );
              E(pi), At(), (st = !1);
            } catch (Y) {
              console.log(Y), (st = !1);
            }
        },
      ),
    ),
      y.subscriptions.push(
        d.commands.registerCommand(
          i.Extension.Command.TEST_COMMAND,
          async () => {
            if (!(e.selectedAIDevice instanceof Ue) || !e.selectedAIDevice)
              return;
            let z = await e.selectedAIDevice.resetTerminal();
            E(z);
          },
        ),
      ),
      await Ho(),
      o
        .setup()
        .then(async () => {
          let z = d.Uri.joinPath(y.globalStorageUri, "buildText");
          if (
            (ee.Log.setBuildLogFileHome(z),
            ee.Log.clearTempLog(),
            o.selectedProject)
          ) {
            i.Extension.Context.setIsValidProject(!0),
              (c.selectProjectBtn.text = o.selectedProject.name);
            let Y = o.selectedProject.readProjectSettings();
            Y.project.language === i.Language.python &&
              ((c.selectPythonFileBtn.text = `$(python-qp)${Gt.basename(Y.project.python.main)}`),
              c.selectPythonFileBtn.show()),
              (c.selectSlotBtn.text = `$(vex-slot) Slot ${Y.project.slot}`),
              c.deviceListBtn.show(),
              c.selectSlotBtn.show(),
              c.buildBtn.show(),
              c.playBtn.show(),
              c.stopBtn.show(),
              c.selectProjectBtn.show();
            let ze = !1;
            if (
              (d.window.terminals.forEach((xe) => {
                (xe.name === "Log" || xe.name === "Interactive Terminal") &&
                  (xe.dispose(), (ze = !0));
              }),
              ze && (await i.Utils.asyncSleep(500)),
              (l = new ee.Log()),
              d.workspace
                .getConfiguration()
                .get(
                  i.Extension.Settings.enableUserTerminalID,
                  d.ConfigurationTarget.Global,
                )
                .toString() === "Enable"
                ? ((p = new ee.Interactive("Interactive Terminal", l.terminal)),
                  l.terminal.show(),
                  p.terminal.show())
                : l.terminal.show(),
              !s.exist)
            ) {
              let xe = await s.download();
              xe.statusCode !== 200 && E(xe);
            }
          } else i.Extension.Context.setIsValidProject(!1);
          ps();
        })
        .then(async () => {})
        .catch((z) => {
          t.appendLine(`${z}`);
        })
        .finally(() => {
          e.startSearch();
        }),
      d.workspace.onDidRenameFiles((z) => {
        if (!o.selectedProject) return;
        let Y = o.selectedProject.readProjectSettings();
        if (Y.project.language !== "python") return;
        let ze = Y.project.python.main.replace(Gt.sep, "\\");
        (ze = Y.project.python.main.replace(String.fromCharCode(92), "\\")),
          (ze = Y.project.python.main.replace(String.fromCharCode(47), "\\"));
        let ge = d.Uri.joinPath(o.selectedProject.projectUri, ze);
        z.files.forEach((xe) => {
          xe.oldUri.fsPath === ge.fsPath &&
            xe.oldUri.fsPath.includes(".py") &&
            xe.newUri.fsPath.includes(".py") &&
            xe.oldUri.fsPath.includes(o.selectedProject.projectUri.fsPath) &&
            ((Y.project.python.main = d.workspace.asRelativePath(xe.newUri)),
            o.selectedProject.writeProjectSettings(Y),
            (c.selectPythonFileBtn.text = `$(python-qp)${Gt.basename(Y.project.python.main)}`),
            o.selectedProject.writeProjectSettings(Y));
        });
      }),
      d.workspace.onDidChangeConfiguration(de);
  }
  Ji.setup = N;
  async function F() {
    return {
      command: i.Extension.Command.vexcomVersionID,
      details: "Vexcom Version Info",
      json: JSON.stringify(i.Extension.vexcomVersion),
      statusCode: 0,
    };
  }
  Ji.vexcomVersion = F;
  async function k() {
    n.resetProgressState(),
      e.selectedDevice &&
        e.selectedDevice instanceof H &&
        e.selectedDevice.userPort.close(),
      e.selectedAIDevice &&
        e.selectedAIDevice instanceof Ue &&
        (e.selectedAIDevice.userPort.close(),
        e.selectedAIDevice.comsPort.close()),
      $.stop(),
      t.appendLine(""),
      t.appendLine(
        "======================== VEX Extension Deactivated ========================",
      ),
      t.appendLine("");
  }
  Ji.shutDown = k;
  async function W() {}
  Ji.postExtensionSetup = W;
  async function ie(m = !0) {
    if (!(e.selectedAIDevice instanceof Ue) || !e.selectedAIDevice) return;
    m &&
      (f.writeLine(""),
      f.writeLine(""),
      f.writeLine("Reset Terminal", ee.TextColors.yellow),
      f.writeLine(""));
    let u = await e.selectedAIDevice.resetTerminal();
    E(u);
  }
  Ji.resetAITerminal = ie;
  async function de(m) {
    i.Extension.Settings.getChangeSettingsList(m).forEach((b) => {
      switch (b) {
        case i.Extension.Settings.enableUserTerminalID:
          w();
          break;
        case i.Extension.Settings.enableAI3dCameraUserTerminalID:
          i.Extension.Context.isDevEnabled && O();
          break;
        case i.Extension.Settings.enableWebsocketServerID:
          q();
          break;
        default:
          break;
      }
    });
  }
  async function w() {
    if (
      !o.selectedProject ||
      !(e.selectedDevice instanceof H) ||
      e.selectedDevice.bootMode !== _.BootMode.app
    )
      return;
    let u =
      d.workspace
        .getConfiguration()
        .get(
          i.Extension.Settings.enableAI3dCameraUserTerminalID,
          d.ConfigurationTarget.Global,
        )
        .toString() === "Enable";
    if (p && !u) {
      if (
        e.selectedDevice?.userPort?.isOpen &&
        e.selectedDevice.bootMode === _.BootMode.app
      ) {
        let b = e.selectedDevice;
        e.selectedDevice?.userPort?.close((v) => we(v, b));
      }
      if ((p.terminal.dispose(), (p = void 0), e.selectedDevice)) {
        let b =
          e.selectedDevice.robotName === ""
            ? ""
            : `(${e.selectedDevice.robotName}) ${e.selectedDevice.user}`;
        d.window.showInformationMessage(
          `Disabled Interactive Terminal Success: ${e.selectedDevice.platform} ${e.selectedDevice.device} ${b}`,
        );
      }
    } else if (!p && u)
      if (e.selectedDevice)
        await (async () => {
          if (!(e.selectedDevice instanceof H)) return;
          (e.selectedDevice?.userPort ||
            e.selectedDevice.bootMode === _.BootMode.app) &&
            (e.selectedDevice?.userPort?.close(we),
            await i.Utils.asyncSleep(1e3)),
            l?.terminal?.dispose(),
            p?.terminal?.dispose(),
            (l = new ee.Log()),
            (p = new ee.Interactive("Interactive Terminal", l.terminal));
          let v = ee.Log.read();
          await i.Utils.asyncSleep(500),
            l.writeLogText(v),
            l.terminal.show(),
            p.terminal.show(),
            e.selectedDevice?.userPort?.open(Z),
            await i.Utils.asyncSleep(1e3),
            p &&
              (p.registerCB("Input", (I) => {
                e.selectedDevice instanceof H &&
                  e.selectedDevice.userPort.write(I);
              }),
              e.selectedDevice.userPort.registerCallback(
                "OnRecieveData",
                (I) => {
                  I !== void 0 &&
                    (p?.write(I), $.deviceWSList.forEach((D) => D[0].send(I)));
                },
              ));
          let C =
            e.selectedDevice.robotName === ""
              ? ""
              : `(${e.selectedDevice.robotName}) ${e.selectedDevice.user}`;
          d.window.showInformationMessage(
            `Enable Interactive Terminal Success: ${e.selectedDevice.platform} ${e.selectedDevice.device} ${C}`,
          );
        })().catch(async (v) => {
          d.window.showErrorMessage(
            `Enable Interactive Terminal Error: ${v.message}`,
          ),
            await d.workspace
              .getConfiguration()
              .update(
                i.Extension.Settings.enableUserTerminalID,
                "Disable",
                d.ConfigurationTarget.Global,
              );
        });
      else {
        l?.terminal && l?.terminal?.dispose(),
          (l = new ee.Log()),
          (p = new ee.Interactive("Interactive Terminal", l.terminal));
        let b = ee.Log.read();
        await i.Utils.asyncSleep(500),
          l.writeLogText(b),
          l.terminal.show(),
          p.terminal.show();
      }
  }
  async function O() {
    if (
      !(e.selectedAIDevice instanceof Ue) ||
      e.selectedAIDevice.bootMode !== _.BootMode.app
    )
      return;
    let u =
      d.workspace
        .getConfiguration()
        .get(
          i.Extension.Settings.enableAI3dCameraUserTerminalID,
          d.ConfigurationTarget.Global,
        )
        .toString() === "Enable";
    if (f && !u) {
      if (
        e.selectedAIDevice?.userPort?.isOpen &&
        e.selectedAIDevice.bootMode === _.BootMode.app
      ) {
        let b = e.selectedDevice;
        e.selectedAIDevice?.userPort?.close((v) => Re(v, b));
      }
      if (
        (f.terminal.dispose(),
        (f = void 0),
        e.selectedAIDevice instanceof Ue && e.selectedAIDevice)
      ) {
        let b =
          e.selectedAIDevice.ssid === ""
            ? ""
            : `(${e.selectedAIDevice.ssid}) ${e.selectedAIDevice.user}`;
        d.window.showInformationMessage(
          `Disabled Interactive Terminal Success: ${e.selectedAIDevice.platform} ${e.selectedAIDevice.device} ${b}`,
        );
      }
    } else
      !f &&
        u &&
        (e.selectedAIDevice
          ? await (async () => {
              if (!(e.selectedAIDevice instanceof Ue)) return;
              (e.selectedAIDevice?.userPort ||
                e.selectedAIDevice.bootMode === _.BootMode.app) &&
                (e.selectedAIDevice?.userPort?.close(Re),
                await i.Utils.asyncSleep(1e3)),
                f?.terminal?.dispose(),
                (f = new ee.Interactive("AI Terminal")),
                f.registerCB("Input", (I) => {
                  e.selectedAIDevice instanceof Ue &&
                    e.selectedAIDevice.userPort.write(I);
                }),
                e.selectedAIDevice.userPort.registerCallback(
                  "OnRecieveData",
                  (I) => {
                    I !== void 0 && f?.write(I);
                  },
                ),
                f.terminal.show();
              let v = !1,
                C;
              for (
                e.selectedAIDevice?.userPort?.open((I) => {
                  Ze(I, !1, !1),
                    e.selectedAIDevice instanceof Ue &&
                      I &&
                      ((C = new Error(I)), (v = !0));
                });
                !e.selectedAIDevice.userPort.isOpen && !v;

              )
                await i.Utils.asyncSleep(500);
              if (v) throw C;
            })()
              .then(() => {
                if (!(e.selectedAIDevice instanceof Ue)) return;
                e.selectedAIDevice.resetTerminal();
                let v =
                  e.selectedAIDevice.ssid === ""
                    ? ""
                    : `(${e.selectedAIDevice.ssid}) ${e.selectedAIDevice.user}`;
                d.window.showInformationMessage(
                  `Enable Interactive Terminal Success: ${e.selectedAIDevice.platform} ${e.selectedAIDevice.device} ${v}`,
                );
              })
              .catch(async (v) => {
                d.window.showErrorMessage(
                  `Enable Interactive Terminal Error: ${v.message}`,
                ),
                  await d.workspace
                    .getConfiguration()
                    .update(
                      i.Extension.Settings.enableAI3dCameraUserTerminalID,
                      "Disable",
                      d.ConfigurationTarget.Global,
                    );
              })
          : ((f = new ee.Interactive("AI Terminal")), f.terminal.show()));
  }
  async function q() {
    if (
      d.workspace
        .getConfiguration()
        .get(
          i.Extension.Settings.enableWebsocketServerID,
          d.ConfigurationTarget.Global,
        )
        .toString() === "Enable"
    ) {
      let u = d.workspace
          .getConfiguration()
          .get(i.Extension.Settings.hostNameID, d.ConfigurationTarget.Global)
          .toString(),
        b = d.workspace
          .getConfiguration()
          .get(i.Extension.Settings.portID, d.ConfigurationTarget.Global);
      p.writeLine(
        `VEX Websocket Server Enabled ${u} ${b}`,
        ee.TextColors.green,
      ),
        $.start({ port: b, host: u });
    } else
      p.writeLine("VEX Websocket Server Disabled", ee.TextColors.yellow),
        $.stop();
  }
  let R = (m, u) => {
      let b = "";
      u === "Init"
        ? (b =
            m.json === ""
              ? `[Command][${m.command}][${u}]`
              : `[Command][${m.command}][${u}]: ${m.json}`)
        : (b =
            m.details === ""
              ? `[Command][${m.command}][${u}]:`
              : `[Command][${m.command}][${u}]: ${m.details}`),
        t.appendLine(b);
    },
    fe = (m) => {
      let u =
        m.details === ""
          ? `[Command][${m.command}][Info]:`
          : `[Command][${m.command}][Info]: ${m.details}`;
      t.appendLine(u);
    },
    E = (m, u = !0) => {
      let b = m.statusCode === 0 ? ee.TextColors.magenta : ee.TextColors.red,
        v =
          m.details === ""
            ? `[Command][${m.command}][Result]:\r
`
            : `[Command][${m.command}][Result]:${m.details}\r
`,
        C =
          m.details === ""
            ? `[Command][${m.command}][Result]:(${m.statusCode})`
            : `[Command][${m.command}][Result]:(${m.statusCode}) ${m.details}`;
      t.appendLine(C),
        m.statusCode !== 0 &&
          u &&
          d.window.showErrorMessage(
            `${m.details} (${m.statusCode}) - ${m.command}`,
            { detail: `${m.command}` },
          );
    };
  async function Z(m, u = !0) {
    if (!(e.selectedDevice instanceof H)) return;
    let b = "",
      v = ee.TextColors.red;
    if (m)
      m.message.toLowerCase().includes("warning")
        ? ((b = `${m.message}`),
          (v = ee.TextColors.yellow),
          d.window.showWarningMessage(b))
        : ((b = `${e.selectedDevice.robotName === "" ? `${e.selectedDevice.platform} ${e.selectedDevice.device}` : `${e.selectedDevice.platform} ${e.selectedDevice.device} (${e.selectedDevice.robotName})`} ${m}`),
          (v = ee.TextColors.red),
          d.window.showErrorMessage(b));
    else {
      let C =
          e.selectedDevice.robotName === ""
            ? `${e.selectedDevice.platform} ${e.selectedDevice.device}`
            : `${e.selectedDevice.platform} ${e.selectedDevice.device} (${e.selectedDevice.robotName})`,
        I =
          e.selectedDevice instanceof tt
            ? e.selectedDevice.communication
            : e.selectedDevice.user;
      (b = `${C} Success: Opening ${I}`),
        (v = ee.TextColors.green),
        u && d.window.showInformationMessage(b);
    }
    (b += `\r
`),
      t.appendLine(b),
      p && p.write(b, v);
  }
  async function we(m, u) {
    if (!(u instanceof H)) return;
    let b = "",
      v = ee.TextColors.red,
      C =
        u.robotName === ""
          ? `${u.platform} ${u.device}`
          : `${u.platform} ${u.device} (${u.robotName})`;
    if (m && !m?.message.toLowerCase().includes("port is not open"))
      (b = `${C} ${m}`), (v = ee.TextColors.red), d.window.showErrorMessage(b);
    else {
      let I = u instanceof tt ? u.communication : u.user,
        D = `${C} Warning: closed  ${I}`,
        B = ee.TextColors.yellow;
      p?.write(D, B);
    }
    (b += `\r
`),
      t.appendLine(b),
      p && p?.write(b, v);
  }
  async function Ze(m, u = !0, b = !0) {
    if (!(e.selectedAIDevice instanceof Ue)) return;
    let v = "",
      C = ee.TextColors.red;
    m
      ? m.message.toLowerCase().includes("warning")
        ? ((v = `${m.message}`),
          (C = ee.TextColors.yellow),
          d.window.showWarningMessage(v))
        : ((v = `${e.selectedAIDevice.ssid === "" ? `${e.selectedAIDevice.platform} ${e.selectedAIDevice.device}` : `${e.selectedAIDevice.platform} ${e.selectedAIDevice.device} (${e.selectedAIDevice.ssid})`} ${m}`),
          (C = ee.TextColors.red),
          b && d.window.showErrorMessage(v))
      : ((v = `${e.selectedAIDevice.ssid === "" ? `${e.selectedAIDevice.platform} ${e.selectedAIDevice.device}` : `${e.selectedAIDevice.platform} ${e.selectedAIDevice.device} (${e.selectedAIDevice.ssid})`} Success: Opening ${e.selectedAIDevice.user}`),
        (C = ee.TextColors.green),
        u && d.window.showInformationMessage(v)),
      (v += `\r
`),
      t.appendLine(v),
      f && f.write(v, C);
  }
  async function Re(m, u) {
    if (!(u instanceof Ue)) return;
    let b = "",
      v = ee.TextColors.red,
      C =
        u.ssid === ""
          ? `${u.platform} ${u.device}`
          : `${u.platform} ${u.device} (${u.ssid})`;
    if (m && !m?.message.toLowerCase().includes("port is not open"))
      (b = `${C} ${m}`), (v = ee.TextColors.red), d.window.showErrorMessage(b);
    else {
      let I = u.user,
        D = `${C} Warning: closed  ${I}`,
        B = ee.TextColors.yellow;
      p?.write(D, B);
    }
    (b += `\r
`),
      t.appendLine(b),
      f && f?.write(b, v);
  }
  async function je(m, u) {
    console.log("Device Manager", e.activeDeviceList),
      m.platform === i.Platform.AI && m.device === i.Device.Camera_3D
        ? i.Extension.Context.isDevEnabled && Vt(m, u)
        : (!e.selectedDevice || u) && ye(m, u);
  }
  async function ue(m) {
    console.log("Device Manager", e.activeDeviceList),
      m.platform === i.Platform.AI && m.device === i.Device.Camera_3D
        ? i.Extension.Context.isDevEnabled && X(m)
        : re(m);
  }
  async function oe(m, u) {
    console.log("Device Manager", e.activeDeviceList),
      m.platform === i.Platform.AI && m.device === i.Device.Camera_3D
        ? i.Extension.Context.isDevEnabled && G(m, u)
        : (!e.selectedDevice || u) && Ie(m, u);
  }
  async function Ee(m) {
    console.log("Device Manager", e.activeDeviceList),
      m.platform === i.Platform.AI && m.device === i.Device.Camera_3D
        ? i.Extension.Context.isDevEnabled && Et(m)
        : K(m);
  }
  async function ye(m, u) {
    c.deviceListBtn.show();
    let v =
        d.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.enableUserTerminalID,
            d.ConfigurationTarget.Global,
          )
          .toString() === "Enable",
      C,
      I = "",
      D;
    if (((C = wo.createDevice(m)), m.device === i.Device.Brain)) {
      if (((e.selectedDevice = C), !(e.selectedDevice instanceof H))) return;
      u && ((D = await e.selectedDevice.systemInfo()), E(D, !1)),
        o.selectedProject &&
          v &&
          e.selectedDevice.bootMode === _.BootMode.app &&
          e.selectedDevice.userPort.open(Z),
        (I = C.vexComSystemInfo.brain.name
          ? `( ${C.vexComSystemInfo.brain.name} )`
          : `( ${C.bootMode} )`),
        e
          .checkSystemVEXOS(C)
          .then((T) => {
            if (e.selectedDevice instanceof H)
              return (
                E(T, !1),
                (e.selectedDevice.needsVexosUpdate = Boolean(T.statusCode)),
                r.refresh(e.selectedDevice, [e.selectedAIDevice]),
                T
              );
          })
          .then(
            (T) => (
              C.json && r.refresh(e.selectedDevice, [e.selectedAIDevice]),
              T.statusCode
                ? d.window.showInformationMessage(T.details, "Update", "Ignore")
                : "Ignore"
            ),
          )
          .then((T) => {
            if (T === "Update") return Eo();
          })
          .then((T) => {
            !T ||
              (m.platform === i.Platform.V5 &&
                T.statusCode === h.ExitCode.vexSucess &&
                d.window.showInformationMessage(
                  "VEXos Update Complete: Power Cycle V5 Brain",
                ),
              d.commands.executeCommand(
                "setContext",
                `${i.Extension.id}.vexosBrainUpdateInProgress`,
                !1,
              ));
          })
          .catch((T) => {
            d.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexosBrainUpdateInProgress`,
              !1,
            );
            let me = {
              command: "check vexos",
              details: T.message,
              json: "",
              statusCode: -1,
            };
            T.message.includes("Cancel Clicked") ? E(me, !1) : E(me);
          });
    } else if (
      m.device === i.Device.Controller &&
      m.platform !== i.Platform.V5
    ) {
      if (((e.selectedDevice = C), !(e.selectedDevice instanceof H))) return;
      u && ((D = await e.selectedDevice.systemInfo()), E(D, !1)),
        o.selectedProject &&
          v &&
          e.selectedDevice.bootMode === _.BootMode.app &&
          e.selectedDevice.userPort.open(Z),
        (I = C?.vexComSystemInfo?.brain?.name
          ? `( ${C.vexComSystemInfo.brain.name} )`
          : ""),
        C.platform !== i.Platform.V5 &&
          e
            .checkControllerVEXOS(C)
            .then((T) => {
              if ((E(T, !1), e.selectedDevice)) {
                if (!(e.selectedDevice instanceof H)) return;
                (e.selectedDevice.needsVexosUpdate = Boolean(T.statusCode)),
                  r.refresh(e.selectedDevice, [e.selectedAIDevice]);
              } else return "Ignore";
              return T;
            })
            .then(
              (T) => (
                C.json && r.refresh(e.selectedDevice, [e.selectedAIDevice]),
                T.statusCode
                  ? d.window.showInformationMessage(
                      T.details,
                      "Update",
                      "Ignore",
                    )
                  : "Ignore"
              ),
            )
            .then((T) => {
              if (T === "Update") return Fo();
            })
            .then((T) => {
              d.commands.executeCommand(
                "setContext",
                `${i.Extension.id}.vexosControllerUpdateInProgress`,
                !1,
              );
            })
            .catch((T) => {
              d.commands.executeCommand(
                "setContext",
                `${i.Extension.id}.vexosControllerUpdateInProgress`,
                !1,
              );
              let me = {
                command: "check vexos",
                details: T.message,
                json: "",
                statusCode: -1,
              };
              T.message.includes("Cancel Clicked") ? E(me, !1) : E(me);
            });
    } else if (
      m.device === i.Device.Controller &&
      m.platform === i.Platform.V5
    ) {
      if (((e.selectedDevice = C), !(e.selectedDevice instanceof H))) return;
      u && ((D = await e.selectedDevice.systemInfo()), E(D, !1)),
        o.selectedProject &&
          v &&
          e.selectedDevice.bootMode === _.BootMode.app &&
          e.selectedDevice.userPort.open(Z).then((T) => {
            T.statusCode === h.ExitCode.vexError ? E(T, !1) : E(T);
          }),
        (I = C?.vexComSystemInfo?.brain?.name
          ? `( ${C.vexComSystemInfo.brain.name} )`
          : "");
    }
    C.json && r.refresh(e.selectedDevice, [e.selectedAIDevice]),
      d.window.showInformationMessage(
        `${m.platform} ${m.device} ${I} Connected`,
      );
    let B = d.workspace
      .getConfiguration()
      .get(i.Extension.Settings.buildTypeID, d.ConfigurationTarget.Global)
      .toString();
    (c.buildBtn.text = "$(vex-download)"),
      (c.buildBtn.tooltip = `${B} and Download`),
      (c.deviceListBtn.text = `$(vex-${m.platform}-${m.device}) ${I}`),
      !!o.selectedProject &&
        e.selectedDevice instanceof H &&
        (p &&
          p.registerCB("Input", (T) => {
            C.userPort.write(T);
          }),
        e.selectedDevice?.userPort &&
          e.selectedDevice.userPort.registerCallback("OnRecieveData", (T) => {
            T !== void 0 &&
              ($.deviceWSList.length &&
                e.selectedDevice instanceof H &&
                p.write(
                  `${e.selectedDevice.platform} ${e.selectedDevice.device} ( ${e.selectedDevice.robotName} )->`,
                  ee.TextColors.magenta,
                ),
              p.write(T),
              $.deviceWSList.forEach((me) => me[0].send(T)));
          }));
  }
  async function re(m) {
    if (
      (d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosControllerUpdateInProgress`,
        !1,
      ),
      d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosBrainUpdateInProgress`,
        !1,
      ),
      e.selectedDevice instanceof H &&
        m.communication === e.selectedDevice.communication)
    ) {
      let u = e.selectedDevice.device,
        b = "";
      if (
        (u === i.Device.Brain
          ? (b = e.selectedDevice.vexComSystemInfo.brain.name
              ? `( ${e.selectedDevice.vexComSystemInfo.brain.name} )`
              : `( ${e.selectedDevice.bootMode} )`)
          : u === i.Device.Controller && (b = ""),
        !(e.selectedDevice instanceof H))
      )
        return;
      if (e.selectedDevice.bootMode === _.BootMode.app) {
        let C = e.selectedDevice;
        e.selectedDevice?.userPort?.close((I) => we(I, C));
      }
      d.window.showWarningMessage(
        `${m.platform} ${m.device} ${b} Disconnected`,
      ),
        (e.selectedDevice = void 0);
      let v = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.buildTypeID, d.ConfigurationTarget.Global)
        .toString();
      if (e.activeDeviceList.length) {
        let C = {
          communication: "",
          bootMode: _.BootMode.unknown,
          user: "",
          device: i.Device.Unknown,
          platform: i.Platform.Unknown,
          robotName: "",
          id: "",
          teamNumber: "",
          json: "",
        };
        if (o?.selectedProject) {
          let I = o.selectedProject.readProjectSettings(),
            D = e.activeDeviceList.filter(
              (B) => I.project.platform === B.platform,
            );
          C = D.length >= 1 ? D[0] : e.activeDeviceList[0];
        } else C = e.activeDeviceList[0];
        je(C);
      } else if (e.activeDFUDeviceList.length) {
        let C = {
          bootMode: _.BootMode.dfu,
          device: i.Device.Unknown,
          id: 0,
          pid: "",
          platform: i.Platform.Unknown,
          vid: "",
        };
        if (o?.selectedProject) {
          let I = o.selectedProject.readProjectSettings(),
            D = e.activeDFUDeviceList.filter(
              (B) => I.project.platform === B.platform,
            );
          C = D.length >= 1 ? D[0] : e.activeDFUDeviceList[0];
        } else C = e.activeDFUDeviceList[0];
        oe(C);
      } else
        (c.deviceListBtn.text = ""),
          c.deviceListBtn.hide(),
          (c.buildBtn.text = "$(vex-build)"),
          (c.buildBtn.tooltip = `${v} User Program`),
          r.clearSD(),
          o.selectedProject || c.deviceListBtn.hide();
    }
  }
  async function Ie(m, u) {
    if (!e.selectedDevice || u) {
      if (e.selectedDevice instanceof H) {
        let C = e.selectedDevice;
        if (e.selectedDevice.bootMode === _.BootMode.app) {
          let I = e.selectedDevice;
          e.selectedDevice?.userPort?.close((D) => we(D, I));
        }
      }
      let b = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.buildTypeID, d.ConfigurationTarget.Global)
        .toString();
      if (
        ((e.selectedDevice = _o.createDevice(m)),
        (c.buildBtn.text = "$(vex-download)"),
        (c.buildBtn.tooltip = `${b} and Download`),
        (c.deviceListBtn.text = `$(vex-${m.platform}-${m.device}) ${m.bootMode}`),
        c.deviceListBtn.show(),
        r.refresh(e.selectedDevice, [e.selectedAIDevice]),
        !(e.selectedDevice instanceof Fe) ||
          e.selectedDevice.activeCommand ===
            h.CommandID.controllerRadioUpdate ||
          e.selectedDevice.activeCommand === h.CommandID.controllerUsbUpdate ||
          e.selectedDevice.activeCommand === h.CommandID.recoverDFU)
      )
        return;
      let v = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.dfuAutoRecover, d.ConfigurationTarget.Global);
      ((m.device === i.Device.Brain && v) ||
        (await d.window.showInformationMessage(
          `${m.platform} ${m.device} (DFU) Detected.  Would you like to recover?`,
          "Recover",
        )) === "Recover") &&
        Vo();
    }
  }
  async function K(m, u) {
    if (
      m.platform === e.selectedDevice.platform &&
      m.device === e.selectedDevice.device &&
      m.bootMode === e.selectedDevice.bootMode
    ) {
      (e.selectedDevice = void 0),
        r.clearSD(),
        d.window.showWarningMessage(
          `${m.platform} ${m.device} (DFU) Disconnected`,
        );
      let b = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.buildTypeID, d.ConfigurationTarget.Global)
        .toString();
      if (e.activeDeviceList.length) {
        let v = {
          communication: "",
          bootMode: _.BootMode.unknown,
          user: "",
          device: i.Device.Unknown,
          platform: i.Platform.Unknown,
          robotName: "",
          id: "",
          teamNumber: "",
          json: "",
        };
        if (o?.selectedProject) {
          let C = o.selectedProject.readProjectSettings(),
            I = e.activeDeviceList.filter(
              (D) => C.project.platform === D.platform,
            );
          v = I.length >= 1 ? I[0] : e.activeDeviceList[0];
        } else v = e.activeDeviceList[0];
        je(v, !0);
      } else if (e.activeDFUDeviceList.length) {
        let v = {
          bootMode: _.BootMode.dfu,
          device: i.Device.Unknown,
          id: 0,
          pid: "",
          platform: i.Platform.Unknown,
          vid: "",
        };
        if (o?.selectedProject) {
          let C = o.selectedProject.readProjectSettings(),
            I = e.activeDFUDeviceList.filter(
              (D) => C.project.platform === D.platform,
            );
          v = I.length >= 1 ? I[0] : e.activeDFUDeviceList[0];
        } else v = e.activeDFUDeviceList[0];
        oe(v, !0);
      } else
        (c.deviceListBtn.text = ""),
          c.deviceListBtn.hide(),
          (c.buildBtn.text = "$(vex-build)"),
          (c.buildBtn.tooltip = `${b} User Program`),
          r.clearSD(),
          o.selectedProject || c.deviceListBtn.hide();
    }
  }
  async function G(m, u) {
    d.window.showInformationMessage(
      `${m.platform} ${m.device} (${m.bootMode}) Detected`,
    );
    let b = _o.createDevice(m);
    b instanceof Wt &&
      (console.log(b),
      d.window.showInformationMessage(
        `${m.platform} ${m.device} (${m.bootMode}) Detected`,
      ),
      r.refresh(e.selectedDevice, [b]),
      e.selectedAIDevice ||
        ((e.selectedAIDevice = b),
        d.window
          .showInformationMessage(
            "VEX AI 3D Camera Update Available",
            "Update",
            "Ignore",
          )
          .then((v) => {
            v === "Update" &&
              d.commands.executeCommand("vex-sidebar-home-webview.focus");
          })));
  }
  async function Et(m) {}
  async function Vt(m, u) {
    d.window.showInformationMessage(`${m.platform} ${m.device} Connected`);
    let b = wo.createDevice(m);
    if (!(b instanceof Ue)) return;
    let v = b;
    f.writeLine("");
    let C = !1,
      D =
        d.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.enableAI3dCameraUserTerminalID,
            d.ConfigurationTarget.Global,
          )
          .toString() === "Enable";
    D &&
      (v.userPort.registerCallback("OnRecieveData", (T) => {
        T && (C = !0), f.write(T);
      }),
      f.registerCB("Input", (T) => {
        v.userPort.serialPort.write(T, (me) => {
          console.log(me);
        });
      }),
      v.userPort.open(Ze)),
      await i.Utils.asyncSleep(2e3);
    let B = !1;
    for (
      v.comsPort.open((T) => {
        B = !0;
      });
      !B;

    )
      await i.Utils.asyncSleep(500);
    if (b instanceof Ue) {
      for (let T = 0; T < 3; T++)
        if ((E(await v.checkAlive(), !1), v.isAlive)) {
          let me = await v.checkElevate();
          E(me),
            me.statusCode === A.StatusCodes.nack && E(await v.elevate(), !1),
            E(await v.getDeviceInfo()),
            await e.checkVEXaiApps(v),
            (await e.checkVEXaiVersion(v)).statusCode !== 0 &&
              (b.needsUpdate = !0),
            r.refresh(e.selectedDevice, [v]),
            (T = 3),
            (e.selectedAIDevice = v),
            !C && D && ie(!1);
        } else r.refresh(e.selectedDevice, [v]);
      e.selectedAIDevice = v;
    }
  }
  async function X(m) {
    e.selectedAIDevice instanceof Ue &&
      (e.selectedAIDevice.comsPort.serialPort.removeAllListeners(),
      d.window.showWarningMessage(`${m.platform} ${m.device} Disconnected`),
      e.selectedAIDevice.userPort.close(Re),
      (e.selectedAIDevice = void 0),
      r.refresh(e.selectedDevice, [e.selectedAIDevice]));
  }
  async function Se() {
    t.appendLine("[Command]: Select Python File"),
      o.selectedProject.readProjectSettings().project.language === "python" &&
        c.pickPythonFile(o).then((u) => {
          if (u) {
            c.selectPythonFileBtn.text = u.label;
            let b = o.selectedProject.readProjectSettings();
            (b.project.python.main = u.description),
              o.selectedProject.writeProjectSettings(b),
              t.appendLine(
                `[Command]: Select Python File: Selected ${u.label}`,
              ),
              t.appendLine(
                `[Command]: Select Python File: Project Settings ${b}`,
              );
          } else
            t.appendLine("[Command]: Select Python File: No File Selected");
        });
  }
  async function $e() {
    t.appendLine("[Command]: Select Project");
    let m = await c.selectProject(o);
    if (m) {
      o.selectedProject = m;
      let u = o.selectedProject.readProjectSettings();
      (c.selectSlotBtn.text = `$(vex-slot) Slot ${u.project.slot}`),
        (c.selectProjectBtn.text = `${u.project.name}`),
        t.appendLine(`[Command]: Select Project: Selected ${m.name}`),
        u.project.language === "cpp" &&
          (c.selectProjectBtn.show(), c.selectPythonFileBtn.hide()),
        u.project.language === "python" &&
          (c.selectProjectBtn.show(),
          (c.selectPythonFileBtn.text = `$(python-qp)${Gt.basename(u.project.python.main)}`),
          c.selectPythonFileBtn.show());
    } else t.appendLine("[Command]: Select Project: No Project Selected");
  }
  async function Oo() {
    if ((t.appendLine("[Command]: Select Slot"), !o.selectedProject)) {
      t.appendLine(
        "[Command]: Select Slot, No Valid VEX Extension Project Open",
      ),
        d.window.showWarningMessage("No Valid VEX Extension Project Open");
      return;
    }
    c.selectSlot().then((m) => {
      let u = m > 0 && m <= 8 ? `Slot ${m} selected` : "No slot selected";
      if ((t.appendLine(`[Command]: Select Slot: ${u}`), o.selectedProject)) {
        let b = o.selectedProject.readProjectSettings(),
          v = m > 0 && m <= 8 ? m : b.project.slot;
        (b.project.slot = v), o.selectedProject.writeProjectSettings(b);
      }
    });
  }
  async function he() {
    let m = {
        command: i.Extension.Command.downloadID,
        details: "",
        statusCode: -1,
        json: "",
      },
      u;
    if (
      (o.selectedProject
        ? ((u = o.selectedProject.readProjectSettings()),
          t.appendLine(
            `[Command][User Program Download][Init]: ${JSON.stringify({ slotNumber: u.project.slot, sdkVersion: u.project.sdkVersion, projectPlatform: u.project.platform, targetPlatform: e.selectedDevice.platform, language: u.project.language })}`,
          ))
        : t.appendLine("[Command][User Program Download][Init]: {}"),
      !o.selectedProject)
    )
      return (
        (m.details = "No Valid VEX Extension Project Open"),
        t.appendLine(
          "[Command][User Program Download][Error]: Download User Program, No Valid VEX Extension Project Open",
        ),
        m
      );
    if (!e.selectedDevice)
      return (
        (m.details = "No VEX Device Connected"),
        t.appendLine(
          "[Command][User Program Download][Error]: Download User Program, No VEX Device Connected",
        ),
        m
      );
    if (((m = await jo()), m.statusCode !== h.ExitCode.vexSucess)) return m;
    if (e.selectedDevice.platform !== u.project.platform)
      return (
        t.appendLine(`[Command]: Download - Error \r
`),
        t.appendLine(
          `[Command][User Program Download][Error]:Wrong Platform: Expected ${u.project.platform} Device, ${e.selectedDevice.platform} ${e.selectedDevice.device} connected`,
        ),
        {
          command: i.Extension.Command.downloadID,
          details: `Wrong Platform: Expected ${u.project.platform} Device, ${e.selectedDevice.platform} ${e.selectedDevice.device} connected`,
          statusCode: -1,
          json: "",
        }
      );
    let b, v;
    u.project.language === "cpp" &&
      ((b = d.Uri.joinPath(o.selectedProject.projectUri, "build")),
      (v = (await d.workspace.fs.readDirectory(b)).filter((B) =>
        B[0].includes(".bin"),
      )[0][0]),
      (b = d.Uri.joinPath(b, v))),
      u.project.language === "python" &&
        (b = d.Uri.joinPath(
          o.selectedProject.projectUri,
          u.project.python.main,
        ));
    let C = Boolean(
        d.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.runAfterDownload,
            d.ConfigurationTarget.Global,
          ),
      ),
      I;
    if (
      e.selectedDevice instanceof xt ||
      e.selectedDevice instanceof Dt ||
      e.selectedDevice instanceof bt
    )
      l.write(`Downloading User Program\r
`),
        (I = await e.selectedDevice.downloadUserProgram(
          u.project.name,
          u.project.description,
          u.project.slot,
          b,
          C,
        ));
    else if (e.selectedDevice instanceof nt || e.selectedDevice instanceof Ye)
      l.write(`Downloading User Program\r
`),
        (I = await e.selectedDevice.downloadUserProgram(
          u.project.name,
          u.project.description,
          u.project.slot,
          b,
          C,
        ));
    else if (e.selectedDevice instanceof tt) {
      let D = d.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.controllerChannel,
            d.ConfigurationTarget.Global,
          )
          .toString(),
        B = h.DownloadChannel.vexNoChannel;
      D === "Download" && e.selectedDevice.device === "Controller"
        ? (B = h.DownloadChannel.vexDownloadchannel)
        : D === "Pit" && (B = h.DownloadChannel.vexPitChannel),
        l.write(`Downloading User Program\r
`),
        (I = await e.selectedDevice.downloadUserProgram(
          u.project.name,
          u.project.description,
          u.project.slot,
          b,
          C,
          B,
        ));
    } else
      throw new Error(
        `Download Error: Device Not Recognized ${e.selectedDevice.platform} ${e.selectedDevice.device}`,
      );
    return (
      E(I, !1),
      I.statusCode === h.ExitCode.vexAPIErrorFilePath &&
        u.project.language === "python" &&
        Se(),
      I
    );
  }
  async function ae() {
    let m = i.Utils.getBasicCommandResp(h.CommandID.play),
      u = o.selectedProject.readProjectSettings();
    if (
      (u &&
        (m.json = JSON.stringify({
          targetPlatform: e?.selectedDevice ? e?.selectedDevice.platform : "",
          slotNumber: u.project.slot,
        })),
      R(m, "Init"),
      !o.selectedProject)
    ) {
      (m.details = "Play Program, No Valid VEX Extension Project Open"),
        R(m, "Warning"),
        d.window.showWarningMessage("No Valid VEX Extension Project Open");
      return;
    }
    let b = o.selectedProject.readProjectSettings();
    if (
      ((m.details = `Play Slot ${b.project.slot}`),
      R(m, "Info"),
      !e.selectedDevice)
    ) {
      (m.details = `Play Slot ${b.project.slot}, no device connected`),
        R(m, "Error");
      return;
    }
    let v = await jo();
    if (v.statusCode !== h.ExitCode.vexSucess)
      return (v.command = h.CommandID.play), E(v), v;
    if (!!o.selectedProject && e.selectedDevice instanceof H) {
      if (x) {
        (m.details = "Play Program - Command Dropped"), R(m, "Error");
        return;
      }
      return (
        (x = !0),
        e.selectedDevice
          .play(b.project.slot)
          .then((C) => ((x = !1), E(C), C))
          .catch((C) => {
            x = !1;
            let I = JSON.parse(C.message);
            return E(I), I;
          })
      );
    }
  }
  async function ce() {
    let m = i.Utils.getBasicCommandResp(h.CommandID.stop),
      u = o.selectedProject.readProjectSettings();
    if (
      (u &&
        (m.json = JSON.stringify({
          targetPlatform: e?.selectedDevice ? e?.selectedDevice.platform : "",
          slotNumber: u.project.slot,
        })),
      R(m, "Init"),
      P)
    ) {
      (m.details = "Command Dropped"), R(m, "Warning");
      return;
    }
    if (
      (o.selectedProject ||
        ((m.details = "No Valid VEX Extension Project Open"),
        R(m, "Warning"),
        d.window.showWarningMessage(m.details)),
      !e.selectedDevice)
    ) {
      (m.details = "No device connected"), R(m, "Error");
      return;
    }
    let b = await jo();
    if (b.statusCode !== h.ExitCode.vexSucess)
      return (b.command = h.CommandID.stop), E(b), b;
    if (e.selectedDevice instanceof H)
      return (
        (P = !0),
        e.selectedDevice
          .stop()
          .then((v) => ((P = !1), E(v), v))
          .catch((v) => {
            P = !1;
            let C = JSON.parse(v.message);
            return E(C), C;
          })
      );
  }
  async function ve(m) {
    if (!e.selectedDevice) {
      t.appendLine("[Command]: Stop Program, no device connected");
      return;
    }
    if (!H.isTypeOf(e.selectedDevice)) {
      t.appendLine("[Command]: Stop Program, no device connected");
      return;
    }
    let u = await jo();
    if (u.statusCode !== h.ExitCode.vexSucess) return E(u), u;
    let b = m,
      v,
      C;
    if (b)
      (C = {
        slot: m.items[0].data,
        file: m.items[1].data,
        projectType: m.items[2].data,
        size: m.items[3].data,
        time: m.items[4].data,
      }),
        (v = m.name.split(":")[1]);
    else {
      if (!(e.selectedDevice instanceof H)) return;
      let I = e.selectedDevice.vexComSystemInfo,
        D = [];
      I.programs &&
        I.programs.items.forEach((T) => {
          D.push({
            label: `$(vex-slot) Slot ${T.slot + 1}`,
            description: `${T.file}.${T.type}`,
          });
        });
      let B = await d.window.showQuickPick(D, {
        placeHolder: "Select a user program to Erase",
        onDidSelectItem: () => {},
      });
      if (B) {
        let T = new RegExp(/(?<=Slot\s*)(1|2|3|4|5|6|7|8)/),
          me = I.programs.items.filter(
            (so) => `${so.slot + 1}` === T.exec(B.label)[0],
          )[0];
        (C = {
          slot: me.slot,
          file: me.binfile,
          projectType: me.type,
          size: me.size,
          time: me.time,
        }),
          (v = me.file);
      } else return;
    }
    d.window
      .showInformationMessage(
        `Are you sure you want to erase your user program, ${v}?`,
        "Erase",
        "Cancel",
      )
      .then((I) => {
        if (e.selectedDevice instanceof H)
          switch (I) {
            case "Erase":
              t.appendLine(
                `[Command]: Erasing User Program - File: ${C.file} Slot:${C.slot} `,
              ),
                e.selectedDevice
                  .erase(C.file)
                  .then((D) => {
                    if (e.selectedDevice instanceof H)
                      return E(D), e.selectedDevice.systemInfo();
                  })
                  .then((D) => {
                    E(D), r.refresh(e.selectedDevice, [e.selectedAIDevice]);
                  })
                  .catch((D) => {
                    let B = JSON.parse(D.message);
                    E(B);
                  });
              break;
          }
      });
  }
  async function Ae() {
    if (fo || Lt) {
      d.window.showWarningMessage("'List VEX Devices' disabled during update");
      return;
    }
    if (
      !(e.selectedDevice instanceof H) &&
      !(e.selectedDevice instanceof Fe) &&
      c.deviceListBtn.text !== "$(list-unordered)"
    )
      return;
    let m = e.activeDeviceList,
      u = e.activeDFUDeviceList,
      b = !1,
      v = "",
      C = [];
    t.appendLine("[Command]: Select VEX Device"),
      m.length &&
        (m.forEach((D) => {
          let B = "";
          e.selectedDevice instanceof H &&
            ((B = e?.selectedDevice?.communication
              ? e?.selectedDevice?.communication
              : ""),
            (D.robotName !== e.selectedDevice.robotName ||
              D.teamNumber !== e.selectedDevice.teamNumber) &&
              D.communication === e.selectedDevice.communication &&
              D.user === e.selectedDevice.user &&
              e.selectedDevice instanceof H &&
              ((D.communication = e.selectedDevice.communication),
              (D.device = e.selectedDevice.device),
              (D.platform = e.selectedDevice.platform),
              (D.robotName = e.selectedDevice.robotName),
              (D.id = e.selectedDevice.id),
              (D.teamNumber = e.selectedDevice.teamNumber),
              (D.user = e.selectedDevice.user))),
            t.appendLine(`  -${D.platform} ${D.device}:  ${D.robotName} `);
          let T = {
            label: `${D.robotName}`,
            description: `$(vex-${D.platform}-${D.device}) ${D.platform} ${D.device}`,
            detail: `(User):${D.user}   (Comm):${D.communication}`,
          };
          D.communication === B
            ? ((T.label = `$(star-full)${T.label}`), C.unshift(T), (b = !0))
            : C.push(T);
        }),
        (v = "Select VEX Device")),
      u.length &&
        (u.forEach((D) => {
          e.selectedDevice instanceof Fe &&
            C.some((T) => D.bootMode === T.label) &&
            D.bootMode !== e.selectedDevice.bootMode &&
            D.vid === e.selectedDevice.vid &&
            D.pid === e.selectedDevice.pid &&
            e.selectedDevice instanceof Fe &&
            ((D.bootMode = e.selectedDevice.bootMode),
            (D.vid = e.selectedDevice.pid),
            (D.platform = e.selectedDevice.platform)),
            t.appendLine(`  -${D.platform} ${D.device}:  ${D.bootMode} `);
          let B = {
            label: `${D.bootMode}`,
            description: `$(vex-${D.platform}-${D.device}) ${D.platform} ${D.device}`,
            detail: `(VID):${D.vid}   (PID):${D.pid}`,
          };
          D.bootMode === B.label &&
          B.description.includes(`${D.platform} ${D.device}`) &&
          !b
            ? ((b = !0),
              (B.label = `$(star-full)${B.label}`),
              (B.buttons = [
                {
                  iconPath: new d.ThemeIcon("debug-disconnect"),
                  tooltip: "Disconnect Device",
                },
              ]),
              C.unshift(B))
            : C.push(B);
        }),
        (v = "Select VEX Device")),
      !m.length &&
        !u.length &&
        (t.appendLine("[Command]: No Devices Found"),
        (v = "No VEX Devices Found")),
      e.selectedDevice &&
        C.push({
          label: "$(debug-disconnect)Disconnect Device",
          description: " ",
          detail: " ",
        });
    let I = await d.window.showQuickPick(C, {
      placeHolder: v,
      onDidSelectItem: (D) => {
        D.label.indexOf;
      },
    });
    if (I)
      if (
        (t.appendLine(`[Command]: Selected ${I.label}`),
        e.selectedDevice instanceof H)
      ) {
        let D = m.filter((T) => T.communication === I.detail.split(":")[2])[0],
          B = u.filter((T) => T.bootMode === I.label)[0];
        if (
          e.selectedDevice?.userPort?.isOpen &&
          e.selectedDevice.bootMode === _.BootMode.app
        ) {
          let T = e.selectedDevice;
          e.selectedDevice?.userPort?.close((me) => we(me, T));
        }
        D
          ? je(D, !0)
          : B
            ? oe(B, !0)
            : ((e.selectedDevice = void 0),
              (c.deviceListBtn.text = "$(list-unordered)"));
      } else if (e.selectedDevice instanceof Fe) {
        let D = m.filter((T) => T.communication === I.detail.split(":")[2])[0],
          B = u.filter((T) => T.bootMode === I.label)[0];
        D
          ? je(D, !0)
          : B &&
              (e.selectedDevice.platform !== D?.platform ||
                e.selectedDevice.device !== D?.device)
            ? oe(B, !0)
            : ((e.selectedDevice = void 0),
              (c.deviceListBtn.text = "$(list-unordered)"));
      } else {
        let D = m.filter((T) => T.communication === I.detail.split(":")[2])[0],
          B = u.filter((T) => T.bootMode === I.label)[0];
        D
          ? je(D, !0)
          : B
            ? oe(B, !0)
            : ((e.selectedDevice = void 0),
              (c.deviceListBtn.text = "$(list-unordered)"));
      }
    return (
      I ||
        (e.selectedDevice || (c.deviceListBtn.text = ""),
        t.appendLine("[Command]: No Device Selected ")),
      I
    );
  }
  async function ke() {
    let m = "statusBarBuild",
      u = (C, I) => {
        let D = "";
        if ((e.selectedDevice ? (D += "Download") : (D += "Build"), C))
          if (
            (d.window.showErrorMessage(`${D} Failed: ${I || ""}`),
            typeof I == "string")
          ) {
            let B = I?.toString().includes("Vexcom")
              ? I.toString().split(" |")[0]
              : I;
            l.write(
              `${D} Failed: ${I ? B : ""}\r
\r
`,
              ee.TextColors.red,
            ),
              t.append(`${D} Failed: ${I || ""}`);
          } else
            l.write(
              `${D} Failed: ${I || ""}\r
\r
`,
              ee.TextColors.red,
            ),
              t.append(`

Name:${I.name}
Message:${I.message}
Stack:${I.stack}
`);
        else
          d.window.showInformationMessage(`${D} Finished ${I || ""}`),
            l.write(`${D} Finished ${I || ""}\r
\r
`);
      };
    if ((await d.workspace.saveAll(), o.isBuilding)) return;
    if (e?.selectedDevice && U) {
      t.appendLine("[Command]: Build Sequence In Progress - Command Dropped");
      return;
    }
    U = !0;
    let b = o.selectedProject.readProjectSettings().project.language,
      v;
    switch (b) {
      case "cpp":
        v = async () => ut();
        break;
      case "python":
        v = async () => Ge();
        break;
      default:
        u(!0, `Language Not Support: ${b}`),
          t.appendLine(`Language Not Support: ${b}`);
        return;
    }
    return v()
      .then((C) => (C?.statusCode === 0 ? u(!1) : u(!0, C.details), C))
      .catch((C) => {
        (U = !1), u(!0, C);
      })
      .finally(() => {
        e.selectedDevice
          ? (c.buildBtn.text = "$(vex-download)")
          : (c.buildBtn.text = "$(vex-build)"),
          (U = !1);
      });
  }
  async function Ge() {
    if (
      (t.appendLine(""),
      t.appendLine("Python Build Btn Sequence"),
      (c.buildBtn.text = "$(loading~spin)Downloading..."),
      !e.selectedDevice)
    ) {
      t.appendLine("No Device connected, so python file can't be downloaded"),
        l.write(`No Device connected, so python file can't be downloaded\r
`);
      let b = {
        command: He.buildCmdId,
        details: "No device connected",
        statusCode: 0,
        json: "",
      };
      return (
        d.window.showWarningMessage(
          "No Device connected, so python file can't be downloaded",
        ),
        b
      );
    }
    await i.Extension.Command.systemUpdatePythonVM(!1);
    let m = await i.Extension.Command.downloadUserProgram();
    return m.statusCode !== 0
      ? m
      : {
          command: He.buildCmdId,
          details: "Python Build Sequence Success",
          statusCode: 0,
          json: "",
        };
  }
  async function ut() {
    t.appendLine(""),
      t.appendLine("CPP Build"),
      (c.buildBtn.text = "$(loading~spin)Building...");
    let m = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.buildTypeID, d.ConfigurationTarget.Global)
        .toString(),
      u;
    m === "Rebuild"
      ? (u = async () => i.Extension.Command.rebuild())
      : (u = async () => i.Extension.Command.build());
    let b = await u();
    if (b !== 0 || !e.selectedDevice)
      return {
        command: `${i.Extension.id}.project.${String(m).toLowerCase()}`,
        details:
          b < 0
            ? `${ot.getErrorMessageFromCode(b)}`
            : `Make process closed with exit code: ${b}`,
        statusCode: b,
        json: "",
      };
    c.buildBtn.text = "$(loading~spin)Downloading...";
    let v = await i.Extension.Command.downloadUserProgram();
    return v.statusCode !== 0
      ? v
      : e.selectedDevice instanceof H
        ? (r.refresh(e.selectedDevice, [e.selectedAIDevice]),
          {
            command: He.buildCmdId,
            details: `C++ ${m} Sequence Success`,
            statusCode: 0,
            json: "",
          })
        : void 0;
  }
  async function gt(m) {
    let u = i.Utils.getBasicCommandResp("Build");
    if (o?.selectedProject) {
      let v = o.selectedProject.readProjectSettings();
      u.json = JSON.stringify({
        sdkVersion: v.project.sdkVersion,
        projectPlatform: v.project.platform,
        language: v.project.language,
      });
    }
    if ((R(u, "Init"), !o.selectedProject)) {
      (u.details = "No Valid VEX Extension Project Open"),
        R(u, "Warning"),
        d.window.showWarningMessage(u.details);
      return;
    }
    if (o.selectedProject.language !== i.Language.cpp) {
      (u.details = "Build is only avaliable for C++ Projects"),
        R(u, "Warning"),
        d.window.showWarningMessage(u.details);
      return;
    }
    let b = await o
      .build()
      .then(
        (v) => (
          v === void 0 || v !== 0
            ? ((u.details = `Build Failed: make process closed with exit code : ${v}`),
              R(u, "Error"),
              d.window.showErrorMessage(
                `Clean Project Failed: make process closed with exit code : ${v}`,
              ))
            : ((u.details = `Build Finished: Exit Code ${v}`), R(u, "Success")),
          v
        ),
      )
      .catch(
        (v) => (
          (u.details = v),
          R(u, "Error"),
          d.window.showErrorMessage(`Build Failed - ${u.details}`),
          v
        ),
      );
    if (!m) return b;
  }
  async function Qt(m) {
    let u = i.Utils.getBasicCommandResp("Clean");
    if (o?.selectedProject) {
      let v = o.selectedProject.readProjectSettings();
      u.json = JSON.stringify({
        sdkVersion: v.project.sdkVersion,
        projectPlatform: v.project.platform,
        language: v.project.language,
      });
    }
    if ((R(u, "Init"), !o.selectedProject)) {
      t.appendLine(
        "[Command]: Clean Project, No Valid VEX Extension Project Open",
      ),
        d.window.showWarningMessage("No Valid VEX Extension Project Open");
      return;
    }
    if (o.selectedProject.language !== i.Language.cpp) {
      d.window.showWarningMessage("Clean is only avaliable for C++ Projects");
      return;
    }
    let b = o
      .clean()
      .then(
        (v) => (
          v === void 0 || v !== 0
            ? ((u.details = `Clean Project Failed: make process closed with exit code : ${v}`),
              R(u, "Error"),
              d.window.showErrorMessage(
                `Clean Project Failed: make process closed with exit code : ${v}`,
              ))
            : ((u.details = `Clean Project Finished: Exit Code ${v}`),
              R(u, "Success")),
          v
        ),
      )
      .catch(
        (v) => (
          d.window.showErrorMessage(`Clean Project Failed - ${v}`),
          t.appendLine(`[Command]: Clean Project Error: ${v}`),
          v
        ),
      );
    if (!m) return b;
  }
  async function ts(m) {
    let u = i.Utils.getBasicCommandResp("Rebuild");
    if (o?.selectedProject) {
      let v = o.selectedProject.readProjectSettings();
      u.json = JSON.stringify({
        sdkVersion: v.project.sdkVersion,
        projectPlatform: v.project.platform,
        language: v.project.language,
      });
    }
    if ((R(u, "Init"), !o.selectedProject)) {
      t.appendLine(
        "[Command]: Rebuild Project, No Valid VEX Extension Project Open",
      ),
        d.window.showWarningMessage("No Valid VEX Extension Project Open");
      return;
    }
    if (o.selectedProject.language !== i.Language.cpp) {
      d.window.showWarningMessage("Rebuild is only avaliable for C++ Projects");
      return;
    }
    let b = o
      .rebuild()
      .then(
        (v) => (
          v === void 0 || v !== 0
            ? ((u.details = `Rebuild Failed: make process closed with exit code : ${v}`),
              R(u, "Error"),
              d.window.showErrorMessage(
                `Rebuild Failed: make process closed with exit code : ${v}`,
              ),
              t.appendLine(
                `[Command]: Rebuild Failed: make process closed with exit code : ${v}`,
              ))
            : (R(u, "Success"),
              t.appendLine(`[Command]: Rebuild Finished: Exit Code ${v}`)),
          v
        ),
      )
      .catch(
        (v) => (
          d.window.showErrorMessage("Error: Rebuild Project Failed"),
          d.window.showErrorMessage(`Rebuild Project Failed - ${v}`),
          t.appendLine(`[Command]: Rebuild Project ${v}`),
          v
        ),
      );
    if (!m) return b;
  }
  async function os() {
    t.appendLine("[Command]: New Project"),
      o
        .newProject()
        .then((m) => {
          m
            ? t.appendLine(`[Command]:${m}`)
            : t.appendLine("[Command]: New Project Finished");
        })
        .catch((m) => {
          l.write(
            `${m}\r
`,
            ee.TextColors.red,
          ),
            t.appendLine(`[Command]: New Project ${m}\r
`);
        });
  }
  async function ss() {
    t.appendLine("Import Project"),
      o
        .importProject()
        .then((m) => {
          t.appendLine(`Import Project Finshed: ${m}`);
        })
        .catch((m) => {
          t.appendLine(`[Command]: Import Project Failed: ${m}\r
`),
            d.window.showErrorMessage(`Import Project Failed: ${m.message}`);
        });
  }
  async function is() {
    if (!o.selectedProject) {
      d.window.showErrorMessage("No Project Found");
      return;
    }
    t.appendLine("[Command]: Show Project Settings UI "),
      o
        .showSettingsUI()
        .then(() => {
          t.appendLine("[Command]: Show Project Settings UI Finished "),
            (c.selectProjectBtn.text = o.selectedProject.name);
        })
        .catch((m) => {
          t.appendLine(`[Command]: Show Project Settings Error: ${m}\r
`),
            d.window.showErrorMessage(`Project Settings Invalid:${m.message}`),
            pt.Reset();
        });
  }
  async function rs() {
    let m;
    Ke.type() === "Windows_NT"
      ? (m = d.Uri.joinPath(d.Uri.file(process.env.USERPROFILE), "Documents"))
      : Ke.type() === "Darwin"
        ? (m = d.Uri.joinPath(d.Uri.file(process.env.HOME), "Documents"))
        : Ke.type() === "Linux" &&
          (m = d.Uri.joinPath(d.Uri.file(process.env.HOME), "Documents"));
    let b = {
      defaultUri: o.selectedProject ? o.selectedProject.projectUri : m,
      filters: { png: ["png"] },
    };
    d.window.showSaveDialog(b).then((v) => {
      e.selectedDevice instanceof H &&
        v !== void 0 &&
        e.selectedDevice
          .screenGrab(v)
          .then((C) => {
            E(C),
              C.statusCode === 0 && d.commands.executeCommand("vscode.open", v);
          })
          .catch((C) => {
            let I = JSON.parse(C.message);
            E(I);
          });
    });
  }
  async function ns() {
    let m;
    Ke.type() === "Windows_NT"
      ? (m = d.Uri.joinPath(d.Uri.file(process.env.USERPROFILE), "Documents"))
      : Ke.type() === "Darwin"
        ? (m = d.Uri.joinPath(d.Uri.file(process.env.HOME), "Documents"))
        : Ke.type() === "Linux" &&
          (m = d.Uri.joinPath(d.Uri.file(process.env.HOME), "Documents"));
    let b = {
        defaultUri: o.selectedProject ? o.selectedProject.projectUri : m,
        filters: { vexlog: ["vexlog"], txt: ["txt"] },
      },
      v = await d.window.showSaveDialog(b);
    if (!(e.selectedDevice instanceof H) || v === void 0) return;
    let C = Number(
      d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.logEntriesID, d.ConfigurationTarget.Global),
    );
    e.selectedDevice
      .uploadEventLog(C)
      .then(async (I) => {
        if ((E(I), I.statusCode === 0)) {
          i.Utils.isJsonString(I.json) ||
            (await d.workspace.fs.writeFile(
              v,
              new TextEncoder().encode(I.json),
            ),
            await d.commands.executeCommand("vscode.open", v));
          let B = JSON.parse(I.json),
            T = "";
          B.log.items.forEach((z) => {
            T += `${z.time} (${z.type}) ${z.description}${Ke.EOL}`;
          }),
            await d.workspace.fs.writeFile(v, new TextEncoder().encode(T));
          let me = new d.Position(B.log.count - 1, 0),
            so = await d.workspace.openTextDocument(v),
            st = await d.window.showTextDocument(so);
          st.selections = [new d.Selection(me, me)];
          var D = new d.Range(me, me);
          st.revealRange(D);
        }
      })
      .catch((I) => {
        let D = JSON.parse(I.message);
        E(D);
      });
  }
  async function as() {
    if (e.selectedDevice.platform !== "V5") {
      d.window.showWarningMessage(
        "Battery Medic is only avaliable to VEX V5 Devices",
      );
      return;
    }
    e.selectedDevice instanceof H &&
      e.selectedDevice
        .batteryMedic()
        .then((m) => {
          E(m);
        })
        .catch((m) => {});
  }
  async function At() {
    let m = i.Utils.getBasicCommandResp(i.Extension.Command.systemInfoID);
    if (!(e.selectedDevice instanceof H)) return m;
    if (
      ((m = await e.selectedDevice.systemInfo()),
      E(m, !1),
      m.statusCode !== -7 && r.refresh(e.selectedDevice, [e.selectedAIDevice]),
      m.statusCode === h.ExitCode.vexSucess &&
        !c?.deviceListBtn?.text.includes(e.selectedDevice.robotName))
    ) {
      let u = "";
      e.selectedDevice.device === "Brain"
        ? (u = e.selectedDevice.robotName
            ? `( ${e.selectedDevice.robotName} )`
            : `( ${e.selectedDevice.robotName} )`)
        : e.selectedDevice.device === "Controller" &&
          (u = e.selectedDevice.robotName
            ? `( ${e.selectedDevice.robotName} )`
            : ""),
        (c.deviceListBtn.text = `$(vex-${e.selectedDevice.platform}-${e.selectedDevice.device})  ${u}`);
    }
    return m;
  }
  async function cs() {
    let m = i.Utils.getBasicCommandResp(i.Extension.Command.systemInfoAllID),
      u = {
        app: [],
        rom: [],
        ram: [],
        dfu: [],
        unknown: [],
        selectedDevice: {},
      },
      b;
    for (let v = 0; v < e.activeDeviceList.length; v++) {
      let C = e.activeDeviceList[v];
      C.bootMode === _.BootMode.dfu
        ? u.dfu.push(C)
        : C.bootMode === _.BootMode.rom
          ? u.rom.push(C)
          : C.bootMode === _.BootMode.ram
            ? u.ram.push(C)
            : C.bootMode === _.BootMode.app
              ? u.app.push(C)
              : u.unknown.push(C),
        e.selectedDevice instanceof H &&
          C.communication === e.selectedDevice.communication &&
          ((u.selectedDevice = C),
          (u.selectedDevice.json = (await e.selectedDevice.systemInfo()).json));
    }
    for (let v = 0; v < e.activeDFUDeviceList.length; v++) {
      let C = e.activeDFUDeviceList[v];
      C.bootMode === _.BootMode.dfu
        ? u.dfu.push(C)
        : C.bootMode === _.BootMode.rom
          ? u.rom.push(C)
          : C.bootMode === _.BootMode.ram
            ? u.ram.push(C)
            : C.bootMode === _.BootMode.app
              ? u.app.push(C)
              : u.unknown.push(C),
        e.selectedDevice instanceof Fe &&
          C.id === e.selectedDevice.id &&
          (u.selectedDevice = C);
    }
    return (m.json = JSON.stringify(u)), m;
  }
  async function ls() {
    let u = {
      placeHolder: "Type brain name here . . .",
      validateInput: (B) =>
        B.length > 8
          ? "Name To Long"
          : /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/.test(B)
            ? "Special Charaters not allowed"
            : null,
      title: "Set Brain Name",
    };
    if (!(e.selectedDevice instanceof H)) return;
    let v = await (async () => d.window.showInputBox(u))();
    if (!v) throw new Error("No Brain Name Entered");
    let C = await e.selectedDevice.setRobotName(v);
    E(C), (C = await e.selectedDevice.systemInfo());
    let I = JSON.parse(C.json),
      D;
    I.iq2 && e.selectedDevice.platform === "IQ2" && (D = I.iq2),
      I.exp && e.selectedDevice.platform === "EXP" && (D = I.exp),
      I.v5 && e.selectedDevice.platform === "V5" && (D = I.v5),
      (c.deviceListBtn.text = `$(vex-${e.selectedDevice.platform}-${e.selectedDevice.device})  ${e.selectedDevice.robotName}`),
      E(C),
      r.refresh(e.selectedDevice, [e.selectedAIDevice]);
  }
  async function ds() {
    let u = {
      placeHolder: "Type team number here . . .",
      validateInput: (I) =>
        I.length > 8
          ? "Team Number To Long"
          : /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/.test(I)
            ? "Special Charaters not allowed"
            : null,
      title: "Set Team Number",
    };
    if (!(e.selectedDevice instanceof H)) return;
    let v = await (async () => d.window.showInputBox(u))();
    if (!v) throw new Error("No Team Number Entered");
    let C = await e.selectedDevice.setTeamName(v);
    E(C),
      (C = await e.selectedDevice.systemInfo()),
      E(C),
      r.refresh(e.selectedDevice, [e.selectedAIDevice]);
  }
  async function ps() {
    let m = d.Uri.joinPath(y.globalStorageUri, "vexos"),
      u = d.Uri.joinPath(m, i.Platform.EXP),
      b = d.Uri.joinPath(m, i.Platform.IQ2),
      v = d.Uri.joinPath(m, i.Platform.V5),
      C = JSON.parse(
        (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            i.Platform.EXP,
            m,
          )
        ).json,
      ),
      I = JSON.parse(
        (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            i.Platform.IQ2,
            m,
          )
        ).json,
      ),
      D = JSON.parse(
        (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            i.Platform.V5,
            m,
          )
        ).json,
      );
    t.appendLine(`V5:  ${JSON.stringify(D)}`),
      t.appendLine(`IQ2: ${JSON.stringify(I)}`),
      t.appendLine(`EXP: ${JSON.stringify(C)}`),
      C.online.latest > C.local.latest || !C.local.catalog.length
        ? i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
            i.Platform.EXP,
            u,
          )
        : t.appendLine("EXP: Latest vexos file available locally"),
      I.online.latest > I.local.latest || !I.local.catalog.length
        ? i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
            i.Platform.IQ2,
            b,
          )
        : t.appendLine("IQ2: Latest vexos file available locally"),
      D.online.latest > D.local.latest || !D.local.catalog.length
        ? i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
            i.Platform.V5,
            v,
          )
        : t.appendLine("V5: Latest vexos file available locally");
  }
  async function Zs() {
    let m = d.workspace
        .getConfiguration()
        .get(i.Extension.Settings.aiCameraHomeID, d.ConfigurationTarget.Global)
        .toString(),
      u = d.Uri.file(m),
      b = JSON.parse(
        (await i.Feedback_Extension.ResourceManager.getVEXaiAppListVersions(u))
          .json,
      );
    t.appendLine(`VEXai 3D Camera App Versions: ${JSON.stringify(b)}`);
    let v = [];
    await b.online.apps.forEach(async (C) => {
      let I = await i.Feedback_Extension.ResourceManager.getVEXaiAppVersions(
          C,
          u,
        ),
        D = JSON.parse(I.json);
      D.online.latest > D.local.latest || !D.local.catalog.length
        ? await i.Feedback_Extension.ResourceManager.downloadVEXaiApp(
            D.online.latest,
          )
        : t.appendLine(`VEXai: Latest ${C} available locally`);
    }),
      console.log("finished loop "),
      console.log(v);
  }
  async function Bo() {
    if (!(e.selectedAIDevice instanceof Ue)) return;
    let m = await e.selectedAIDevice.getDeviceInfo();
    E(m, !1),
      m.statusCode !== -7 && r.refresh(e.selectedDevice, [e.selectedAIDevice]);
  }
  let fo = !1;
  async function Eo() {
    if (
      !(
        e.selectedDevice instanceof bt ||
        e.selectedDevice instanceof xt ||
        e.selectedDevice instanceof Dt ||
        e.selectedDevice instanceof tt
      )
    )
      return;
    if (e.selectedDevice instanceof tt) {
      let u = await d.window.showInformationMessage(
        "VEXos System Update",
        {
          detail:
            "Would you like to update VEXos through a V5 Controller?  V5 Controller must be tethered to a V5 brain. VEXos update will take serval minutes to complete.  DO NOT UNPLUG during VEXos update.",
          modal: !0,
        },
        "Update",
      );
      if ((console.log(u), u !== "Update")) return;
    }
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    (fo = !0),
      d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosBrainUpdateInProgress`,
        !0,
      ),
      (async () => {
        if (
          !(
            e.selectedDevice instanceof bt ||
            e.selectedDevice instanceof xt ||
            e.selectedDevice instanceof Dt ||
            e.selectedDevice instanceof tt
          )
        )
          return;
        let u = e.selectedDevice.platform,
          b = d.Uri.joinPath(y.globalStorageUri, "vexos"),
          v = (
            await i.Feedback_Extension.ResourceManager.getVEXosVersions(u, b)
          ).json,
          C = JSON.parse(v),
          I = d.Uri.joinPath(b, u, C.local.latest + ".vexos");
        C.local.catalog.includes(C.online.latest) ||
          (await i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
            u,
            d.Uri.joinPath(b, u),
          ),
          (v = (
            await i.Feedback_Extension.ResourceManager.getVEXosVersions(u, b)
          ).json),
          (C = JSON.parse(v)),
          (I = d.Uri.joinPath(b, u, C.local.latest + ".vexos"))),
          C.local.latest || (I = d.Uri.joinPath(b, u, C.local.latest));
        let D = await e.selectedDevice.systemUpdate(I, !0);
        return (
          D.statusCode === h.ExitCode.vexSucess &&
            e.selectedDevice &&
            (e.selectedDevice.needsVexosUpdate = !1),
          E(D),
          At(),
          D
        );
      })()
        .then(
          (u) => (
            (fo = !1),
            d.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexosBrainUpdateInProgress`,
              !1,
            ),
            (Lt = !1),
            u
          ),
        )
        .catch((u) => {
          throw (
            ((fo = !1),
            (Lt = !1),
            d.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexosBrainUpdateInProgress`,
              !1,
            ),
            new Error(u.message))
          );
        });
  }
  let Lt = !1;
  async function Fo(m, u) {
    if (Lt) {
      d.window.showWarningMessage("Controller Update In Progress");
      return;
    }
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    if (
      (e.selectedDevice.platform !== i.Platform.EXP &&
        e.selectedDevice.platform !== i.Platform.IQ2) ||
      e.selectedDevice.device !== i.Device.Controller
    ) {
      d.window.showWarningMessage(
        `Controller updates not allowed for: ${e.selectedDevice.platform} ${e.selectedDevice.device}`,
      );
      return;
    }
    return (
      (Lt = !0),
      d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosControllerUpdateInProgress`,
        !0,
      ),
      (async () => {
        if (!(e.selectedDevice instanceof Ye || e.selectedDevice instanceof nt))
          return;
        let v = { command: "", details: "", json: "", statusCode: 0 };
        if (
          e.selectedDevice.needsRadioUpdate ||
          e.selectedDevice.needsUsbUpdate
        ) {
          let C = e.selectedDevice.platform,
            I = d.Uri.joinPath(y.globalStorageUri, "vexos"),
            D = (
              await i.Feedback_Extension.ResourceManager.getVEXosVersions(C, I)
            ).json,
            B = JSON.parse(D),
            T = d.Uri.joinPath(I, C, B.local.latest + ".vexos");
          B.local.catalog.includes(B.online.latest) ||
            (await i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
              C,
              d.Uri.joinPath(I, C),
            ),
            (D = (
              await i.Feedback_Extension.ResourceManager.getVEXosVersions(C, I)
            ).json),
            (B = JSON.parse(D)),
            (T = d.Uri.joinPath(I, C, B.local.latest + ".vexos"))),
            e.selectedDevice.needsRadioUpdate && e.selectedDevice.needsUsbUpdate
              ? ((v = await e.selectedDevice.controllerUpdate(T)), E(v, !1))
              : e.selectedDevice.needsRadioUpdate
                ? ((v = await e.selectedDevice.controllerRadioUpdate(T)),
                  At(),
                  E(v, !1))
                : e.selectedDevice.needsUsbUpdate &&
                  ((v = await e.selectedDevice.controllerUsbUpdate(T)),
                  E(v, !1)),
            v.statusCode === h.ExitCode.vexSucess
              ? (e?.selectedDevice && (e.selectedDevice.needsRadioUpdate = !1),
                d.window.showInformationMessage(
                  `${C} Controller Update: Success`,
                ))
              : d.window.showErrorMessage(`${C} Controller Update: Failed`);
        } else
          d.window.showInformationMessage(
            `No update needed, ${e.selectedDevice.platform} ${e.selectedDevice.device} up to date!`,
          );
        return v;
      })()
        .then(
          (v) => (
            d.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexosControllerUpdateInProgress`,
              !1,
            ),
            (Lt = !1),
            v
          ),
        )
        .catch((v) => {
          throw (
            ((Lt = !1),
            d.commands.executeCommand(
              "setContext",
              `${i.Extension.id}.vexosControllerUpdateInProgress`,
              !1,
            ),
            new Error(v.message))
          );
        })
    );
  }
  async function ei() {
    if (!(e.selectedDevice instanceof Ye)) return;
    let m = e.selectedDevice.platform,
      u = d.Uri.joinPath(y.globalStorageUri, "vexos"),
      b = (await i.Feedback_Extension.ResourceManager.getVEXosVersions(m, u))
        .json,
      v = JSON.parse(b),
      C = d.Uri.joinPath(u, m, v.local.latest + ".vexos");
    v.local.catalog.includes(v.online.latest) ||
      (await i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
        m,
        d.Uri.joinPath(u, m),
      ),
      (b = (await i.Feedback_Extension.ResourceManager.getVEXosVersions(m, u))
        .json),
      (v = JSON.parse(b)),
      (C = d.Uri.joinPath(u, m, v.local.latest + ".vexos")));
    let I = await e.selectedDevice.controllerUsbUpdate(C);
    return (
      I.statusCode === h.ExitCode.vexSucess &&
        e.selectedDevice &&
        (e.selectedDevice.needsVexosUpdate = !1),
      E(I),
      At(),
      I
    );
  }
  async function ti() {
    if (!(e.selectedDevice instanceof Ye)) return;
    let m = e.selectedDevice.platform,
      u = d.Uri.joinPath(y.globalStorageUri, "vexos"),
      b = (await i.Feedback_Extension.ResourceManager.getVEXosVersions(m, u))
        .json,
      v = JSON.parse(b),
      C = d.Uri.joinPath(u, m, v.local.latest + ".vexos");
    v.local.catalog.includes(v.online.latest) ||
      (await i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
        m,
        d.Uri.joinPath(u, m),
      ),
      (b = (await i.Feedback_Extension.ResourceManager.getVEXosVersions(m, u))
        .json),
      (v = JSON.parse(b)),
      (C = d.Uri.joinPath(u, m, v.local.latest + ".vexos")));
    let I = await e.selectedDevice.controllerRadioUpdate(C);
    return (
      I.statusCode === h.ExitCode.vexSucess &&
        e.selectedDevice &&
        (e.selectedDevice.needsVexosUpdate = !1),
      E(I),
      At(),
      I
    );
  }
  async function ms(m) {
    o.selectedProject ||
      d.window.showErrorMessage("No Valid VEX Extension Project Open");
    let u = d.window.activeTextEditor;
    if (!u) return;
    let b = u.selection.start,
      v = new d.Range(u.selection.start, u.selection.end);
    if ((u.document.lineAt(u.selection.active.line).text, !o.selectedProject))
      return;
    let C = o.selectedProject.readProjectSettings(),
      I = await a.getActiveList(C.project.platform, C.project.language),
      D = u.document.lineAt(u.selection.active.line).text,
      B = u.document.getText(v),
      T = new RegExp(`(?<=s*)${B}(?=.w*.w*)`),
      me = new RegExp(`(?<=s*.w*)${B}(?=.w*)`),
      so = new RegExp(`(?<=s*.w*.w)${B}`),
      st = "";
    st.includes(".") ? (st = B.split(".").join("_")) : (st = B);
    let z = I.filter(
      (Y) =>
        Y.name.toLowerCase().includes(st.toLowerCase()) ||
        Y.signature.toLowerCase().includes(st.toLowerCase()),
    );
    if (z.length === 0) {
      await Xo(m);
      return;
    } else if (z.length === 1) a.Show(z[0]);
    else {
      let Y = [];
      z.forEach((ge) => {
        if (ge.signature.includes("_")) {
          let xe = ge.name.split("_"),
            vt = xe.shift(),
            jt = xe.join("_");
          Y.push({ label: ge.signature, description: ge.category });
        } else {
          let xe = ge.category,
            vt = ge.signature;
          Y.push({ label: ge.signature, description: ge.category });
        }
      });
      let ze = await d.window.showQuickPick(Y, {
        canPickMany: !1,
        title: "VEX Command Help",
        placeHolder: "Select Command",
      });
      if (!ze) return;
      if (ze.label.includes(":")) {
        let ge = ze.label.replace(": ", "_"),
          xe = I.filter((jt) => jt.name === ge)[0],
          vt = I.filter((jt) => jt.signature === ze.label)[0];
        if (xe) {
          a.Show(xe);
          return;
        } else
          vt
            ? a.Show(vt)
            : d.window.showErrorMessage(
                `VEX Command Help Error: ${ze.label} not found`,
              );
      } else {
        let ge = I.filter((xe) => xe.signature === ze.label)[0];
        a.Show(ge);
      }
    }
  }
  async function Xo(m) {
    if (!o.selectedProject) return;
    let u = o.selectedProject.readProjectSettings(),
      b = await a.getActiveList(u.project.platform, u.project.language),
      v = [],
      C = [];
    b.forEach((D) => {
      if (D.signature.includes("_")) {
        let B = D.name.split("_"),
          T = B.shift(),
          me = B.join("_");
        C.push({ label: D.signature, description: D.category });
      } else {
        let B = D.category,
          T = D.signature;
        C.push({ label: D.signature, description: D.category });
      }
    });
    let I = await d.window.showQuickPick(C, {
      canPickMany: !1,
      title: "Vex Command Help",
      placeHolder: "Select Command",
    });
    if (!!I)
      if (I.label.includes(":")) {
        let D = I.label.replace(": ", "_"),
          B = b.filter((T) => T.name === D)[0];
        a.Show(B);
      } else {
        let D = b.filter((B) => B.signature === I.label)[0];
        a.Show(D);
      }
  }
  async function us(m) {
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    if (!(e.selectedDevice instanceof H)) return;
    if (
      (e.selectedDevice instanceof tt && E(await e.selectedDevice.systemInfo()),
      !o.selectedProject)
    ) {
      E(await e.selectedDevice.downloadPythonVM(), !0);
      return;
    }
    r.refresh(e.selectedDevice, [e.selectedAIDevice]);
    let u = JSON.parse(e.selectedDevice.json),
      b = o.selectedProject.readProjectSettings(),
      v = u.v5 ? u.v5 : u.iq2 || u.iq2 ? u.iq2 : u.exp,
      C = d.Uri.file(
        d.workspace
          .getConfiguration()
          .get(
            i.Extension.Settings.sdkPythonHomeID,
            d.ConfigurationTarget.Global,
          )
          .toString(),
      );
    if (
      b.project.platform === e.selectedDevice.platform &&
      e.selectedDevice.bootMode === _.BootMode.app &&
      b.project.language === i.Language.python &&
      v?.brain
    ) {
      let I = d.Uri.joinPath(
          C,
          b.project.platform,
          b.project.sdkVersion,
          `vex${b.project.platform.toLowerCase()}`,
          "vm",
          "python_vm.bin",
        ),
        D = b.project.sdkVersion,
        B = `${b.project.platform.toUpperCase()}_${i.Utils.vexos.toVersion(v.vms?.items[0]?.version).split(".").join("_")}`,
        T = `${b.project.platform.toUpperCase()}_${i.Utils.vexos.toVersion(u.files.python_vm.version).split(".").join("_")}`;
      if (!v?.vms.count) E(await e.selectedDevice.downloadPythonVM(I));
      else if (D > B) E(await e.selectedDevice.downloadPythonVM(I));
      else if (T > B) E(await e.selectedDevice.downloadPythonVM());
      else if (m && I) E(await e.selectedDevice.downloadPythonVM(I));
      else if (m) E(await e.selectedDevice.downloadPythonVM());
      else return;
    } else m === void 0 && E(await e.selectedDevice.downloadPythonVM(), !0);
  }
  async function Q() {
    if (o.selectedProject) {
      let m = "",
        u = o.selectedProject.readProjectSettings(),
        b = o.getSDKHomeUriFromLanguage(u.project.language);
      if (b) {
        let v = await i.Feedback_Extension.ResourceManager.downloadSDK(
          u.project.platform,
          u.project.language,
          u.project.sdkVersion,
          b,
        );
        E(v, !0);
      } else
        d.window.showErrorMessage(`${u.project.language} Language not valid`);
    } else
      d.window.showWarningMessage(
        "Valid Project must be opened to download SDK",
      );
  }
  async function Ho() {
    let m = [i.Platform.V5, i.Platform.EXP, i.Platform.IQ2],
      u = [i.Language.cpp, i.Language.python];
    for (let b = 0; b < m.length; b++) {
      let v = m[b];
      for (let C = 0; C < u.length; C++) {
        let I = u[C],
          D = d.Uri.joinPath(i.Extension.context.globalStorageUri, "sdk", I),
          B = await i.Feedback_Extension.ResourceManager.getSDKVersions(
            v,
            I,
            D,
          );
        if (B.statusCode !== 0) continue;
        let T = JSON.parse(B.json);
        if (I === i.Language.python) {
          let me = T.online.latest.split("_").slice(0, 5).join("_");
          console.log(me),
            !T.local.catalog.includes(me) &&
              T.online.latest !== "" &&
              E(
                await i.Feedback_Extension.ResourceManager.downloadSDK(
                  v,
                  I,
                  T.online.latest,
                  D,
                ),
                !1,
              );
        } else if (I === i.Language.cpp) {
          let me = T.online.latest.split("_").slice(0, 5).join("_");
          !T.local.catalog.includes(me) &&
            T.online.latest !== "" &&
            E(
              await i.Feedback_Extension.ResourceManager.downloadSDK(
                v,
                I,
                T.online.latest,
                D,
              ),
              !1,
            );
        } else
          T.local.latest !== T.online.latest &&
            T.online.latest !== "" &&
            E(
              await i.Feedback_Extension.ResourceManager.downloadSDK(
                v,
                I,
                T.online.latest,
                D,
              ),
              !1,
            );
        T.local.latest !== "" && console.log(T);
      }
    }
  }
  async function oi(m) {
    E(await i.Feedback_Extension.ResourceManager.downloadToolchain(), !0);
  }
  async function si() {
    l?.clear(), ee.Log.clearTempLog();
  }
  async function ii() {
    p?.clear();
  }
  async function ri() {
    l && l.terminal.dispose(),
      p && p.terminal.dispose(),
      (l = new ee.Log()),
      (p = new ee.Interactive("Interactive Terminal", l.terminal)),
      l.terminal.show();
  }
  async function Vo() {
    if (e.selectedDevice instanceof Ht || e.selectedDevice instanceof Xt) {
      d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosBrainUpdateInProgress`,
        !0,
      ),
        d.window.showInformationMessage("");
      let m = await e.selectedDevice.recover();
      E(m),
        m.statusCode === h.ExitCode.vexSucess &&
          d.window.showInformationMessage(
            `${e.selectedDevice.platform} ${e.selectedDevice.device} DFU Recover Success`,
          ),
        d.commands.executeCommand(
          "setContext",
          `${i.Extension.id}.vexosBrainUpdateInProgress`,
          !1,
        );
    }
    if (e.selectedDevice instanceof kt || e.selectedDevice instanceof Tt) {
      let m = d.Uri.joinPath(y.globalStorageUri, "vexos"),
        u = (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            e.selectedDevice.platform,
            m,
          )
        ).json,
        b = JSON.parse(u),
        v = d.Uri.joinPath(
          m,
          e.selectedDevice.platform,
          b.local.latest + ".vexos",
        );
      !b.local.catalog.includes(b.online.latest) &&
        b.latest !== "" &&
        (await i.Feedback_Extension.ResourceManager.downloadLatestVEXos(
          e.selectedDevice.platform,
          d.Uri.joinPath(m, e.selectedDevice.platform),
        ),
        (u = (
          await i.Feedback_Extension.ResourceManager.getVEXosVersions(
            e.selectedDevice.platform,
            m,
          )
        ).json),
        (b = JSON.parse(u)),
        (v = d.Uri.joinPath(
          m,
          e.selectedDevice.platform,
          b.local.latest + ".vexos",
        ))),
        d.commands.executeCommand(
          "setContext",
          `${i.Extension.id}.vexosControllerUpdateInProgress`,
          !0,
        );
      let C = await e.selectedDevice.controllerUsbUpdate(v),
        I = 3e3,
        D = 0,
        B = 100,
        T = e.selectedDevice;
      for (
        ;
        D < I &&
        (await i.Utils.asyncSleep(B),
        (D += B),
        !(!e.selectedDevice || e?.selectedDevice?.bootMode !== _.BootMode.dfu));

      );
      if (
        C.statusCode === h.ExitCode.vexSucess &&
        e?.selectedDevice?.bootMode !== _.BootMode.dfu
      )
        E(C),
          d.window.showInformationMessage(
            `${T.platform} ${T.device} DFU Recover Success`,
          );
      else {
        d.window.showErrorMessage(
          `${T.platform} ${T.device} DFU Recover Failed`,
        );
        let me = await gs(!1);
      }
      d.commands.executeCommand(
        "setContext",
        `${i.Extension.id}.vexosControllerUpdateInProgress`,
        !1,
      );
    }
  }
  async function gs(m = !0) {
    let u = {
      command: i.Extension.Command.installDrivers,
      details: "Driver Install Only Avaliable on Windows",
      json: "",
      statusCode: 0,
    };
    if (Ke.type() !== "Windows_NT")
      return (
        (u.details = "Driver Install Only Avaliable on Windows"),
        (u.statusCode = -1),
        m && E(u),
        u
      );
    let b = m
      ? "Install"
      : await d.window.showWarningMessage(
          "VEX drivers may be missing, would you like to install VEX drivers?",
          "Install",
          "Ignore",
        );
    if (b === "Install") {
      if (!s.exist) {
        let C = await s.download();
        if (C.statusCode !== 200) return E(C), C;
      }
      let v = await s.run();
      (u.statusCode = v.exitCode),
        v.exitCode === 0
          ? (u.details = "Drivers Installed")
          : (u.details = `Drivers Not Installed - ${v.stderr}`);
    } else (u.statusCode = 0), (u.details = "Driver Install Ignored");
    return E(u), u;
  }
  async function ni() {
    if (
      !i.Extension.Context.isDevEnabled ||
      !(e.selectedDevice instanceof Ye || e.selectedDevice instanceof nt)
    )
      return;
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    let m = d.Uri.file(Ke.homedir()),
      u = {
        title: "Update Controller Radio",
        defaultUri: m,
        canSelectFolders: !1,
        canSelectFiles: !0,
        canSelectMany: !1,
        filters: { vexos: ["vexos"] },
      },
      b = await d.window.showOpenDialog(u);
    !b ||
      (E(await e.selectedDevice.controllerRadioUpdate(b[0])),
      e.checkControllerVEXOS(e.selectedDevice));
  }
  async function ai() {
    if (
      !i.Extension.Context.isDevEnabled ||
      !(
        e.selectedDevice instanceof Ye ||
        e.selectedDevice instanceof nt ||
        e.selectedDevice instanceof kt ||
        e.selectedDevice instanceof Tt
      )
    )
      return;
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    let m = d.Uri.file(Ke.homedir()),
      u = {
        title: "Update Controller Radio",
        defaultUri: m,
        canSelectFolders: !1,
        canSelectFiles: !0,
        canSelectMany: !1,
        filters: { vexos: ["vexos"] },
      },
      b = await d.window.showOpenDialog(u);
    !b ||
      (E(await e.selectedDevice.controllerUsbUpdate(b[0])),
      e.checkControllerVEXOS(e.selectedDevice));
  }
  async function ci() {
    if (
      !i.Extension.Context.isDevEnabled ||
      !(e.selectedDevice instanceof Ye || e.selectedDevice instanceof nt)
    )
      return;
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    let m = d.Uri.file(Ke.homedir()),
      u = {
        title: "Update Controller Radio",
        defaultUri: m,
        canSelectFolders: !1,
        canSelectFiles: !0,
        canSelectMany: !1,
        filters: { vexos: ["vexos"] },
      },
      b = await d.window.showOpenDialog(u);
    if (!b) {
      d.window.showWarningMessage("No VEXOS File Selected");
      return;
    }
    E(await e.selectedDevice.controllerUpdate(b[0]), !0),
      e.checkControllerVEXOS(e.selectedDevice);
  }
  async function li() {
    if (
      !i.Extension.Context.isDevEnabled ||
      !(e.selectedDevice instanceof bt || e.selectedDevice instanceof xt)
    )
      return;
    if (!e.selectedDevice) {
      d.window.showWarningMessage("No Device Connected");
      return;
    }
    let m = d.Uri.file(Ke.homedir()),
      u = {
        title: "Update Controller Radio",
        defaultUri: m,
        canSelectFolders: !1,
        canSelectFiles: !0,
        canSelectMany: !1,
        filters: { vexos: ["vexos"] },
      },
      b = await d.window.showOpenDialog(u);
    if (!b) {
      d.window.showWarningMessage("No VEXOS File Selected");
      return;
    }
    E(await e.selectedDevice.systemUpdate(b[0]), !0),
      e.checkSystemVEXOS(e.selectedDevice);
  }
  async function jo() {
    let m = {
      command: i.Extension.Command.downloadID,
      details: "",
      statusCode: -1,
      json: "",
    };
    if (e.selectedDevice.bootMode !== _.BootMode.app) {
      (m.details = `${e.selectedDevice.platform} ${e.selectedDevice.device} in Bootloader (${e.selectedDevice.bootMode})`),
        t.appendLine(
          `[Command]: Download User Program, VEX ${e.selectedDevice.device}  in Bootloader (${e.selectedDevice.bootMode})`,
        );
      let u = "",
        b = "";
      return (
        e.selectedDevice.device === i.Device.Brain
          ? ((u = `${e.selectedDevice.platform} ${e.selectedDevice.device} ${e.selectedDevice.bootMode} Detected.  Would you like to update?`),
            (b = "Update"))
          : ((u = `${e.selectedDevice.platform} ${e.selectedDevice.device} (DFU) Detected.  Would you like to recover?`),
            (b = "Recover")),
        d.window.showInformationMessage(u, b).then((v) => {
          v === "Recover" ? Vo() : v === "Update" && Eo();
        }),
        m
      );
    }
    return (m.statusCode = 0), m;
  }
})(So || (So = {}));
require("module-alias/register");
var St;
function Hi(y) {
  (St = new at(y, "VEX", "vex.main.debuglog")),
    St.appendLine(":"),
    St.appendLine(
      ":======================== VEX Extension Activate ========================",
    ),
    St.appendLine(":"),
    St.appendLine(`: VEX Extension Version: ${i.Extension.version()}`),
    So.setup(y, St).catch((t) => {
      Ys.window.showErrorMessage(`Fatal Error: ${t.message}`),
        St.appendLine(`: VEX Extension Fatal Error: 
Name	:${t.name}
Message:	${t.message}
Stack:	${t?.stack}`);
    });
}
async function Wi() {
  await So.shutDown(),
    St.appendLine(": "),
    St.appendLine(
      ": ======================== VEX Extension Deactivate ========================",
    ),
    St.appendLine(": "),
    await i.Utils.asyncSleep(1e3);
}
0 && (module.exports = { activate, deactivate });
//# sourceMappingURL=extension.js.map
