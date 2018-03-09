'use babel';

import { Directory, File } from 'atom';

export function traverseMaps(map, func, cond, parent) {
  if (!map.forEach) {
    console.error(map);
    return;
  }
  map.forEach((el, key) => {
    func(el, key, parent);
    if (cond(el, key)) {
      traverseMaps(el.entries, func, cond, map);
    }
  });
}

export function traverseMapsDeep(map, func, cond, parent) {
  if (!map.forEach) {
    console.error(map);
    return;
  }
  map.forEach((el, key) => {
    if (cond(el, key)) {
      traverseMapsDeep(el.entries, func, cond, map);
    }
    func(el, key, parent);
  });
}

export function traverse(src, target, exclude) {

  if (typeof src === "undefined") {
    console.log("src undefined", target.path);
    return;
  } else if (typeof target === "undefined") {
    console.log("target undefined", src.path);
    return;
  }

  let children = src.getEntriesSync()
        .filter(item => !exclude.test(item.path)),
      subDirs = children.filter(item => item.isDirectory())
        .filter(item => !exclude.test(item.path));

  let dirPromises = [];
  for (let child of children) {
    let itemName = target.path + '/' + child.path.split('/').pop();
    let targetItem = null;

    if (child.isDirectory()) {
      targetItem = new Directory(itemName);
      dirPromises.push(targetItem.create());
    } else {
      targetItem = new File(itemName);
      targetItem.create()
        .then(() => child.read())
        .then(content => targetItem.write(content));
    }
  }

  let p = Promise.all(dirPromises)
    .then(dirCreation => {
      return new Promise((resolve, reject) => {
        target.getEntries((error, entries) =>
          error ? reject(error) : resolve(entries));
      })
      .then(entries => entries
        .filter(item => item.isDirectory())
        .filter(item => !exclude.test(item.path)))
      .then(targetDirs => {
        for (let i = 0; i < targetDirs.length || i < subDirs.length; i++) {
          traverse(subDirs[i], targetDirs[i], exclude);
        }
      });
    });

  return p;
}

export default { traverseMaps, traverseMapsDeep };
