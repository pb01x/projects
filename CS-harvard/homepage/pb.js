
console.log($("body"));

const rqst = {
    post: (url, data, callback) => {
        // start("transport-time");
        $.ajax({
            type: "GET",
            dataType: "text",
            url: url ?? window.location.pathname,
            // data: process_ajax_data({ ...data }),
            success: function(response) {
                $("x-pop").css("display", "none");
                pagedata = [];

                if (callback) {
                    let dddd=[];
                    dddd["layout"]=response;
                    callback(dddd);
                    return;
                }

                // history.pushState(null, '', url);
                handleLayout(response);
                feather.replace();
                ext.autopad();
                ext.r1panel(true);
                // let resp = processRawResponse(response);
                // console.log(resp);

                // rqst.handler(resp);
            },
            error: function(e) {
                end("transport-time");
                console.log(e.statusText);
                console.log("ERROR-ajax");

            }

        });
    }
}




function handleLayout(layout, parent, data = [], clear = true) {
    let _ = {};
    parent = parent ?? $("x-bdy");
    data["parent"] = parent;
    if (clear) {
        parent.html("");
        parent.removeAttr("style");
        parent.removeAttr("Class");

    }
    Object.defineProperty(_, "style", {
        set(value) {
            parent.attr("style", value);
        },
    });
    Object.defineProperty(_, "class", {
        set(value) {
            parent.attr("class", value);
        },
    });
    Object.defineProperty(_, "parent", {
        set(value) {
            parent = $(value);
        },
    });

    Object.defineProperty(_, "datapool", {
        set(value) { },
    });

    Object.defineProperty(_, "static", {
        set(value) {
            if (parent.attr("static-id") != value) {
                parent.html("");
                parent.removeAttr("style");
                parent.removeAttr("class");
                parent.attr("static-id", value);
            }
            else {
                throw "static";
            }
        },
    });

    Object.defineProperty(_, "pop", {
        set(value) {
            parent = $("x-pop .content");
            parent.html("");
            parent.removeAttr("style");
            $("x-pop").css("display", "block");
        }
    });

    Object.defineProperty(_, "view", {
        set(value) {
            try {
                xparent = value["parent"] != undefined ? $(value["parent"]) : parent;
                let vw = view[value["type"]](value);
                xparent.append(vw);
            } catch (error) {

                console.log(error);
                console.log("error Creating VIEW " + value["type"]);
            }
        },
    });
    Object.defineProperty(_, "widget", {
        set(value) {
            try {
                let widget = $(`<div></div>`);
                xparent = value["parent"] != undefined ? $(value["parent"]) : parent;
                xparent.append(widget);
                value['parent'] = widget;

                // handleLayout(getwidget(value["type"]), widget, value);
                widx[value["type"]](handleLayout(null, widget, value), value);

                if (widget.html() == "") widget.remove();
                widget.addClass("w-" + value["type"]);
                applyAttr(widget, value);

            } catch (error) {
                if (error == "static") return;
                console.log("error Creating WIDGET " + value["type"]);
            }
        },
    });

    if (layout == null) return _;

    try {
        eval(layout);
    } catch (error) {
        console.log("eval error");
        console.log(error);
    }

}


function applyAttr(widget, layout) {
    for (const key in layout) {
        switch (key) {
            case "class":
                widget.addClass(layout[key]);
                break;
            case "style":
                widget.attr("style", layout[key]);
                break;
            case "id":
                widget.attr("id", layout[key]);
                break;
            case "attr":
                for (const km in layout[key]) {
                    if (layout[key][km] == undefined) continue;
                    widget.attr(km, layout[key][km]);
                }
                break;
        }
    }
}

const view = {
    tv: (layout) => {
        return createElement("span", layout);
    },
    a: (layout) => {
        return createElement("a", layout);
    },
    btn: (layout) => {
        return createElement("button", layout);
    },
    container: (layout) => {
        return createElement("div", layout);
    },
    input: (layout) => {
        return createElement("input", layout);
    },
    textarea: (layout) => {
        return createElement("textarea", layout);
    },
    select: (layout) => {
        return createElement("select", layout);
    }
};

function createElement(tag, layout) {
    let outp = tag != "input" ? `<${tag} *attributes>*txt</${tag}>` : `<${tag} autocomplete="off" *attributes>`;
    let attr = "";
    let txt = "";
    for (const key in layout) {
        if (layout[key] == undefined) continue;
        switch (key) {
            case "txt":
                txt += getViewStr(layout[key]);
                break;
            case "name":
                attr += ` name="${layout[key]}"`;
                break;
            case "href":
                attr += ` href="${layout[key]}"`;
                break;
            case "class":
                attr += ` class="${layout[key]}"`;
                break;
            case "style":
                attr += ` style="${layout[key]}"`;
                break;
            case "id":
                attr += ` id="${layout[key]}"`;
                break;
            case "value":
                attr += ` value="${layout[key]}"`;
                break;
            case "placeholder":
                attr += ` placeholder="${getViewStr(layout[key], 1)}"`;
                break;
            case "attr":
                for (const km in layout[key]) {
                    if (layout[key][km] == undefined) continue;
                    attr += ` ${km}="${layout[key][km]}"`;
                }
                break;
            case "attrx":
                attr += " " + layout[key] + " ";
                break;
            case "options":
                for (const k in layout[key]) {
                    let kxm = layout[key][k];
                    txt += `<option value='${kxm[0]}'>${kxm[1]}</option>`;
                }
                break;
            default:
                break;
        }
    }

    outp = outp.replace("*txt", txt);
    outp = outp.replace("*attributes", attr);
    return outp;
}


//ext

$("html").on("click", ".link1 a", function (e) {
    let el = $(e.currentTarget);
    let grp = $(el).closest(".grp");
    $(grp).find(".link1 a").removeClass("active");
    el.addClass("active");
  });

  var a = 0;
  const ext = {
    randid: (length) => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      a++;
      return "a" + result + a;
    },
    getwidget: (wname) => {
      return getwidget(wname);
    },
    randkey: (length) => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:|<>?,.~";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    r1panel: (clear) => {
      if (clear) $("x-r1panel").html("");
      $("x-r1panel").append($($("x-bdy").find(".cmenux")).html());
    },
    handlelayout: (layout,parent,data,clear) => {
      handleLayout(layout,parent,data,clear)
    },
    autopad: () => {
      if ($("menu-l").width() > 20) {
        $("menu-l").css("min-width", "200px");
      }
      // $("x-bdy").css("padding-left", $("menu-l").width()+10);
      $("x-bdy").css("padding-top", $("menu-t").height());
      $("x-fav").css("top", $("menu-t").height());

      $("menu-l").css("padding-top", $("menu-t").height() + 20);

      // if ($("x-pop").css("position")!="fixed") {
      //     $("x-pop").css("padding-top", $("menu-t").height() );
      //     $("x-pop").css("background", $("x-bdy").css("background-color"));

      // }
    },
    shortcut: (key, exec) => {
      if (pagedata["shortcut"] == undefined) pagedata["shortcut"] = {};
      pagedata["shortcut"][key] = exec;
    },
    exec: (str) => {
      let instr = str.split(".");

      switch (instr[0]) {
        case "run":
          eval("ext." + instr[1]);
          break;
        case "handleform":
          handleform(instr[1], instr[2]);
          break;
        case "logout":
          rqst.post(null, { rqtype: "subacc", data: "logout." + instr[1] });
          break;
        case "login":
          rqst.post(null, { rqtype: "subacc", data: "login." + instr[1] });
          break;
        case "link":
          rqst.post(instr[1]);
          break;
        case "pop":

          rqst.post(instr[1], null, (resp) => {
            let prnt = $("x-pop .content");
            prnt.html("");
            handleLayout(resp["layout"], prnt, resp, false);
            $("x-pop").css("display", "block");
          });
          break;
        case "post":
          let parsx = instr[1].split(",");
          let datax = [];
          for (const key in parsx) {
            let par = parsx[key].split(":");
            datax[par[0]] = par[1];
          }
          rqst.post(null, datax, (resp) => {
            // console.log(resp);
            rqst.handler(resp);
          });
          break;
        default:
          pagedata[instr[0]]();
          break;
      }
    },
    refresh: () => {
      rqst.post();
    },
    lmenu_auto_active: () => {
      $("[href='" + window.location.pathname + "']").addClass("active");
    },
    icon: (iconame, color, size, thickness) => {
      if (iconame == undefined) return "";
      let attr =
        size != undefined
          ? " width='" + size + "'" + " height='" + size + "'" + ""
          : "";
      attr += thickness != undefined ? ' stroke-width="' + thickness + '"' : "";
      attr += color != undefined ? ' color="' + color + '"' : "";
      // console.log(attr);
      // console.log(`<i ${attr} data-feather="${iconame.trim()}"></i>`);
      let icon = `<i ${attr} data-feather="${iconame.trim()}"></i>`;
      // console.log(icon);
      return icon;
    },
    getvalue: (k1, k2) => {
      return getvalue(k1.trim(), k2.trim());
    },
    buildtree: (treeid, data, id, hid, descp) => {
      App_buildtree(treeid, data, id, hid, descp);
    },
    if: (k, iftrue, iffalse) => {
      if (eval(k)) {
        return iftrue;
      } else {
        return iffalse;
      }
    },
    ifequals: (left, right, ontrue, onfalse) => {
      if (right == "undefined") right = undefined;
      if (left == right) {
        return ontrue;
      } else {
        return onfalse;
      }
    },
    popclose: () => {
      $("x-pop").css("display", "none");
      $("x-pop .content").html(" ");
    },
    thememode: (mode) => {
      let selc = mode == 0 ? "root_dark" : "root_light";
      $(":root").removeClass("root_dark");
      $(":root").removeClass("root_light");
      storeval("thememode", mode);
      $(":root").addClass(selc);
    },
    combobox: (data, formid, inpname, txt, id, defaultval = null, rowid, newopt) => {
      combobox(data, formid, inpname, txt, id, defaultval = null, rowid, newopt)
    },
    showcmenu: (cmenu, e) => {
      $(".cmenu").removeClass("active");
      if (cmenu.length == 1) {
        e.preventDefault();
        $(cmenu).addClass("active");
      }
      var offset = cmenu.offset();
      cmenu.offset({ left: e.pageX, top: e.pageY });
    },
    showwidgetcode: (widgetname) => {
      // // getwidget(typ[1])
      // let newlayout = "style:def\n";
      // newlayout += "clear:1\n";

      // newlayout += "view:tv\n";
      // newlayout += "args: txt=hello";

      let widi = [];
      widi["view:tv"] = { args: { txt: JSON.stringify(getwidget(widgetname)) } };
      console.log(widi);

      pop(widi);
    },
  };



//localdata



var cacheA = [];

function getvalue(key, key2) {
    // console.log(key);
    if (key2==undefined) {
        return localStorage.getItem(key);
    }
    else {
        if (cacheA[key]==undefined) {
            cacheA[key] = JSON.parse(getvalue(key));
        }
        return cacheA[key][key2];
    }
}


function storeval(key,val) {
    localStorage.setItem(key,val);
}



var pagedata = [];


function getViewStr(input, level) {

    // console.log(input, level);
    // console.log(langstr);
    if (langstr[input] != undefined) {
        if (langstr[input][level] != undefined) {
            return langstr[input][level];
        }
        else if(langstr[input][0]!= undefined) {
            return langstr[input][0];
        }
    }
    else {
        return input;
    }


}

var langstr = [];



if (getvalue("thememode")!=null) {
    ext.thememode(getvalue("thememode"));
}
else {
    ext.thememode(1);
}



//events
$("html").on("click", "a", function (e) {
    e.preventDefault();

    rqst.post($(this).attr("href"), (resp) => {
      // console.log(resp);
      rqst.handler(resp);
    });
  });


  $("html").on("keydown", function (e) {
    if (e.altKey) {
      if (pagedata["shortcut"] == undefined) return;
      if (pagedata["shortcut"][e.key.toUpperCase()]) {
        let execx = pagedata["shortcut"][e.key.toUpperCase()];
        ext.exec(execx);
      }
    }

  });

  // $("html").on("click", "button", function (e) {
  //   buttonhandler(this, e);
  // });

  // //depreciated
  // function buttonhandler(button, e) {
  //   if ($(button).hasClass("xbtn")) return;
  //   // if (button.hasAttribute("data-ex")) dataEx();
  //   // if (button.hasAttribute("actionx")) actionx();

  //   // function del_actionx() {
  //   //   let actionx = $(button).attr("actionx").split(".");
  //   //   switch (actionx[0]) {
  //   //     case "del_handleform":
  //   //       let grpname = actionx[1];
  //   //       let allpars = [];
  //   //       let inps = $("." + grpname);
  //   //       inps.each(function () {
  //   //         allpars[$(this).attr("name")] =$(this).hasClass("cmb")? getFinalComboVal($(this)): $(this).val();

  //   //       });

  //   //       if (allpars["app"] != undefined) {
  //   //         apps[allpars["app"]](allpars);
  //   //         return;
  //   //       }
  //   //       rqst.post(null, allpars);

  //   //       console.log(allpars);
  //   //       break;

  //   //     default:
  //   //       break;
  //   //   }
  //   // }

  //   // function del_dataEx() {
  //   //   let parsx = $(button).attr("data-ex").split(",");
  //   //   let datax = [];
  //   //   for (const key in parsx) {
  //   //     let par = parsx[key].split(":");
  //   //     datax[par[0]] = par[1];
  //   //   }
  //   //   rqst.post(null, datax, (resp) => {
  //   //     // console.log(resp);
  //   //     rqst.handler(resp);
  //   //   });
  //   // }
  // }

  // window.addEventListener(
  //   "popstate",
  //   function (event) {
  //     rqst.post(null);
  //   },
  //   false
  // );

  $("html").on("click", ".xbtn", function (e) {
    console.log("jhhhhhhhhh");
    if (this.hasAttribute("actionx")) {
      let parvar = $(this).attr("actionx").split(".");
      let dt = [];
      dt[parvar[0]] = parvar[1];
      dt["data"] = $(this).attr("dt");
      // console.log(dt);
      rqst.post(null, dt);
    }
    else if (this.hasAttribute("link")) {
      rqst.post($(this).attr("link"));
    }
    else if (this.hasAttribute("exec")) {
      ext.exec($(this).attr("exec"));
    }


  });

  $("html").on("click", function (e) {
    $(".cmenu").removeClass("active");
    // hidecombo(e);
    if ($("menu-l").css("position") == "fixed") {
      if ($("menu-l").css("display") == "block") {
        if ($("x-bdy")[0].contains(e.target)) {
          $("menu-l").css("display", "none");
        }
      }
    }
    if ($("x-fav").css("display") == "block") {
      if ($("#xcontent")[0].contains(e.target)) {
        $("x-fav").css("display", "none");
      }
    }

  });


  $("html").on("click", ".lmenubtn", function (e) {

    if ($("menu-l").css("display")=="none") {
      $("menu-l").css("display", "block");
    }
    else {
      $("menu-l").css("display", "none");
    }
  })

  $("html").on("click", ".favbtn", function (e) {

    if ($("x-fav").css("display")=="none") {
      $("x-fav").css("display", "block");
    }
    else {
      $("x-fav").css("display", "none");
    }
  })

  $("html").on("contextmenu", "x-bdy", function (e) {
    if (e.altKey) return;
    let cmenu = $($("x-bdy").find(".cmenu")[0]);
    ext.showcmenu(cmenu,e);
  })


  $("html").on("focus", ".cmb", function (e) {
    combobox_render($(e.target));
    e.target.select();
  })






rqst.post("/pages/home");
