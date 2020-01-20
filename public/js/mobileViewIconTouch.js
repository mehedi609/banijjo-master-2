$(document).ready(function() {
  // Show hide popover
  const hotlineIconMenu = $(".hotlineIconMenu");
  const hotlineMenu = $(".hotlineMenu");

  const accountMenuIcon = $(".accountMenuIcon");
  const accountMenu = $(".accountMenu");

  const helpIconMenu = $(".helpIconMenu");
  const helpMenu = $(".helpMenu");

  hotlineIconMenu.on("touchstart click", function() {
    /*if (!hotlineIconMenu.hasClass("is-active")) {
      console.log("..........hotlineIconMenu...........");
      hotlineIconMenu.addClass("is-active");
      hotlineMenu.addClass(".js-dropdown-active");
    }*/

    hotlineIconMenu.removeClass("is-active");
    hotlineMenu.removeClass(".js-dropdown-active");
    accountMenuIcon.removeClass("is-active");
    helpIconMenu.removeClass("is-active");
    accountMenu.removeClass("js-dropdown-active");
    helpMenu.removeClass("js-dropdown-active");
  });

  accountMenuIcon.on("touchstart", function(e) {
    hotlineIconMenu.removeClass("is-active");
    hotlineMenu.removeClass(".js-dropdown-active");
    accountMenuIcon.removeClass("is-active");
    helpIconMenu.removeClass("is-active");
    accountMenu.removeClass("js-dropdown-active");
    helpMenu.removeClass("js-dropdown-active");
    /*e.stopPropagation();
    if (!accountMenuIcon.hasClass("is-active")) {
      console.log(".............accountMenuIcon.........");
      accountMenuIcon.addClass("is-active");
      accountMenu.addClass("js-dropdown-active");
    }

    hotlineIconMenu.removeClass("is-active");
    helpIconMenu.removeClass("is-active");
    hotlineMenu.removeClass(".js-dropdown-active");
    helpMenu.removeClass("js-dropdown-active");*/
  });
  helpIconMenu.on("touchstart click", function(e) {
    hotlineIconMenu.removeClass("is-active");
    hotlineMenu.removeClass(".js-dropdown-active");
    accountMenuIcon.removeClass("is-active");
    helpIconMenu.removeClass("is-active");
    accountMenu.removeClass("js-dropdown-active");
    helpMenu.removeClass("js-dropdown-active");
    /*e.stopPropagation();
    if (helpIconMenu.hasClass("is-active")) {
      console.log("........helpIconMenu.........");
      helpIconMenu.addClass("is-active");
      helpMenu.addClass("js-dropdown-active");
    }

    hotlineIconMenu.removeClass("is-active");
    accountMenuIcon.removeClass("is-active");
    hotlineMenu.removeClass(".js-dropdown-active");
    accountMenu.removeClass("js-dropdown-active");*/
  });
});
