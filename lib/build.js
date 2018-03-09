'use babel';

import { execFile } from "child_process";

export function build(config) {
  // this.targetDir = new Directory(config.target);

  if (typeof config === "undefined") {
    config = {
      width: 300,
      height: 50
    }
  };
  config.width = config.width.length ? config.width : "300";
  config.height = config.height.length ? config.height: "50";

  let args = [
    "run",
    "build",
    "--",
    "--env.width=" + config.width,
    "--env.height=" + config.height
  ];

  if (config.prod) {
    args.push("--env.prod");
    args.push("--optimize-minimize");
  }

  if (config.audience) {
    args.push("--env.audience=" + config.audience);
  }

  if (config.campaign) {
    args.push("--env.campaign=" + config.campaign);
  }

  console.log(args);

  const child = execFile("npm", args, {
      cwd: config.target
    }, (err, stdout, stderr) => {
      if (err) {
        console.error(`error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
}

export function createBuildBtn (path, clickCallback) {
  let el = document.querySelector(`[data-path="${path}"]`);
  let btn = document.createElement('button');
  btn.classList.add('btn');
  btn.style.marginLeft = "10px";
  btn.textContent = "Build";
  // btn.addEventListener('click', (e) => {
  //   e.stopPropagation();
  //   this.targetPath = path;
  //   this.view.setTarget(path);
  //   this.buildForm();
  // });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    clickCallback(path);
  });
  el.appendChild(btn);

  return btn;
}

export default { build, createBuildBtn };
