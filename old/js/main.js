function fade(n) {
    n.fadeIn(1e3).delay(3e3).fadeOut(1e3, function () {
        var n = $(this).next(".quote");
        fade(n.length > 0 ? n : $(this).parent().children().first())
    })
}
fade($(".quoteLoop > .quote").first()), $(window).scroll(function () {
    $(window).scrollTop() > 300 ? $(".main_nav").addClass("sticky") : $(".main_nav").removeClass("sticky");
    $(document).height(), $(window).height(), $(window).scrollTop(), $("footer").height()
}), $(".mobile-toggle").click(function () {
    $(".main_nav").hasClass("open-nav") ? $(".main_nav").removeClass("open-nav") : $(".main_nav").addClass("open-nav")
}), $(".main_nav li a").click(function () {
    $(".main_nav").hasClass("open-nav") && ($(".navigation").removeClass("open-nav"), $(".main_nav").removeClass("open-nav"))
}), jQuery(document).ready(function (n) {
    n(".smoothscroll").on("click", function (a) {
        a.preventDefault();
        var o = this.hash,
            e = n(o);
        n("html, body").stop().animate({
            scrollTop: e.offset().top
        }, 800, "swing", function () {
            window.location.hash = o
        })
    })
}), TweenMax.staggerFrom(".heading", .8, {
    opacity: 0,
    y: 20,
    delay: .2
}, .4);


/*separation*/
//https://codepen.io/ig_design/pen/aXXOqw
/*
https://codepen.io/benavern/pen/zGRBJe
https://codepen.io/chriscoyier/pen/KLWgVy
https://codepen.io/alex_nemankov/pen/VqBdNR
https://codepen.io/mglnb/pen/XMpzzV
*/

var passiveSupported = false;
try {
  var options = {
    get passive() { // This function will be called when the browser
      //   attempts to access the passive property.
      passiveSupported = true;
    }
  };
  window.addEventListener("test", options, options);
  window.removeEventListener("test", options, options);
} catch (err) {
  passiveSupported = false;
}


let callbackmouseenter = function(event) {
  var targ = event.originalTarget.children[0].children[0];
  targ.classList.remove("closed");
  event.originalTarget.removeEventListener("mouseenter", callbackmouseenter, passiveSupported ? {
    passive: true
  } : false);
  event.originalTarget.addEventListener("mouseleave", callbackmouseleave, passiveSupported ? {
    passive: true
  } : false);
}

let callbackmouseleave = function(event) {
  var timeoutID;
  let callbackmousereenter = function(event) {
    var targ = event.originalTarget.children[0].children[0];
    window.clearTimeout(timeoutID);
  }
  var targ = event.originalTarget.children[0].children[0];
  event.originalTarget.addEventListener("mouseenter", callbackmousereenter, passiveSupported ? {
    passive: true
  } : false);
  timeoutID = window.setTimeout(function() {
    targ.classList.add("closed");
    event.originalTarget.removeEventListener("mouseenter", callbackmousereenter, passiveSupported ? {
      passive: true
    } : false);
    event.originalTarget.addEventListener("mouseenter", callbackmouseenter, passiveSupported ? {
      passive: true
    } : false);
    event.originalTarget.removeEventListener("mouseleave", callbackmouseleave, passiveSupported ? {
      passive: true
    } : false);
  }, 2000);
}

Array.from(document.getElementsByClassName("wrapper")).forEach((element) => {
  // Do stuff here
  element.addEventListener("mouseenter", callbackmouseenter, passiveSupported ? {
    passive: true
  } : false);
});
