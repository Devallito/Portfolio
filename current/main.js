isServerLaunched = false;
var myCodeMirrorMD,
myCodeMirrorHTML,
myCodeMirrorCSS,
myCodeMirrorJS;


var splitter, splitter2, panel_left, panel_right, panel_right2;
var last_x, window_width;

function init(ThreePanels = false) {
  window_width = window.innerWidth;
  splitter = document.getElementById("splitter");
  panel_left = document.getElementById("panel_left");
  panel_right = document.getElementById("panel_right");
  panel_right2 = document.getElementById("panel_right2");
  splitter2 = document.getElementById("splitter2");

  splitter.removeEventListener("mousedown", spMouseDown_3panels_splitter1);
  splitter2.removeEventListener("mousedown", spMouseDown_3panels_splitter2);
  splitter.removeEventListener("mousedown", spMouseDown_2panels);

  var dx = panel_left.clientWidth;
  document.getElementById("reducer_btn").style.left = dx + "px";
  splitter.style.marginLeft = dx + "px";
  dx += splitter.clientWidth;
  //panel_right.style.marginLeft = dx + "px";
  if (ThreePanels) {
    panel_right.style.float = "left";
    panel_right.style.marginLeft = "";
    //panel_right.style.float="left";

    splitter2.style.display = "";
    panel_right2.style.display = "";

    panel_right.style.width = (window_width - dx) / 2 + "px";
    dx += panel_right.clientWidth;
    splitter2.style.marginLeft = dx - 5 + "px";
    dx += splitter2.clientWidth;
    panel_right2.style.marginLeft = dx - 5 + "px";
    panel_right2.style.width = window_width - dx + "px";
    splitter.addEventListener("mousedown", spMouseDown_3panels_splitter1);
    splitter2.addEventListener("mousedown", spMouseDown_3panels_splitter2);
  } else {
    panel_right.style.float = "";

    panel_right.style.marginLeft = dx + "px";
    dx = window_width - dx;
    panel_right.style.width = dx + "px";
    console.log(panel_right.style);
    splitter.addEventListener("mousedown", spMouseDown_2panels);
  }

}

/*----------------------------Gestion du resize 2 panels----------------------------*/
function spMouseDown_2panels(e) {
  splitter.removeEventListener("mousedown", spMouseDown_2panels);
  window.addEventListener("mousemove", spMouseMove_2panels);
  window.addEventListener("mouseup", spMouseUp_2panels);
  last_x = e.clientX;
}

function spMouseUp_2panels(e) {
  window.removeEventListener("mousemove", spMouseMove_2panels);
  window.removeEventListener("mouseup", spMouseUp_2panels);
  splitter.addEventListener("mousedown", spMouseDown_2panels);
  resetPosition_2panels(last_x);
}

function spMouseMove_2panels(e) {
  resetPosition_2panels(e.clientX);
}

function resetPosition_2panels(nowX) {
  var dx = nowX - last_x;
  dx += panel_left.clientWidth;
  document.getElementById("reducer_btn").style.left = dx + "px";
  panel_left.style.width = dx + "px";
  splitter.style.marginLeft = dx + "px";
  dx += splitter.clientWidth;
  panel_right.style.marginLeft = dx + "px";
  dx = window_width - dx;
  panel_right.style.width = dx + "px";
  last_x = nowX;
}
/*---------------------------------------------------------------------------------*/

/*----------------------------Gestion du resize 3 panels----------------------------*/

function spMouseDown_3panels_splitter1(e) {
  splitter.removeEventListener("mousedown", spMouseDown_3panels_splitter1);
  window.addEventListener("mousemove", spMouseMove_3panels_splitter1);
  window.addEventListener("mouseup", spMouseUp_3panels_splitter1);
  last_x = e.clientX;
}

function spMouseDown_3panels_splitter2(e) {
  document.getElementById("frameK").style.display = "none";
  splitter2.removeEventListener("mousedown", spMouseDown_3panels_splitter2);
  window.addEventListener("mousemove", spMouseMove_3panels_splitter2);
  window.addEventListener("mouseup", spMouseUp_3panels_splitter2);
  last_x2 = e.clientX;
}

function spMouseUp_3panels_splitter1(e) {
  window.removeEventListener("mousemove", spMouseMove_3panels_splitter1);
  window.removeEventListener("mouseup", spMouseUp_3panels_splitter1);
  splitter.addEventListener("mousedown", spMouseDown_3panels_splitter1);
  resetPosition_3panels_splitter1(last_x);
}

function spMouseUp_3panels_splitter2(e) {
  document.getElementById("frameK").style.display = "";
  window.removeEventListener("mousemove", spMouseMove_3panels_splitter2);
  window.removeEventListener("mouseup", spMouseUp_3panels_splitter2);
  splitter2.addEventListener("mousedown", spMouseDown_3panels_splitter2);
  resetPosition_3panels_splitter2(last_x2);
}

function spMouseMove_3panels_splitter1(e) {
  resetPosition_3panels_splitter1(e.clientX);
}

function spMouseMove_3panels_splitter2(e) {
  resetPosition_3panels_splitter2(e.clientX);
}

function resetPosition_3panels_splitter1(nowX) {
  var dx = nowX - last_x;
  dx += panel_left.clientWidth;
  document.getElementById("reducer_btn").style.left = dx + "px";
  panel_left.style.width = dx + "px";
  splitter.style.marginLeft = dx + "px";
  dx += splitter.clientWidth;
  //panel_right.style.marginLeft = dx + "px";

  panel_right.style.width = (window_width - dx) / 2 + "px";
  dx += panel_right.clientWidth;
  splitter2.style.marginLeft = dx - 5 + "px";
  dx += splitter2.clientWidth;
  panel_right2.style.marginLeft = dx - 5 + "px";
  panel_right2.style.width = window_width - dx + "px";
  last_x = nowX;
}

function resetPosition_3panels_splitter2(nowX) {
  var dx = nowX - last_x2;
  dx += panel_right.clientWidth;
  panel_right.style.width = dx + "px";
  splitter2.style.marginLeft = dx - 5 + panel_left.clientWidth + splitter.clientWidth + "px";
  dx += splitter2.clientWidth;
  panel_right2.style.marginLeft = dx - 5 + panel_left.clientWidth + splitter.clientWidth + "px";
  dx += panel_left.clientWidth + splitter.clientWidth;
  panel_right2.style.width = window_width - dx + "px";
  last_x2 = nowX;
}
/*---------------------------------------------------------------------------------*/


var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function () {
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
  let idToSet = aList.caption;
  if (idToSet.indexOf(".") !== -1) {
    idToSet = idToSet.substring(0, idToSet.indexOf("."))
  }
  element.setAttribute("id", idToSet);
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
  let captionToCheck;
  for (let i = 0; i < treeview_list.length; i++) {
    captionToCheck = treeview_list[i].caption;
    if (captionToCheck.indexOf(".") !== -1) {
      captionToCheck = captionToCheck.substring(0, captionToCheck.indexOf("."));
    }
    console.log(captionToCheck);
    if (captionToCheck === aCaption) {
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
  //event.target.classList.add("current_open");
  //event.target.focus();
  if (event.currentTarget.classList.contains("folder")) {
    toggleFolder(event.currentTarget.id);
  }
}

function focus_treeviewElement(event) {
  event.currentTarget.classList.add("current_open", "current_focus");

}

function focusout_treeviewElement(event) {
  console.log("focusOut", event.currentTarget);
  event.currentTarget.classList.remove("current_focus");
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
  html: '<div class="Welcome_page_left">\r\n<h1>Développeur Full-Stack</h1>\r\n<h3><a href="">A hackable portfolio for the 21<sup>st</sup> Century</a></h3>\r\n<p>Le portfolio n\'est pas terminé à 100%, il manque encore quelques fonctionnalités.<br>Naviguez comme dans un IDE classique pour accéder<br> aux différentes informations de mon portfolio.</p><ul><li><a href="./contact.html">ContactForm</a> pour me contacter rapidement</li><li><a href="./mentions.html">Mentions légales</a> pour s\'assurer que je respecte le RGPD</li></ul>\r\n</div>\r\n\r\n<div class="Welcome_page_right">\r\n<div class="Welcome_page_box" onclick="this.classList.toggle(\'showInsidePanel\');"><span class="Welcome_page_box_icon">Lire </span>README.md</div>\r\n<div class="insidePanel">Pour comprendre ce portfolio et être sûr de ne rien rater.</div>\r\n<div class="Welcome_page_box" onclick="this.classList.toggle(\'showInsidePanel\');"><span class="Welcome_page_box_icon">Modifier </span>les fichiers</div>\r\n<div class="insidePanel">Comme dans un IDE classique.</div>\r\n<div class="Welcome_page_box" onclick="this.classList.toggle(\'showInsidePanel\');"><span class="Welcome_page_box_icon">Lancer </span>le serveur web</div>\r\n<div class="insidePanel">Packages -> Lancer le serveur web</div>\r\n<div class="Welcome_page_box" onclick="this.classList.toggle(\'showInsidePanel\');"><span class="Welcome_page_box_icon">Contempler </span>le résultat</div>\r\n<div class="insidePanel">Rien de plus à ajouter.</div>\r\n</div>'
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
  html: "<textarea style='README_page'></textarea>"
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
  path: "css\\style.css",
  html: ""
}];

//charge_treeview(treeview_list);

document.querySelectorAll(".title_barre_outil_menu").forEach(function (element) {
  element.classList.add("hide");
});

document.querySelectorAll(".title_barre_outil").forEach(function (element) {
  element.addEventListener("click", function () {
    /*document.querySelectorAll(".title_barre_outil").forEach(function(element2) {
    element2.querySelector(".title_barre_outil_menu").classList.add("hide");
    });*/
    element.querySelector(".title_barre_outil_menu").classList.remove("hide");
    element.querySelector(".title_barre_outil_menu").focus();
  });

  element.addEventListener("focusout", function () {

    element.querySelector(".title_barre_outil_menu").classList.add("hide");
  });

});

function getPath(aCaption) {
  return treeview_list.find(function (anElement) {
    return aCaption === anElement.caption;
  }).path;
}

function getExtension(aCaption) {
  let result = treeview_list.find(function (anElement) {
    return aCaption === anElement.caption;
  }).caption.split("").reverse().join("");

  if (result.indexOf(".") !== -1) {
    document.getElementById("encPage_footer").innerText = "UTF-8";
    document.getElementById("wcrPage_footer").innerText = "CRLF";
    if (result.slice(0, 3) === "dm.") {
      return "GitHub Markdown";
    } else {
      return result.slice(0, result.indexOf(".")).split("").reverse().join("");
    }
  } else {
    document.getElementById("encPage_footer").innerText = "";
    document.getElementById("wcrPage_footer").innerText = "";
    return "";
  }
}
G_lstopentab = ["Welcome_page"];

function openInTab(idNodeToOpen) {
  //voir https://codepen.io/rafaelavlucas/pen/MLKGba
  if (G_lstopentab.indexOf(idNodeToOpen) === -1) {
    G_lstopentab.push(idNodeToOpen);

  }
  let currTab = idNodeToOpen.substring(0, idNodeToOpen.indexOf("_page")) + "_tab";
  console.log(currTab);
  try {
    document.getElementsByClassName("barre_nav_tabs_currOpen")[0].classList.remove("barre_nav_tabs_currOpen");

  } catch (e) {
    console.log(e)
  }
  document.getElementById(currTab).classList.add("barre_nav_tabs_currOpen");
  document.getElementById(currTab).style.display = "";

  for (let i = 0; i < G_lstopentab.length; i++) {
    document.getElementById(G_lstopentab[i]).style.display = "none";
  }
  document.getElementById(idNodeToOpen).style.display = "";
  let jsToShow = "/*jshint esversion: 6 */\r\n/* Portfolio - Alexandre Bonvalle */\r\n document.getElemetById('tes');";
  let htmlToShow = "/*jshint esversion: 6 */\r\n/* Portfolio - Alexandre Bonvalle */\r\n document.getElemetById('tes');";
  let cssToShow = "/*jshint esversion: 6 */\r\n/* Portfolio - Alexandre Bonvalle */\r\n document.getElemetById('tes');";
  let mdToShow="";
  mdToShow+="# Why ? \r\n";
  mdToShow+="Ce portfolio me permet de montrer mes compétences en développement web grâce à un projet concret. \r\n";
  mdToShow+="Calqué sur le design d'Atom, j'ai essayé de rester le plus fidèle possible au logiciel.\r\n";
  mdToShow+="Il me reste beaucoup d'améliorations à apporter, mais n'ayant pas de dead-line :smile: , le projet avance sur mon temps libre lorsque je n'ai pas d'autres projets en cours.\r\n";
  mdToShow+="\r\n";
  mdToShow+="## Pour les non initiés (ou les préssés) \r\n";
  mdToShow+="Pour les personnes n'étant pas à l'aise avec les IDE (ou celles qui veulent juste voir mes compétences et projets rapidement), \r\n";
  mdToShow+="je vous invite à voir le résultat en cliquant sur \"Lancer le serveur web\" dans l'onglet Packages de la barre d'outils. \r\n";
  mdToShow+="\r\n";
  mdToShow+="### Pour les initiés (ou les curieux) \r\n";
  mdToShow+="Je vous invite à cliquer un peu partout ! :thumbsup: \r\n";
  mdToShow+="\r\n";
  mdToShow+="#### Pour tout le monde \r\n";
  mdToShow+="Si vous rencontrez un bug (ne vous inquiétez pas, je l'ai déjà sûrement vu aussi) vous pouvez dans le doute me le signaler en me contactant par mail ! \r\n";
  mdToShow+=":envelope: - contact@alexandrebonvalle.fr \r\n";
  if (document.getElementById(idNodeToOpen).children.length <= 0) {
    switch (idNodeToOpen) {
      case 'README_page':
         myCodeMirrorMD = CodeMirror(document.getElementById("README_page"), {
          value: mdToShow,
          mode: "gfm",
          theme: "dracula oceanic-next",
          lineWrapping: false,
          lineNumbers: true
        });
        break;
      case 'index_page':
         myCodeMirrorHTML = CodeMirror(document.getElementById("index_page"), {
          value: htmlToShow,
          mode: "javascript",
          extraKeys: {
            "Ctrl-Space": "autocomplete"
          },
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          autoCloseBrackets: true,
          theme: "dracula oceanic-next",
          lineWrapping: false,
          lineNumbers: true,
          scrollbarStyle: "overlay"
        });
        break;
      case 'style_page':
         myCodeMirrorCSS = CodeMirror(document.getElementById("style_page"), {
          value: cssToShow,
          mode: "javascript",
          extraKeys: {
            "Ctrl-Space": "autocomplete"
          },
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          autoCloseBrackets: true,
          theme: "dracula oceanic-next",
          lineWrapping: false,
          lineNumbers: true,
          scrollbarStyle: "overlay"
        });
        break;
      case 'main_page':
         myCodeMirrorJS = CodeMirror(document.getElementById("main_page"), {
          value: jsToShow,
          mode: "javascript",
          extraKeys: {
            "Ctrl-Space": "autocomplete"
          },
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          autoCloseBrackets: true,
          theme: "dracula oceanic-next",
          lineWrapping: false,
          lineNumbers: true,
          scrollbarStyle: "overlay"
        });
        break;
    }
  }







  /*let nameFile = idNodeToOpen;
  document.getElementById("namePage_footer").innerText = getPath(nameFile);
  document.getElementById("extPage_footer").innerText = getExtension(nameFile);
  document.getElementsByName("navtabs").forEach(function (aTab) {
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
  }*/
}

function delTab(idNodeToOpen) {
  console.log("DELTAB");
  if (G_lstopentab.indexOf(idNodeToOpen) !== -1) {
    G_lstopentab.splice(G_lstopentab.indexOf(idNodeToOpen), 1);
  }
  let currTab = idNodeToOpen.substring(0, idNodeToOpen.indexOf("_page")) + "_tab";
  console.log(currTab);
  if (document.getElementById(currTab).classList.contains("barre_nav_tabs_currOpen")) {
    document.getElementById(currTab).classList.remove("barre_nav_tabs_currOpen")
    document.getElementById(G_lstopentab[0]).classList.add("barre_nav_tabs_currOpen")

  }
  document.getElementById(currTab).style.display = "none";
}

function createTab(anId) {
  let result = treeview_list.find(function (anItem) {
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
  document.getElementsByName("pageTab").forEach(function (aPage) {
    if (aPage.id === anId + "_page") {
      aPage.style.display = "";
    } else {
      aPage.style.display = "none";
    }
  });
}

//openInTab("Welcome"); //init with welcome page

let show_reducer = function (elem) {
  elem.style.display = "block";
  window.setTimeout(function () {
    elem.classList.add('is-visible'); // Make the element visible
  }, 0.50);
};

let hide_reducer = function (elem) {
  elem.classList.remove('is-visible');
  window.setTimeout(function () {
    elem.style.display = "none";
  }, 50);
};

document.getElementById("panel_left").addEventListener("mouseover", function () {
  show_reducer(document.querySelector(".reducer_btn"));
});
document.getElementById("panel_left").addEventListener("mouseleave", function () {
  hide_reducer(document.querySelector(".reducer_btn"));
});
let callback_show_augmenter = function (event) {
  let show_reducer = function (elem) {
    elem.style.display = "block";
    window.setTimeout(function () {
      elem.classList.add('is-visible2'); // Make the element visible
    }, 0.50);
  };

  let hide_reducer = function (elem) {
    elem.classList.remove('is-visible2');
    window.setTimeout(function () {
      elem.style.display = "none";
    }, 50);
  };
  if (event.clientX < 50) {
    if (document.getElementById("augmenter_btn").style.display !== "block") {
      show_reducer(document.getElementById("augmenter_btn"));
    }
  } else {
    if (document.getElementById("augmenter_btn").style.display !== "none") {
      hide_reducer(document.getElementById("augmenter_btn"));
    }
  }
}

function toggle_panel() {
  if (document.getElementById("panel_left").style.display == "none") {
    augment_panel();
  } else {
    reduce_panel();
  }
}

function reduce_panel() {
  document.getElementById("panel_left").style.display = "none";
  document.getElementById("splitter").style.display = "none";
  document.getElementById("panel_right").style["margin-left"] = "";
  document.getElementById("panel_right").style.width = "100%";
  //create div here
  let augmenter = document.createElement("div");
  augmenter.setAttribute("id", "augmenter_btn");
  augmenter.setAttribute("class", "augmenter_btn");
  augmenter.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16"><path fill="#9da5b4" fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"/></svg>';
  augmenter.setAttribute("onclick", "augment_panel()");
  document.body.appendChild(augmenter);

  document.addEventListener("mousemove", callback_show_augmenter, passiveSupported ? {
    passive: true
  } : false);
}

function augment_panel() {
  document.removeEventListener("mousemove", callback_show_augmenter, passiveSupported ? {
    passive: true
  } : false);
  document.getElementById("panel_left").style.display = "";
  document.getElementById("splitter").style.display = "";
  document.getElementById("panel_right").style["margin-left"] = "";
  document.getElementById("panel_right").style.width = "";
  init();
  document.body.removeChild(document.getElementById("augmenter_btn"));
}

function Packages_launchServer() {
  //window.location.href = "https://alexandrebonvalle.fr/server/";
  if (!isServerLaunched) {
    isServerLaunched = true;
    init(true);
  }
}


/**/
var Browser = function (elem) {
  var that = this;

  that.elem = elem;
  that.url = that.elem.getAttribute("data-url") || 'http://127.0.0.1:5500/index.html';

  that.timer;

  that.address_bar;
  that.iframe;

  // the entire logic
  that.createBrowser().loadUrl();

}

Browser.prototype.createBrowser = function () {
  var that = this;

  var ctrls, ctrlBtn, previous, next, bar, address, reload, content, thewebsite;

  //    empty the original
  while (that.elem.firstChild) {
    that.elem.removeChild(that.elem.firstChild);
  }

  //    The ctrls
  ctrls = document.createElement("div");
  ctrls.className += " ctrls";

  ctrlBtn = document.createElement("div");
  ctrlBtn.className += " ctrl-btn";
  ctrls.appendChild(ctrlBtn);

  previous = document.createElement("div");
  next = document.createElement("div");
  previous.className += " previous";
  next.className += " next";
  ctrlBtn.appendChild(previous);
  ctrlBtn.appendChild(next);


  bar = document.createElement("div");
  bar.className += " bar";
  ctrls.appendChild(bar);

  address = document.createElement("input");
  address.className += " address";
  address.value = that.url;

  address.onkeyup = function (e) {
    clearTimeout(that.timer);
    if (e.which == 13) {
      that.url = address.value;
      that.loadUrl();
    } else {
      that.timer = setTimeout(function () {
        that.url = address.value;
        that.loadUrl();
      }, 3000);
    }
  };

  that.address_bar = address;
  bar.appendChild(address);

  reload = document.createElement("div");
  reload.className += " reload";
  reload.addEventListener("click", function () {
    that.loadUrl();
  })
  bar.appendChild(reload);

  //    content
  content = document.createElement("div");
  content.setAttribute('id', 'contentK');
  content.className += " content";

  thewebsite = document.createElement("iframe");
  thewebsite.className += " thewebsite";
  thewebsite.setAttribute('id', 'frameK');
  thewebsite.setAttribute('frameborder', 0);
  thewebsite.setAttribute('sandbox', 'allow-forms allow-modals allow-scripts');

  //    thewebsite.src = that.url; // chaining at the beginning;
  that.iframe = thewebsite;
  content.appendChild(thewebsite);

  that.elem.appendChild(ctrls);
  that.elem.appendChild(content);

  return that;
}


Browser.prototype.loadUrl = function () {
  var that = this;
  let lstPageServer = ["http://127.0.0.1:5500/index.html"];
  if (lstPageServer.indexOf(that.address_bar.value) != -1) {

    var old_element = document.getElementById("frameK");
    var new_element = old_element.cloneNode(true);    
    new_element.removeAttribute("src");
    new_element.removeAttribute("sandbox");
    old_element.parentNode.replaceChild(new_element, old_element);

    var html =myCodeMirrorHTML.getValue();
    var css=  myCodeMirrorCSS.getValue();
    var js =myCodeMirrorJS.getValue();

      var previewFrame = document.getElementById('frameK');
      var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
      preview.open();
      preview.write(html);
      preview.close();
    } else {
    that.iframe.src = that.address_bar.value;

  }
}

// onload, reference all browsers and make them work! :)

var browsers = document.getElementsByClassName("z-browser");
for (var i = 0; i < browsers.length; i++) {
  var browser = browsers[i];
  new Browser(browser);
}