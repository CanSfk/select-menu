class BaseCustomSelector extends HTMLElement {
  connectedCallback() {
    this.setupElements();
  }

  setupElements() {
    const selectMenu = document.querySelector("select-menu");
    this.toggleElement = selectMenu.shadowRoot.querySelector(".select-toggle");
    this.selectList = selectMenu.shadowRoot.querySelector(".select-list");
    this.toggleIcon = selectMenu.shadowRoot.querySelector(".toggle-icon");
  }

  toggleActiveClass = (items) => {
    items.forEach((item) => {
      item.classList.toggle("active");
    });
  };
}

class CustomSelector extends BaseCustomSelector {
  static observedAttributes = ["title"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  render() {
    const title = this.title || "Title";

    this.shadowRoot.innerHTML = `
    <style>
    :host {
      position: relative;
      padding: 2px;
    }
    
    .select-toggle {
      padding-left: 12px;
      background-color: #27ae60;
      color: #f1f5f9;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      place-items: center;
      gap: 15px;
      overflow: hidden;
    }
    
    .toggle-icon-container {
      position: relative;
      width: 23px;
      height: 25px;
      background-color: #1e272e;
    }
    
    .toggle-icon {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 50%;
      transform: translateY(-50%);
      right: -4px;
    }
    
    .toggle-icon path {
      transition: 200ms all ease-in-out;
    }
    
    .toggle-icon.active > :first-child {
      fill: #27ae60;
    }
    
    .toggle-icon:not(.active) > :last-child {
      fill: #27ae60;
    }
    
    .select-list {
      position: absolute;
      top: 75%;
      left: 50%;
      transform: translateX(-50%);
      user-select: none;
      width: max-content;
      background-color: #2c3e50;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      color: #e2e8f0;
      visibility: hidden;
      opacity: 0;
      border-radius: 3px;
      overflow: hidden;
      /* transition:250ms transform ease-in-out ,350ms opacity ease-in; */
      transition: 300ms all;
    }
    
    .select-list.active {
      visibility: visible;
      top: 110%;
      opacity: 1;
    }
    </style>


      <div class="select-toggle" data-value>
        <span>${title}</span>
        <div class="toggle-icon-container">
          <svg class="toggle-icon" viewBox="0 0 24 24">
            <path
              d="m16.707 9.293-4-4a1 1 0 0 0-1.414 0l-4 4A1 1 0 0 0 8 11h8a1 1 0 0 0 .707-1.707z"
            />
            <path
              d="M16.924 13.617A1 1 0 0 0 16 13H8a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 .217-1.09z"
            />
          </svg>
        </div>
      </div>
      <div class="select-list">
      <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
    super.connectedCallback();

    this.toggleElement.addEventListener("click", () => {
      this.toggleActiveClass([this.selectList, this.toggleIcon]);
    });

    document.body.addEventListener(
      "click",
      function (e) {
        if (
          this.selectList.classList.contains("active") &&
          !e.target.closest("select-menu")
        ) {
          this.toggleActiveClass([this.selectList, this.toggleIcon]);
        }
      }.bind(this)
    );
  }
}

class CustomSelectItem extends BaseCustomSelector {
  static observedAttributes = ["value", "text"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  get value() {
    return this.getAttribute("value");
  }

  set text(text) {
    this.setAttribute("text", text);
  }

  get text() {
    return this.getAttribute("text");
  }

  connectedCallback() {
    this.render();
    super.connectedCallback();
    this.setupClickListeners();
  }

  setValue = (value) => {
    this.toggleElement.setAttribute("data-value", value);
  };

  setInnerText = (value) => {
    const textElement = this.toggleElement.querySelector("span");
    textElement && (textElement.innerText = value);
  };

  setTitle = (value) => {
    const text = this.toggleElement.querySelector("span");
    text.innerText = value;
  };

  setupClickListeners = () => {
    const listItems = this.shadowRoot.querySelectorAll(".select-list-item");

    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.handleItemClick(item);
      });
    });
  };

  handleItemClick = (item) => {
    this.setTitle(item.getAttribute("text"));
    this.setInnerText(item.innerText);
    this.setValue(item.getAttribute("value"));
    this.toggleActiveClass([this.selectList, this.toggleIcon]);
  };

  render() {
    const value = this.value;
    const text = this.text;

    this.shadowRoot.innerHTML = `
    <style>
      .select-list-item {
        padding: 6px 18px 6px 10px;
        cursor: pointer;
        transition: 200ms background;
      }
      
      .select-list-item:hover {
        background-color: #27ae60;
      }
      
      .select-list-item.active {
        background-color: #27ae60;
      }
      
      .select-list-item:not(:last-child) {
        border-bottom: 1px solid #34495e;
      }
    </style>

    <div class="select-list-item" value=${value} text=${text}D>
      ${text}
    </div>
    `;
  }
}

customElements.define("select-menu", CustomSelector);
customElements.define("select-item", CustomSelectItem);
