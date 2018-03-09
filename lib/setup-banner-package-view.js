'use babel';

import SelectListView from 'atom-select-list';

export default class SetupBannerPackageView {

  constructor(state) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('setup-banner-package');

    // Create message element
    const inputCampaign = document.createElement('input');
    inputCampaign.setAttribute('mini', 'mini');
    inputCampaign.setAttribute('name', 'campaign');
    inputCampaign.classList.add('inpCampaign', 'input-text');
    inputCampaign.setAttribute('type', 'text');
    inputCampaign.setAttribute('placeholder', 'Campaign');

    const inputTarget = document.createElement('input');
    inputTarget.setAttribute('mini', 'mini');
    inputTarget.classList.add('inpTarget', 'input-text');
    inputTarget.setAttribute('type', 'text');
    inputTarget.setAttribute('placeholder', 'Target Path');
    this.inputTarget = inputTarget;

    const inputDimW = document.createElement('input');
    inputDimW.classList.add('width', 'input-text', 'inline-block');
    inputDimW.setAttribute('type', 'number');
    inputDimW.setAttribute('placeholder', 'Width (default: 300)');

    const inputDimH = document.createElement('input');
    inputDimH.classList.add('height', 'input-text', 'inline-block');
    inputDimH.setAttribute('type', 'number');
    inputDimH.setAttribute('placeholder', 'Height (default: 50)');

    const dimList = document.createElement('ul');
    dimList.classList.add('list-group', 'sizeList');
    this.listData = {};
    this.dimIdx = 0;

    const btnAddDim = document.createElement('button');
    btnAddDim.classList.add('btn');
    btnAddDim.textContent = 'Add Size';
    btnAddDim.addEventListener('click', () => {
      let el = document.createElement('li'),
        i = this.dimIdx,
        del = document.createElement('span');
      this.listData[this.dimIdx++] = [inputDimW.value || "300", inputDimH.value || "50"];
      el.textContent = this.listData[i].join("x");
      el.classList.add("list-item");
      del.classList.add("icon", "icon-x", "pull-right");
      del.addEventListener("click", () => {
        dimList.removeChild(el);
        delete this.listData[i];
      });
      el.appendChild(del);
      dimList.appendChild(el);
    });

    const audience = document.createElement('input');
    audience.setAttribute('mini', 'mini');
    audience.classList.add('inpAudience', 'input-text', 'inline-block');
    audience.setAttribute('type', 'text');
    audience.setAttribute('placeholder', 'Audience');

    const audienceList = document.createElement('ul');
    audienceList.classList.add('list-group', 'audienceList');
    this.audienceData = {};
    this.tgtIdx = 0;

    const btnAddTgt = document.createElement('button');
    btnAddTgt.classList.add('btn', 'inline-block');
    btnAddTgt.textContent = 'Add Target';
    btnAddTgt.addEventListener('click', () => {
      let el = document.createElement('li'),
        i = this.tgtIdx,
        del = document.createElement('span');
      this.audienceData[this.tgtIdx++] = audience.value;
      el.textContent = audience.value;
      el.classList.add("list-item");
      del.classList.add("icon", "icon-x", "pull-right");
      del.addEventListener("click", () => {
        audienceList.removeChild(el);
        delete this.listData[i];
      });
      el.appendChild(del);
      audienceList.appendChild(el);
    });

    const btnCancel = document.createElement('button');
    btnCancel.classList.add('btn');
    btnCancel.textContent = 'Cancel';
    btnCancel.addEventListener('click', () => {
      state.onCancel();
    });

    const btnConfirm = document.createElement('button');
    btnConfirm.classList.add('btn');
    btnConfirm.textContent = 'Confirm';
    btnConfirm.addEventListener('click', () => {
      state.onConfirm({
        campaign: inputCampaign.value,
        target: inputTarget.value,
        dimList: Object.values(this.listData),
        audienceList: Object.values(this.audienceData)
      });
    });

    this.items = document.createDocumentFragment();

    this.buildList(this.items, [
      [inputCampaign],
      [inputTarget],
      [inputDimW, inputDimH, btnAddDim],
      [dimList],
      [audience, btnAddTgt],
      [audienceList],
      [btnCancel, btnConfirm]
    ]);

    this.element.appendChild(this.items);
  }

  buildList(parent, childSets) {
    for (let children of childSets) {
      let block = document.createElement("div");
      block.classList.add("block");
      this.appendChildren(block, children);
      parent.appendChild(block);
    }
  }

  appendChildren(parent, children) {
    for (let child of children) {
      parent.appendChild(child);
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  setTarget(tgt) {
    this.targetPath = tgt;
    this.inputTarget.value = tgt;
  }

}
