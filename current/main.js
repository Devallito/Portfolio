var splitter, cont1, cont2;
var last_x, window_width;

function init() {
  window_width = window.innerWidth;
  splitter = document.getElementById("splitter");
  cont1 = document.getElementById("panel_left");
  cont2 = document.getElementById("panel_right");
  var dx = cont1.clientWidth;
  splitter.style.marginLeft = dx + "px";
  dx += splitter.clientWidth;
  cont2.style.marginLeft = dx + "px";
  dx = window_width - dx;
  cont2.style.width = dx + "px";
  splitter.addEventListener("mousedown", spMouseDown);
}

function spMouseDown(e) {
  splitter.removeEventListener("mousedown", spMouseDown);
  window.addEventListener("mousemove", spMouseMove);
  window.addEventListener("mouseup", spMouseUp);
  last_x = e.clientX;
}

function spMouseUp(e) {
  window.removeEventListener("mousemove", spMouseMove);
  window.removeEventListener("mouseup", spMouseUp);
  splitter.addEventListener("mousedown", spMouseDown);
  resetPosition(last_x);
}

function spMouseMove(e) {
  resetPosition(e.clientX);
}

function resetPosition(nowX) {
  var dx = nowX - last_x;
  dx += cont1.clientWidth;
  cont1.style.width = dx + "px";
  splitter.style.marginLeft = dx + "px";
  dx += splitter.clientWidth;
  cont2.style.marginLeft = dx + "px";
  dx = window_width - dx;
  cont2.style.width = dx + "px";
  last_x = nowX;
}

var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", options, options);
  window.removeEventListener("test", options, options);
} catch (err) {
  passiveSupported = false;
}

function recursiveTree(array) {
  function getChildren(parents, input) {
    return parents.map(parent => {
      const children = input.filter(x => x.PId === parent.Id);
      parent.children = children;
      if (children.length === 0) {
        return parent;
      } else {
        parent.children = getChildren(children, input);
        return parent;
      }
    })
  }
  const roots = array.filter(x => x.PId === -1);
  return getChildren(roots, array);
}

/*function writeInDOM(anElement) {
  let element = document.createElement("div");
  element.setAttribute("id", anElement.caption);
  element.setAttribute("tabindex", 0)
  element.setAttribute("class", anElement.type + " lvl" + (anElement.lvl));
  if(anElement.type === 'folder'){
  element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill="#9DA5B4" fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"/></svg>' + anElement.caption;
}else if(anElement.type === 'file'){
  element.innerHTML = "<img title='" + anElement.caption + "' class='atom_icons' src='./atom-icons/file.svg'> " + anElement.caption;
}
  document.getElementById("treeview").appendChild(element);
}*/

function writeInDOMRecursively(aList) {
  let element = document.createElement("div");
  element.setAttribute("id", aList.caption);
  element.setAttribute("tabindex", 0)
  element.setAttribute("class", aList.type + " lvl" + (aList.lvl));
  if (aList.type === 'folder') {
    element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><title>' + aList.caption + '</title><path fill="#9DA5B4" fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"/></svg><span class="treeview_span_elemName" title="' + aList.caption + '">' + aList.caption + '</span>';
  } else if (aList.type === 'file') {
    element.setAttribute("onclick", "openInTab(this.id)");
    element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><title>' + aList.caption + '</title><path fill="#9DA5B4" fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"/></svg><span class="treeview_span_elemName" title="' + aList.caption + '">' + aList.caption + '</span>';
  }
  document.getElementById("treeview").appendChild(element);
  if (typeof aList.children !== "undefined") {
    for (var i = 0; i < aList.children.length; i++) {
      writeInDOMRecursively(aList.children[i]);
    }
  }
}

function getCorresponding(aCaption) {
  for (let i = 0; i < treeview_list.length; i++) {
    if (treeview_list[i].caption === aCaption) {
      return treeview_list[i];
    }
  }
  return;
}

function toggleFolder(anId) {
  let elemCorresponding = getCorresponding(anId);
  let arrToToggle = [];
  for (let i = 0; i < treeview_list.length; i++) {
    var toCollapse;
    if (treeview_list[i].PId === elemCorresponding.Id || arrToToggle.indexOf(treeview_list[i].PId) != -1) {
      if (treeview_list[i].PId === elemCorresponding.Id && document.getElementById(treeview_list[i].caption).classList.contains("hide")) {
        toCollapse = true;
      } else if (treeview_list[i].PId === elemCorresponding.Id && (!document.getElementById(treeview_list[i].caption).classList.contains("hide"))) {
        toCollapse = false;
      }
      arrToToggle.push(treeview_list[i].Id);
      if (!toCollapse) {
        document.getElementById(treeview_list[i].caption).classList.add("hide");
      } else {
        document.getElementById(treeview_list[i].caption).classList.remove("hide");
      }

    }
  }
}

function click_treeviewElement(event) {
  var elements2 = document.getElementById("treeview").getElementsByClassName("current_open");
  if (elements2.length > 0) {
    console.log(elements2);
    elements2[0].classList.remove("current_open");
  }
  event.target.classList.add("current_open");
  event.target.focus();
  if (event.target.classList.contains("folder")) {
    toggleFolder(event.target.id);

  }
}

function focus_treeviewElement(event) {
  event.target.classList.add("current_focus");
}

function focusout_treeviewElement(event) {
  console.log("focusOut", event.target);
  event.target.classList.remove("current_focus");
}

function charge_treeview(aListToOrder) {
  const listOrdered = recursiveTree(aListToOrder);
  writeInDOMRecursively(listOrdered[0]);
  /*for (let i = 0; i < aList.length; i++) {
    writeInDOM(aList[i]);
  }*/
  let elements = document.getElementById("treeview").querySelectorAll("div.folder,div.file");

  for (let j = 0; j < elements.length; j++) {
    elements[j].addEventListener("mousedown", click_treeviewElement, passiveSupported ? {
      passive: true
    } : false);
    elements[j].addEventListener("focus", focus_treeviewElement, passiveSupported ? {
      passive: true
    } : false);
    elements[j].addEventListener("focusout", focusout_treeviewElement, passiveSupported ? {
      passive: true
    } : false);
  }
}

treeview_list = [{
  PId: -2,
  Id: -2,
  lvl: -2,
  caption: "Welcome",
  type: "noshow",
  path: "Welcome",
  html: '<div class="Welcome_page_left">\r\n<h1>Développeur Full-Stack</h1>\r\n<h3><a href="">A hackable portfolio for the 21<sup>st</sup> Century</a></h3>\r\n<p>naviguer comme ide</p>\r\n</div>\r\n\r\n<div class="Welcome_page_right">\r\n<div class="Welcome_page_box"><span class="Welcome_page_box_icon">Lire </span>README.md</div>\r\n<div class="Welcome_page_box"><span class="Welcome_page_box_icon">Ouvrir </span>les fichiers</div>\r\n<div class="Welcome_page_box"><span class="Welcome_page_box_icon">Open </span>c</div>\r\n<div class="Welcome_page_box"><span class="Welcome_page_box_icon">Open </span>d</div>\r\n</div>'
}, {
  PId: -1,
  Id: 1,
  lvl: 0,
  caption: "root",
  type: "folder",
  path: "",
  html: ""
}, {
  PId: 1,
  Id: 2,
  lvl: 1,
  caption: "README.md",
  type: "file",
  path: "README.md",
  html: ""
}, {
  PId: 1,
  Id: 3,
  lvl: 1,
  caption: "index.html",
  type: "file",
  path: "index.html",
  html: ""
}, {
  PId: 1,
  Id: 4,
  lvl: 1,
  caption: "css",
  type: "folder",
  path: "",
  html: ""
}, {
  PId: 4,
  Id: 5,
  lvl: 2,
  caption: "style.css",
  type: "file",
  path: "css\style.css",
  html: ""
}];

charge_treeview(treeview_list);

document.querySelectorAll(".title_barre_outil_menu").forEach(function(element) {
  element.classList.add("hide");
});

document.querySelectorAll(".title_barre_outil").forEach(function(element) {
  element.addEventListener("click", function() {
    /*document.querySelectorAll(".title_barre_outil").forEach(function(element2) {
    element2.querySelector(".title_barre_outil_menu").classList.add("hide");
    });*/
    element.querySelector(".title_barre_outil_menu").classList.remove("hide");
    element.querySelector(".title_barre_outil_menu").focus();
  });

  element.addEventListener("focusout", function() {

    element.querySelector(".title_barre_outil_menu").classList.add("hide");
  });

});

function getPath(aCaption) {
  return treeview_list.find(function(anElement) {
    return aCaption === anElement.caption;
  }).path;
}

function openInTab(idNodeToOpen) {
  let nameFile = idNodeToOpen;
  document.getElementById("namePage_footer").innerText = getPath(nameFile); //set path
  document.getElementsByName("navtabs").forEach(function(aTab) {
    aTab.classList.remove("barre_nav_tabs_currOpen");
  });
  let currTab = document.getElementById(nameFile + "_tab");
  if (currTab) {
    currTab.classList.add("barre_nav_tabs_currOpen");
    showTab(nameFile);
  } else {
    let tab = document.createElement("div");
    tab.setAttribute("id", nameFile + "_tab");
    tab.setAttribute("name", "navtabs");
    tab.setAttribute("onclick", "openInTab('" + nameFile + "')");
    tab.setAttribute("class", "barre_nav_tabs barre_nav_tabs_currOpen");
    tab.innerText = nameFile;
    document.getElementById("barre_nav").appendChild(tab);
    createTab(nameFile);
  }
}

function createTab(anId) {
  let result = treeview_list.find(function(anItem) {
    return anItem.caption === anId;
  });

  let aPage = document.createElement("div");
  aPage.setAttribute("id", result.caption + "_page");
  aPage.setAttribute("name", "pageTab");
  aPage.innerHTML = result.html;
  document.getElementById("pages").appendChild(aPage);
  showTab(anId);

}

function showTab(anId) {
  document.getElementsByName("pageTab").forEach(function(aPage) {
    if (aPage.id === anId + "_page") {
      aPage.classList.remove("hide");
    } else {
      aPage.classList.add("hide");
    }
  });
}

openInTab("Welcome"); //init with welcome page

document.getElementById("panel_left").addEventListener("hover", function() {
  //show hidingpanelbutton
})
