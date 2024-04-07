window.addEventListener("DOMContentLoaded", () => {
  const buttonCollapse = document.querySelector(".button-collapse");
  const buttonCallbackChat = document.querySelector(".button-callback-chat");
  const buttonLiker = document.querySelector(".button-liker");
  const collapse = document.querySelector(".collapse");
  const callbackChat = document.querySelector(".callback-chat");
  const liker = document.querySelector(".liker");

  buttonCollapse.addEventListener("click", () => {
    collapse.classList.remove("hidden");
    callbackChat.classList.add("hidden");
    liker.classList.add("hidden");
  });

  buttonCallbackChat.addEventListener("click", () => {
    callbackChat.classList.remove("hidden");
    collapse.classList.add("hidden");
    liker.classList.add("hidden");
  });

  buttonLiker.addEventListener("click", () => {
    liker.classList.remove("hidden");
    callbackChat.classList.add("hidden");
    collapse.classList.add("hidden");
  });

  // collapse
  const btnAddNode = document.querySelector(".btn-add-node");
  const formAddNode = document.querySelector(".form-add-node");
  const btnAdd = formAddNode.querySelector(".btn-add");
  const textarea = formAddNode.querySelector(".textarea-node");
  const btnCollapse = document.querySelector(".btn-collapse");

  const createNode = (text) => {
    const element = document.createElement("div");
    const btn = document.createElement("button");
    const p = document.createElement("p");

    element.classList.add("node");
    btn.classList.add("btn-remove");
    p.classList.add("node-text");

    p.textContent = text;
    btn.textContent = "Удалить заметку";

    element.appendChild(p);
    element.appendChild(btn);

    btn.addEventListener("click", () => {
      element.remove();
    });
    return element;
  };

  btnAddNode.addEventListener("click", () => {
    formAddNode.classList.remove("hidden");
  });

  btnAdd.addEventListener("click", (e) => {
    e.preventDefault();
    formAddNode.classList.add("hidden");
    let text = textarea.value;
    if (text == "") text = "Пустая заметка :(";
    let containerNodes = document.querySelector(".container-nodes");
    if (!containerNodes) {
      let containerNodes = document.createElement("div");
      containerNodes.classList.add("container-nodes");
      document.body.appendChild(containerNodes);
      let node = createNode(text);
      containerNodes.appendChild(node);
      textarea.value = "";
    } else {
      let node = createNode(text);
      containerNodes.appendChild(node);
      textarea.value = "";
    }
  });

  btnCollapse.addEventListener("click", () => {
    const nodesContainer = document.querySelector(".container-nodes");
    if (!nodesContainer) return;
    nodesContainer.classList.toggle("hide");
  });
  // collapse

  //callback-chat
  const circle = document.querySelector(".circle");
  const form = document.querySelector(".form-callback-chat");
  const close = document.querySelector(".form-close");

  circle.addEventListener("click", () => {
    form.classList.remove("form-hidden");
    circle.classList.remove("circle");
    circle.classList.add("circle-hidden");
  });

  // circle.addEventListener("mouseover", () => {
  //   circle.classList.add("circle-hover");
  // });

  // circle.addEventListener("mouseleave", () => {
  //   circle.classList.remove("circle-hover");
  // });

  close.addEventListener("click", () => {
    circle.classList.remove("circle-hidden");
    circle.classList.add("circle");
    form.classList.add("form-hidden");
  });

  //cllback-chat

  //liker
  const btnLike = document.querySelector(".btn-liker");
  const likerContainer = document.querySelector(".liker");

  const trajectorys = {
    1: ["center", "left", "center", "right", "center"],
    2: ["center", "center", "right", "left", "center"],
    3: ["center", "center", "left", "right", "center"],
    4: ["center", "right", "center", "left", "center"],
  };

  const gerRandomIndex = () => {
    return Math.ceil(Math.random() * Object.keys(trajectorys).length);
  };

  btnLike.addEventListener("click", () => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    liker.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    });
    let index = gerRandomIndex();
    let trajectory = trajectorys[index];
  });
  //liker
});
