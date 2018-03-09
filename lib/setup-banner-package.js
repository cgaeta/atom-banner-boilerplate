'use babel';

import path from 'path';

import BuildBannerPackageView from './build-banner-package-view';
import SetupBannerPackageView from './setup-banner-package-view';
import { CompositeDisposable, Directory, File, Emitter } from 'atom';
import { execFile } from "child_process";
import { setEmitters } from './emitter';
import { build, createBuildBtn } from './build';
import { traverse } from './map';

export default {

  BuildBannerPackageView: null,
  setupBannerPackageView: null,
  buildModalPanel: null,
  subscriptions: null,
  sourceDir: null,
  targetDir: null,
  targetPath: null,
  exclude: null,
  builds: null,

  activate(state) {
    this.buildView = new BuildBannerPackageView({
      campaigns: typeof state === "string" ? JSON.parse(state).campaigns :
        state.campaigns ? state.campaigns : {
          'Example': {
            sizes: [
              ['160', '600'], ['300', '50'], ['300', '250'], ['300', '600'],
              ['320', '50'], ['320', '480'], ['728', '90']
            ],
            audiences: [ "Affinity", "Awareness", "Loyalty" ],
            targetPath: "/Users/chrisgaeta/Desktop/banners/webpackDemoTest"
          }
        },
      onCancel: () => {
        this.buildModalPanel.hide();
      },
      onConfirm: (config) => {
        this.targetDir = new Directory(config.target);
        build(config);
        this.buildModalPanel.hide();
      }
    });

    this.setupView = new SetupBannerPackageView({
      onCancel: () => {
        this.setupModalPanel.hide();
      },
      onConfirm: ({campaign, target, audienceList, dimList}) => {
        this.builds[campaign] = {
          targetPath: target,
          sizes: dimList,
          audiences: audienceList
        };
        this.buildView.addCampaign(campaign, this.builds[campaign]);
        this.targetDir = new Directory(target);
        this.setupModalPanel.hide();
        this.copy(dimList, audienceList);
      }
    });

    this.setupModalPanel = atom.workspace.addModalPanel({
      item: this.setupView.getElement(),
      visible: false
    });

    this.buildModalPanel = atom.workspace.addModalPanel({
      item: this.buildView.getElement(),
      visible: false
    });

    // this.sourcePath = "../boilerplate";
    this.sourcePath = path.resolve(__dirname, "../boilerplate");
    this.sourceDir = new Directory(this.sourcePath); // Locally stored files
    this.exclude = /node_modules|dist|DS_Store|templ|\d{2,3}/;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.builds = {};

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      // 'setup-banner-package:copy': () => this.copy(),
      'setup-banner-package:copy': () => this.setupForm(),
      'setup-banner-package:install': () => this.installNPM(),
      'setup-banner-package:setDirectory': () => this.getDirectory(),
      'setup-banner-package:build': () => this.buildForm(),
      'setup-banner-package:contents-loader': () => this.copyContentsLoader()
    }));

    // atom.packages.onDidActivateInitialPackages(
    //   () => setEmitters(
    //     (path) => createBuildBtn(path, p => {
    //       this.targetPath = p;
    //       this.buildView.setTarget(p);
    //       this.buildForm();
    //     }),
    //     this.subscriptions));

  },

  deactivate() {
    this.buildModalPanel.destroy();
    this.subscriptions.dispose();
  },

  serialize() {
    return JSON.stringify({
      campaigns: this.buildView.getCampaigns()
    });
  },

  getDirectory() {
    if (!atom.contextMenu.activeElement) {
      return;
    }

    this.targetPath = atom.contextMenu.activeElement.dataset.path;
    this.targetDir = new Directory(this.targetPath);
    this.setupView.setTarget(this.targetPath);
    this.buildView.setTarget(this.targetPath);
  },

  setupForm() {
    this.getDirectory();
    return (
      this.setupModalPanel.isVisible() ?
      this.setupModalPanel.hide() :
      this.setupModalPanel.show()
    );
  },

  copy(sizes, audiences) {

    this.getDirectory();

    traverse(this.sourceDir, this.targetDir, this.exclude)
      .then(() => {
        let path = this.targetDir.path + '/src/';

        let audienceTemplate = new Directory(this.sourcePath + "/src/templ_audience"),
          sizeTemplate = new Directory(this.sourcePath + "/src/templ_size");

        for (let size of sizes) {
          let srcDir = new Directory(path + size.join('x'));
          srcDir.create()
          .then(() => traverse(sizeTemplate, srcDir, /\.css/))
          .then(() => {
            for (audience of audiences) {
              let audDir = new Directory(path + size.join('x') + '/' + audience);
              audDir.create()
              .then(() => traverse(audienceTemplate, audDir, /\.css/));
            }
          });
        }
      })
      .then(() => this.installNPM());
      // .then(() => setEmitters());

    return;
  },

  installNPM() {
    this.getDirectory();

    console.log("trying to install..");

    const child = execFile("npm", ["install"], {
      cwd: this.targetPath,
    }, (err, stdout, stderr) => {
      if (err) {
        console.error(`error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      const ls = execFile("ls", [], {
        cwd: this.targetPath,
        timeout: 60000,
      }, (err, stdout, stderr) => {
        if (err) {
          console.error(`error: ${err}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });

    });

    return;
  },

  copyContentsLoader() {
    this.getDirectory();

    let modulePath = "/node_modules/contents-loader/index.js",
      srcFile = new File(this.sourcePath + modulePath),
      targetFile = new File(this.targetPath + modulePath);

    srcFile.read().then(content => targetFile.write(content));
  },

  buildForm() {
    return (
      this.buildModalPanel.isVisible() ?
      this.buildModalPanel.hide() :
      this.buildModalPanel.show()
    );
  }

};
