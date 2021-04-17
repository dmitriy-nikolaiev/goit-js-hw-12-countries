const loaderCreator = selector => {
  return {
    element: document.querySelector(selector),

    hide() {
      this.element.classList.add('hide');
    },
    show() {
      this.element.classList.remove('hide');
    },
  };
};

export default loaderCreator;
