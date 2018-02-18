// Generated by CoffeeScript 1.10.0
var CLASSES, CURRENT_CLASSE, CURRENT_EVAL, DATA, DATA_TEMP, DOMAINES, Descripteur, Domaine, ID, SELECTED_DOMS, STUDENTS, STUDENTS_LENGTH, Signifiant, statusChangeCallback, tuto;

ID = 1000;

STUDENTS_LENGTH = 0;

STUDENTS = {};

SELECTED_DOMS = [];

DOMAINES = {};

DATA = [];

DATA_TEMP = {};

CLASSES = [];

CURRENT_EVAL = {};

CURRENT_CLASSE = void 0;

tuto = false;

Descripteur = (function() {
  function Descripteur(descripteur1, item1, signifiantItem) {
    this.descripteur = descripteur1;
    this.item = item1;
    this.signifiantItem = signifiantItem;
    this.id = ID++;
    this.html = "<li id='" + this.id + "' class='descripteur' data-descripteur='" + this.descripteur + "' data-item='" + this.item + "' data-signifiant-item='" + this.signifiantItem + "' data-color='white'>\n    <div class='head'>" + this.descripteur + "</div>\n</li>";
  }

  return Descripteur;

})();

Signifiant = (function() {
  function Signifiant(signifiant1, item1, domaine) {
    this.signifiant = signifiant1;
    this.item = item1;
    this.domaine = domaine;
    this.id = ID++;
    this.html = "<div id='" + this.id + "' class='signifiant' data-item='" + this.item + "' data-color='white' data-signifiant='" + this.signifiant + "' data-domaine='" + this.domaine + "' data-score='0'>\n    <div class='head'>\n        <span class='sigtitle'>" + this.signifiant + "</span><button class='toggleDescripteurs black hide' data-id='" + this.id + "'>+/-</button> \n    </div>\n    <div class='descripteurs'>\n        <ul></ul>\n    </div>\n</div>";
  }

  return Signifiant;

})();

Domaine = (function() {
  function Domaine(domaine, desc, iconUrl) {
    this.domaine = domaine;
    this.desc = desc;
    this.iconUrl = iconUrl;
    this.id = ID++;
    this.htmlTab = "<div class='domaine__tab hide' data-id='" + this.id + "' data-domaine='" + this.domaine + "'>\n    <div class='head'>\n        <img class='domaine__icon' src='" + this.iconUrl + "'>\n    </div>\n</div>";
    this.html = "<div id='" + this.id + "' class='domaine' data-domaine='" + this.domaine + "' data-description='" + this.desc + "' data-icon='" + this.iconUrl + "'>\n    <div class='head'>  \n        <img class='domaine__icon' src='" + this.iconUrl + "' data-domaine='" + this.domaine + "'>\n     \n        <div class=\"domDescription\">\n            <div class='domaine__name'>\n            " + this.domaine + " : " + this.desc + "\n            </div>\n        </div>\n    </div>\n    <div class='signifiants'></div>\n</div>";
  }

  return Domaine;

})();

statusChangeCallback = function(response) {
  return FB.api('/me', function(response) {
    var id, img, nom;
    nom = response.first_name + " " + response.name;
    id = response.id;
    img = "<img src='http://graph.facebook.com/" + response.id + "/picture' style='display:inline-block'>";
    $("#fbButton").remove();
    $("#student").before(img);
    return $("#student").val(nom);
  });
};

$(function() {
  var toggleSignifiant;
  window.onbeforeunload = function() {
    return "";
  };
  $.getJSON("S4C_cat.json", function(data) {
    var des, descripteur, descripteurs, dom, i, j, k, len, nom, ref, sig, signifiant;
    DOMAINES = data;
    for (nom in DOMAINES) {
      CURRENT_EVAL[nom] = {};
      dom = new Domaine(nom, data[nom].description, data[nom].iconUrl);
      $("#tabs").append(dom.htmlTab);
      $("#domaines_area").append(dom.html);
      i = 1;
      ref = data[nom].signifiants;
      for (signifiant in ref) {
        descripteurs = ref[signifiant];
        sig = new Signifiant(signifiant, nom + "." + (i++), dom.domaine);
        $(".domaine[data-domaine='" + sig.domaine + "']").find(".signifiants").append(sig.html);
        j = 1;
        for (k = 0, len = descripteurs.length; k < len; k++) {
          descripteur = descripteurs[k];
          des = new Descripteur(descripteur, sig.item + "." + (j++), sig.item);
          $(".signifiant[data-item='" + sig.item + "'] .descripteurs ul").append(des.html);
        }
      }
    }
    $("#edit").prop("checked", false);
    $(".toggleDescripteurs").click();
    return $(".domaine").hide();
  });
  $("body").on("click", ".domaine__tab", function(event) {
    var id;
    id = $(this).data("id");
    $(this).toggleClass("show hide");
    if ($(this).hasClass("show")) {
      return $("#" + id).show();
    } else {
      return $("#" + id).hide();
    }
  });
  toggleSignifiant = function(id) {
    var $signifiant, color, dom, item, nb, note_overall, note_select, ref, ref1, ref2, ref3, ref4, ref5, ref6, score, select, total;
    $signifiant = $("#" + id);
    item = $signifiant.data("item");
    dom = $signifiant.data("domaine");
    color = $signifiant.data("color");
    switch (color) {
      case "white":
        ref = ["shaded", 0], color = ref[0], score = ref[1];
        break;
      case "shaded":
        ref1 = ["red", 10], color = ref1[0], score = ref1[1];
        break;
      case "red":
        ref2 = ["yellow", 25], color = ref2[0], score = ref2[1];
        break;
      case "yellow":
        ref3 = ["lightGreen", 40], color = ref3[0], score = ref3[1];
        break;
      case "lightGreen":
        ref4 = ["green", 50], color = ref4[0], score = ref4[1];
        break;
      case "green":
        if ($("#simplify").hasClass("show")) {
          ref5 = ["shaded", 0], color = ref5[0], score = ref5[1];
        } else {
          ref6 = ["white", 0], color = ref6[0], score = ref6[1];
        }
    }
    $signifiant.attr("data-color", color);
    $signifiant.data("color", color);
    $signifiant.attr("data-score", score);
    $signifiant.data("score", score);
    total = 0;
    $(".signifiant:not([data-color='white'])").each(function() {
      return total += parseInt($(this).attr("data-score"), 10);
    });
    nb = $(".signifiant:not([data-color='white'])").length;
    select = $(".signifiant:not([data-score='0'])").length;
    note_overall = Math.round(total * 20 / (nb * 50));
    if (select === NaN) {
      note_select = 0;
    } else {
      note_select = Math.round(total * 20 / (select * 50));
    }
    $("#note_overall").html("Global : " + total + "/" + (nb * 50) + " soit " + note_overall + "/20 | ");
    return $("#note_select").html("Évalué : " + total + "/" + (select * 50) + " soit " + note_select + "/20");
  };
  $("body").on("click", ".signifiant", function() {
    var id;
    id = $(this).attr("id");
    return toggleSignifiant(id);
  });
  $("body").on("click", ".toggleDescripteurs", function(event) {
    var id;
    event.stopPropagation();
    id = $(this).data("id");
    $(this).toggleClass("hide show");
    return $("#" + id + " .descripteurs").toggle();
  });
  $("body").on("click", "#simplify", function(event) {
    console.log("helo");
    return $(".signifiant[data-color='white']").toggleClass("simplify");
  });
  return $("#student").on("change", function() {
    return $('head title', window.parent.document).text($(this).val());
  });
});
