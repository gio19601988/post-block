"use strict";

// ცვლადების დეკლარაცია
const mainWraper = document.getElementById("post-block");
const overlay = document.getElementById("overlay");
const close = document.getElementById("close");
const contentOverlay = document.getElementById("content");
const addButton = document.getElementById("add");
const postOvelayAdd = document.getElementById("postoverlayadd");
const form = document.getElementById("form");
const input = document.getElementById("titlepost");

//მთავარი ფუნქცია სერვერზე
function ajax(url, callback) {
  let requist = new XMLHttpRequest();
  requist.open("GET", url);
  requist.addEventListener("load", function () {
    // let dabrunebuliPasuxiText = requist.responseText;
    // let dabrunebuliPasuxiJS = JSON.parse(dabrunebuliPasuxiText);
    let dataJs = JSON.parse(requist.responseText);
    callback(dataJs);
  });
  requist.send();
}

ajax("https://jsonplaceholder.typicode.com/posts", function (dataJs) {
  dataJs.forEach((item) => {
    createPost(item);
  });
});


//ვქმნით სათითაოდ თითოეულ დივს + თავისი სტრუქტურით
function createPost(item) {
  const divWraper = document.createElement("div");
  divWraper.classList.add("posts");
  divWraper.setAttribute("data-id", item.id);

  const h3Post = document.createElement("h3");
  h3Post.textContent = item.id;

  const h2Post = document.createElement("h2");
  h2Post.textContent = item.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete This Post";
  deleteButton.setAttribute("data-id", item.id);

  divWraper.appendChild(h3Post);
  divWraper.appendChild(h2Post);
  divWraper.appendChild(deleteButton);

  //deletebutton-is clicki
  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation();
    let id = event.target.getAttribute("data-id");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    fetch(url, {
      method: "DELETE",
    }).then(() => divWraper.remove());
  });

  //   divis-click
  divWraper.addEventListener("click", function (event) {
    // console.log(event.target);
    let id = event.target.getAttribute("data-id");
    // console.log(id);
    overlay.classList.add("activeOverlay");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(url, function (dataJs) {
      overlayFunction(dataJs);
    });
  });

  mainWraper.appendChild(divWraper);
  //   console.log(divWraper);
}


// პოსტის დეტალური ინფრომაციის წამოღების ფუნქცია
function overlayFunction(item) {
  const description = document.createElement("p");
  description.textContent = item.body;

  contentOverlay.appendChild(description);
}

// overlay დახურვა
close.addEventListener("click", function () {
  overlay.classList.remove("activeOverlay");
  contentOverlay.innerHTML = " ";
});

// postis damateba
addButton.addEventListener("click", function () {
  postOvelayAdd.classList.add("addPost");
  input.value = " ";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // console.log(event.target[0].value);
  let formInfo = {
    title: event.target[0].value,
  };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(formInfo),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((item) => {
      createPost(item);
      postOvelayAdd.classList.remove("addPost");
    });
});
