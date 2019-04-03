const accessToken = "9030bd2f6d2e4b3f8cdb9556a13c3690";
const baseUrl = "https://api.api.ai/api/query?v=20150910";
const sessionId = "1234567890";
const loadingMarkups = `<span class='loader'><span class='loader__dot'></span>
<span class='loader__dot'></span><span class='loader__dot'></span></span>`;
const errorMessage = "Désolé, je ne suis pas disponible pour le moment mais vous pouvez " + "contacter directement Alexandre! (il est gentil et répond très vite)";
const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const loadingDelay = 700;
const aiReplyDelay = 800;
const $document = document;
const $chatbot = $document.querySelector(".chatbot");
const $chatbotMessageWindow = $document.querySelector(".chatbot__message-window");
const $chatbotHeader = $document.querySelector(".chatbot__header");
const $chatbotMessages = $document.querySelector(".chatbot__messages");
const $chatbotInput = $document.querySelector(".chatbot__input");
const $chatbotSubmit = $document.querySelector(".chatbot__submit");
document.addEventListener("keypress", event => {
  if (event.which == 13) {
    validateMessage()
  }
}, {
  passive: !1
});
$chatbotHeader.addEventListener("click", () => {
  toggle($chatbot, "chatbot--closed");
  $chatbotInput.focus()
}, {
  passive: !1
});
$chatbotSubmit.addEventListener("click", () => {
  validateMessage()
}, {
  passive: !1
});
let toggle = (element, klass) => {
  let classes = element.className.match(/\S+/g) || [];
  let index = classes.indexOf(klass);
  index >= 0 ? classes.splice(index, 1) : classes.push(klass);
  element.className = classes.join(" ")
};
let userMessage = content => {
  $chatbotMessages.innerHTML += `<li class='is-user animation'>
      <p class='chatbot__message'>
        ${content}
      </p>
      <span class='chatbot__arrow chatbot__arrow--right'></span>
    </li>`
};
let aiMessage = (content, isLoading = !1, delay = 0) => {
  setTimeout(() => {
    removeLoader();
    $chatbotMessages.innerHTML += `<li
      class='is-ai animation'
      id="${isLoading ? "is-loading" : ""}">
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>
          ${content}
        </div>
      </li>`;
    scrollDown()
  }, delay)
};
let removeLoader = () => {
  let loadingElem = document.getElementById("is-loading");
  if (loadingElem) {
    $chatbotMessages.removeChild(loadingElem)
  }
};
let escapeScript = unsafe => {
  let safeString = unsafe.replace(/</g, " ").replace(/>/g, " ").replace(/&/g, " ").replace(/"/g, " ").replace(/\\/, " ").replace(/\s+/g, " ");
  return safeString.trim()
};
linkify = inputText => {
  return inputText.replace(urlPattern, `<a href='$1' target='_blank'>$1</a>`)
};
let validateMessage = () => {
  let text = $chatbotInput.value;
  let safeText = text ? escapeScript(text) : "";
  if (safeText.length && safeText !== " ") {
    resetInputField();
    userMessage(safeText);
    send(safeText)
  }
  scrollDown();
  return
};
let multiChoiceAnswer = text => {
  let decodedText = text.replace(/zzz/g, "'");
  userMessage(decodedText);
  send(decodedText);
  scrollDown();
  return
};
let processResponse = val => {
  removeLoader();
  if (val.fulfillment) {
    let output = "";
    let messagesLength = val.fulfillment.messages.length;
    for (let i = 0; i < messagesLength; i++) {
      let message = val.fulfillment.messages[i];
      let type = message.type;
      switch (type) {
        case 0:
          let parsedText = linkify(message.speech);
          output += `<p>${parsedText}</p>`;
          break;
        case 1:
          break;
        case 2:
          let title = message.title;
          let replies = message.replies;
          let repliesLength = replies.length;
          output += `<p>${title}</p>`;
          for (let i = 0; i < repliesLength; i++) {
            let reply = replies[i];
            let encodedText = reply.replace(/'/g, "zzz");
            output += `<button onclick='multiChoiceAnswer("${encodedText}")'>${reply}</button>`
          }
          break;
        case 3:
          break
      }
    }
    return output
  } else {
    return val
  }
};
let setResponse = (val, delay = 0) => {
  setTimeout(() => {
    aiMessage(processResponse(val))
  }, delay)
};
let resetInputField = () => {
  $chatbotInput.value = ""
};
let scrollDown = () => {
  let distanceToScroll = $chatbotMessageWindow.scrollHeight - ($chatbotMessages.lastChild.offsetHeight + 60);
  $chatbotMessageWindow.scrollTop = distanceToScroll;
  return !1
};
let send = (text = "") => {
  fetch(`${baseUrl}&query=${text}&lang=en&sessionId=${sessionId}`, {
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => response.json()).then(res => {
    if (res.status < 200 || res.status >= 300) {
      let error = new Error(res.statusText);
      throw error
    }
    return res
  }).then(res => {
    setResponse(res.result, loadingDelay + aiReplyDelay)
  }).catch(error => {
    setResponse(errorMessage, loadingDelay + aiReplyDelay);
    resetInputField();
    console.log(error)
  });
  aiMessage(loadingMarkups, !0, loadingDelay)
};

function fade($ele) {
  $ele.fadeIn(1000).delay(3000).fadeOut(1000, function() {
    var $next = $(this).next(".quote");
    fade($next.length > 0 ? $next : $(this).parent().children().first())
  })
}
fade($(".quoteLoop > .quote").first());
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    $(".main_nav").addClass("sticky");
    $(".chatbot").css("opacity", 1);
    $(".chatbot").css("bottom", 0)
  } else {
    $(".main_nav").removeClass("sticky");
    $(".chatbot").css("opacity", 0);
    $(".chatbot").css("bottom", -500)
  }
  var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop() - $("footer").height();
  if (scrollBottom < $("footer").height()) {
    if ($("#chat").hasClass("chatbot--closed")) {
      $(".chatbot--closed").css("bottom", $("footer").height() - scrollBottom + $(".chatbot--closed").height() / 2 - 3)
    } else {
      $(".chatbot").css("bottom", $("footer").height() - scrollBottom + $(".chatbot").height() / 20)
    }
  }
});
$(".mobile-toggle").click(function() {
  if ($(".main_nav").hasClass("open-nav")) {
    $(".main_nav").removeClass("open-nav")
  } else {
    $(".main_nav").addClass("open-nav")
  }
});
$(".main_nav li a").click(function() {
  if ($(".main_nav").hasClass("open-nav")) {
    $(".navigation").removeClass("open-nav");
    $(".main_nav").removeClass("open-nav")
  }
});
jQuery(document).ready(function($) {
  $(".smoothscroll").on("click", function(e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    $("html, body").stop().animate({
      scrollTop: $target.offset().top
    }, 800, "swing", function() {
      window.location.hash = target
    })
  })
});
TweenMax.staggerFrom(".heading", 0.8, {
  opacity: 0,
  y: 20,
  delay: 0.2
}, 0.4);

function redirect()
{
    window.location.href = "mailto:contact@alexandrebonvalle.fr?subject=Notre affaire&body=Bonjour";
}

function envoie() {

  var nom, mail, message, text, test, envoie, responseRec;
  nom = document.getElementById("txtNom").value;
  mail = document.getElementById("txtMail").value;
  message = document.getElementById("txtMessage").value;
  responseRec = grecaptcha.getResponse();
  $("#txtNom").css("border", "none");
  $("#txtMail").css("border", "none");
  $("#txtMessage").css("border", "none");
  test = !1;
  envoie = !1;
  if (nom.length === 0 && mail.length < 6 && message.length === 0) {
    text = "Merci de remplir tous les champs";
    $("#txtNom").css("border", "2px solid red");
    $("#txtMail").css("border", "2px solid red");
    $("#txtMessage").css("border", "2px solid red");
    test = !0
  } else if (nom.length === 0) {
    text = "Merci de remplir tous les champs !";
    $("#txtNom").css("border", "2px solid red");
    test = !0
  } else if (nom.includes("  ") || nom.includes("0") || nom.includes("1") || nom.includes("2") || nom.includes("3") || nom.includes("4") || nom.includes("5") || nom.includes("6") || nom.includes("7") || nom.includes("8") || nom.includes("9")) {
    text = "Le nom entré est incorrect !";
    $("#txtNom").css("border", "2px solid red");
    test = !0
  } else if (nom.length < 2) {
    text = "Le nom doit faire au moins 2 caractère !";
    $("#txtNom").css("border", "2px solid red");
    test = !0
  } else if (mail.length < 6) {
    text = "Merci de remplir tous les champs !";
    $("#txtMail").css("border", "2px solid red");
    test = !0
  } else if (!mail.includes("@") || !mail.includes(".")) {
    text = "Le mail entré est incorrect !";
    $("#txtMail").css("border", "2px solid red");
    test = !0
  } else if (message.length < 50) {
    text = "Merci de m'envoyer un message d'au moins 50 caractères !";
    $("#txtMessage").css("border", "2px solid red");
    test = !0
  } else if (responseRec.length === 0) {
    text = "Merci de me prouver que je n'ai pas affaire à un robot ! ";
    test = !0
  } else if (test === !1) {
    $(".button-envoyer").addClass("success");
    $("#txtNom").css("display", "none");
    $("#txtMail").css("display", "none");
    $("#txtMessage").css("display", "none");
    $("#labelNom").css("display", "none");
    $("#labelMail").css("display", "none");
    $("#labelMessage").css("display", "none");
    $("#grecaptcha").css("display", "none");
    $("#btnSub").css("display", "none");
    var formData = {
      txtNom: $("input[name=txtNom]").val(),
      txtMail: $("input[name=txtMail]").val(),
      txtMessage: $("textarea[name=txtMessage]").val()
    };
    $.ajax({
      type: "POST",
      url: "./contact.php",
      data: formData,
      dataType: "json",
      encode: !0
    }).done(function(data) {
      if (!data.success) {
        if (data.message == "Error") {
          text = "Une erreur semble s'être produite, merci de réessayer dans quelques instants"
        }
        if (data.message == "Recaptcha error") {
          text = "Il semblerait que vous soyez un robot, si ce n'est pas le cas, merci de réessayer dans quelques instants"
        }
        if (data.message == "error empty") {
          text = "Il semblerait que vous tentiez de m'envoyer un message vide, merci de remplis les champs! Si ce n'est pas le cas, merci de réessayer dans quelques instants"
        }
      } else {
        text = "Le message à bien été envoyé, merci ! J'y répondrais le plus vite possible !"
      }
      document.getElementById("demo").innerHTML = '<i class="fas fa-info-circle"></i> ' + text
    });
    event.preventDefault()
  }
  document.getElementById("demo").innerHTML = '<i class="fas fa-info-circle"></i> ' + text;
  return envoie
}
