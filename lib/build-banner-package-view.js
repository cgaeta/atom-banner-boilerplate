'use babel';

import SelectListView from 'atom-select-list';

export default class BuildBannerPackageView {

  constructor(state = {
    campaigns: {
      'Example': {
        sizes: [
          ['160', '600'], ['300', '50'], ['300', '250'], ['300', '600'],
          ['320', '50'], ['320', '480'], ['728', '90']
        ],
        audiences: [ "Affinity", "Awareness", "Loyalty" ],
        targetPath: "/Users/chrisgaeta/Desktop/banners/webpackDemoTest"
      }
    }
  }) {

    this.campaigns = state.campaigns;
    let campaigns = Object.values(state.campaigns),
      campaign = campaigns[0];

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('setup-banner-package');

    // Create message element
    const lblCampaign = document.createElement('label');
    lblCampaign.textContent = "Campaign: ";

    const selectCampaign = document.createElement('select');
    selectCampaign.classList.add('input-select');
    selectCampaign.addEventListener('change', ({target: {value}}) => this.updateBuild(value));

    this.selectCampaign = selectCampaign;

    for (let c of Object.keys(state.campaigns)) {
      let opt = document.createElement('option');
      opt.textContent = opt.value = c;
      selectCampaign.append(opt);
    }
    lblCampaign.append(selectCampaign);

    const deleteCampaign = document.createElement('button');
    deleteCampaign.classList.add('btn');
    deleteCampaign.textContent = 'Delete';
    deleteCampaign.addEventListener('click', () => {
      this.onDeleteCampaign()
    });
    lblCampaign.append(deleteCampaign);

    const inputTarget = document.createElement('input');
    inputTarget.value = campaign.targetPath;
    inputTarget.classList.add('inpTarget', 'input-text');
    inputTarget.setAttribute('type', 'text');
    inputTarget.setAttribute('placeholder', 'Target Path');
    this.inputTarget = inputTarget;

    const inputDimW = document.createElement('input');
    inputDimW.classList.add('width', 'input-text', 'inline-block');
    inputDimW.setAttribute('type', 'number');
    inputDimW.setAttribute('placeholder', 'Width (default: 300)');
    this.inputDimW = inputDimW;

    const inputDimH = document.createElement('input');
    inputDimH.classList.add('height', 'input-text', 'inline-block');
    inputDimH.setAttribute('type', 'number');
    inputDimH.setAttribute('placeholder', 'Height (default: 50)');
    this.inputDimH = inputDimH;

    const adSize = new SelectListView({
      items: campaign.sizes,
      elementForItem: item => this.selectListItem(item),
      didConfirmSelection: (item) => {
        inputDimW.value = item[0];
        inputDimH.value = item[1];
      }
    });
    adSize.element.firstChild.remove();

    this.adSize = adSize;

    const audience = document.createElement('input');
    audience.classList.add('inpTarget', 'input-text', 'inline-block');
    audience.setAttribute('type', 'text');
    audience.setAttribute('placeholder', 'Audience');
    this.audience = audience;

    const audienceList = new SelectListView({
      items: campaign.audiences,
      elementForItem: item => this.selectListItem(item),
      didConfirmSelection: item => {
        audience.value = item;
      }
    });
    audienceList.element.firstChild.remove();

    this.audienceList = audienceList;

    const inputProduction = document.createElement('input');
    inputProduction.classList.add('input-toggle');
    inputProduction.setAttribute('type', 'checkbox');
    inputProduction.setAttribute('name', 'production');

    const lblProduction = document.createElement('label');
    lblProduction.classList.add('input-label');

    lblProduction.appendChild(inputProduction);
    lblProduction.innerHTML += "Production";

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
        campagin: selectCampaign.value,
        target: inputTarget.value,
        width: inputDimW.value,
        height: inputDimH.value,
        audience: audience.value,
        prod: this.element.querySelector('.input-toggle').checked
      });
    });

    this.items = document.createDocumentFragment();

    this.buildList(this.items, [
      [lblCampaign],
      [inputTarget],
      [inputDimW, inputDimH],
      [adSize.element],
      [audience],
      [audienceList.element],
      [lblProduction],
      [btnCancel, btnConfirm]
    ]);

    this.element.appendChild(this.items);
  }

  buildList (parent, childSets) {
    for (let children of childSets) {
      let block = document.createElement("div");
      block.classList.add("block");
      this.appendChildren(block, children);
      parent.appendChild(block);
    }
  }

  appendChildren (parent, children) {
    for (let child of children) {
      parent.appendChild(child);
    }
  }

  selectListItem (item) {
    let li = document.createElement('li');
    li.textContent = Array.isArray(item) ? item.join("x") : item;
    return li;
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {
    return {
      campaigns: this.campaigns
    };
  }

  // Tear down any state and detach
  destroy () {
    this.element.remove();
  }

  getElement () {
    return this.element;
  }

  updateBuild (campaign) {
    this.setTarget(this.campaigns[campaign].targetPath);
    this.updateDim(this.campaigns[campaign].sizes);
    this.updateAudience(this.campaigns[campaign].audiences);
  }

  updateCampaigns (i) {
    // let opt = document.createElement('option');
    // opt.textContent = i;
    // this.selectCampaign.append(opt);
    while (this.selectCampaign.firstChild) {
      this.selectCampaign.removeChild(this.selectCampaign.firstChild);
    }

    for (let c of Object.keys(this.campaigns)) {
      let opt = document.createElement('option');
      opt.textContent = opt.value = c;
      this.selectCampaign.append(opt);
    }

    if (i) {
      this.updateBuild(i);
    } else {
      this.updateBuild(Object.keys(this.campaigns)[0]);
    }
  }

  updateDim (i) {
    this.adSize.update({
      items: i,
      elementForItem: item => {
        const li = document.createElement('li');
        li.textContent = `${item[0]}x${item[1]}`;
        li.dataset.width = item[0];
        li.dataset.height = item[1];
        return li;
      },
      didConfirmSelection: item => {
        this.inputDimW.value = item[0];
        this.inputDimH.value = item[1];
      }
    });
  }

  updateAudience (i) {
    this.audienceList.update({
      items: i,
      elementForItem: item => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      },
      didConfirmSelection: item => {
        this.audience.value = item;
      }
    })
  }

  setTarget (tgt) {
    this.targetPath = tgt;
    this.inputTarget.value = tgt;
  }

  getCampaigns () {
    return this.campaigns;
  }

  addCampaign (campaign, specs) {
    this.campaigns[campaign] = specs;
    this.updateCampaigns(campaign);
    this.selectCampaign.selectedIndex = this.selectCampaign.options.length - 1;
  }

  onDeleteCampaign () {
    let { selectCampaign: campaign } = this,
        { options } = campaign,
        value = options[campaign.selectedIndex].value;

    if (value === "Example") {
      return;
    }
    
    delete this.campaigns[value];

    this.updateCampaigns();
  }

}
