'use babel';

import { traverseMaps, traverseMapsDeep } from './map';

export function setEmitters(addFn, subscriptions) {
  let {treeView} = atom.packages.getActivePackage('tree-view').mainModule;
  for (let root of treeView.roots) {
    let dir = root.directory;
    traverseMaps(dir.entries, (el, key, parent) => {
      if (el.wasCollapsed = el.expansionState && !el.expansionState.isExpanded && !/node_modules/.test(el.path)) {
        el.expand();
      }
      if (el.entries && el.entries.has("webpack.config.js")) {
        console.log(el, parent, addFn, subscriptions);
        addEmitters(el, parent, addFn, subscriptions);
      }
    }, (el, key) => {
      return el.entries !== undefined && !/node_modules/.test(el.path);
    }, dir);

    traverseMapsDeep(dir.entries, (el, key, parent) => {
      console.log(el);
      if (typeof el.wasCollapsed !== 'undefined') {
        el.collapse();
        delete el.wasCollapsed;
      }
    }, (el, key) => {
      return el.entries !== undefined;
    }, dir);
  }
}

export function addEmitters(el, parent, addFn, subscriptions) {
  console.log(parent);
  if (parent.emitter.handlersByEventName['did-add-entries'].length < 2) {
    let addEntry = parent.emitter.on('did-add-entries',
      () => {
        addFn(el.path)
      });
    addFn(el.path);

    let deleteEntry = el.emitter.on('did-remove-entries',
      (removed, addEntry, deleteEntry) => {
        unsubscribeEmitters(removed, addEntry, deleteEntry)
      });

    subscriptions.add(addEntry, deleteEntry);
  }
}

export function unsubscribeEmitters(removed, addEntry, deleteEntry) {
  removed.forEach(val => {
    if (val.name === "webpack.config.js") {
      addEntry.dispose();
      deleteEntry.dispose();
      // btn.remove();
    }
  });
}

export default { setEmitters, addEmitters, unsubscribeEmitters };
