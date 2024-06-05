const widx = {
    lmenu:(_, data)=>{
        _.parent = "menu-l";
        _.static = "lmenuacc";
        _.class = "grp";

        let links = [
        ["About Me", "/pages/home"],
        ["Message Me", "/pages/msg"],
        ["Code usage", "/pages/code"],
        ];

        for (const key in links) {
            _.widget = { type: "link1", txt: links[key][0], url: links[key][1] };
        }

        ext.autopad();
        ext.lmenu_auto_active();
    },
    link1:(_, data)=>{

        _.style = "display:block; width:100%";
        _.class = "link1";

        _.view={ type:"a", txt: data.txt, href:data.url }
    },
    cardm:(_, data)=>{

        _.style = "display:block; width:100%";
        _.view={ type:"tv", txt: data.title, class:"h2 my-10 redf block"};
        _.view={ type:"tv", txt: data.txt };
    },
    row3:(_, data)=>{
        _.style = "background:#aa888811; border-radius:10px";
        _.class = "p-2 m-2";

        let coid = ext.randid(5);
        _.view = { type: "container", id: coid, class: "lh" };
        _.view = { type: "tv", txt: data.icon, parent: "#" + coid, style: "width:" + data.iconwidth };
        _.view = { type: "tv", txt: data.title, class: "block", parent: "#" + coid };
        _.view = { type: "tv", txt: data.sub, class: "block ml-auto", style: "opacity:0.7", parent: "#" + coid };
    },
    cmenu:(_, data)=>{
        _.class = "cmenu";
        let a23 = ext.randid(5);
        _.view = { type: "container", id:  a23, class: "cmenux" };

        let menus = data.menus;

        for (const key in menus) {
            makeMenuItem(menus[key],"#"+a23);
        }

        if (data.basicmenu != false) basicmenu();

        function basicmenu() {
          let basic = [
            {
              icon: "refresh-cw",
              txt: "Refresh",
              shortcut: "R",
              exec: "run.refresh()",
            },
            { icon: "code", txt: "Show API" },
            { icon: "log-out", icolor: "orange", txt: "Quick Logout" },
          ];
          let a44 = ext.randid(5);
          _.view = { type: "container", id: a44, class: "cmenux" };

          for (const key in basic) {
            makeMenuItem(basic[key], "#" + a44);
          }
        }

        function makeMenuItem(menu, parent) {
            _.widget = {
                type: "row3",
                icon: ext.icon(menu.icon, menu.icolor, "1rem", 2),
                iconwidth: "25px",
                title: menu.txt,
                sub: menu.shortcut? "ALT + " + menu.shortcut.toUpperCase():"",
                class: "px-6 xbtn",
                attr: { exec: menu.exec },
                parent:parent
            }
            if (menu.shortcut) { ext.shortcut(menu.shortcut.toUpperCase(),menu.exec) };
        }
    },
    form1input:(_, data)=>{

        _.view = { type: "tv", txt: data.txt, class: data.attrx, style: `width:${data.col1width}` };

        _.view = {
        type: "input",
        class: data.class,
        id: data.fid,
        value: data.value,
        placeholder: data.placeholder,
        name: data.name,
        attrx: data.attrx,
        attr: { notnull: data.notnull, autocomplete: "off", datatype: data.datatype },

        };

    },
    form1:(_, data)=>{

        let cid = ext.randid(30);

        _.view = { type: "container", id: cid };

        let inps = data.xdt;
        for (const key in inps) {
        _.widget = {
            type: "form1input",
            txt: inps[key].txt,
            value:inps[key].val,
            fid: data.id + inps[key].name,
            name: inps[key].name,
            placeholder: inps[key].txt,
            col1width: "120px",
            class: data.fid,
            attrx:  inps[key].attrx,
            attr: { notnull: inps[key].notnull, type: inps[key].type},
        };
        }

        _.view = {
        type: "btn",
        txt: data.txtbtn,
        class: `${cid} xbtn`,
        style: "margin-left:120px",
        attr: { exec: `handleform.${data.fid}.`+data.callback },
        };

    },
    topbar_a: (_, data) => {
        _.parent = "menu-t";
        $("menu-t").html("");

        let lh = "40px";

        _.style = "height: 40px; overflow: hidden";
        _.class = "topbar px-6";
        _.view = { type: "container", id: "cntx", class: "lh" };
        _.parent = "#cntx";

        let logoc = ext.randid(20);

        _.view = {
            type: "btn",
            txt: ext.icon("menu"),
            class: "navbtn osmall lmenubtn",
        };
        _.view = {
            type: "container",
            id: logoc,
            style:
                "font-size:1.3rem; display:block; margin-top: auto; font-weight:bold; margin-bottom: auto; margin-left: 10px; padding: 5px 0 5px 10px; border-radius:10px; width:var(--lmenu_width)",
            class: "xbtn accent",
            attr: { link: "/" },
        };

        _.view = {
            type: "tv",
            txt: "pb&nbsp",
            parent: "#" + logoc,
            style: "opacity:0.3",
        };

        _.view = {
            type: "tv",
            txt: data.title,
            class: "px-4 xsmall",
            style: "font-size: 1.5rem; line-height:"+lh,
          };

        _.view = {
            type: "btn",
            txt: ext.icon("bookmark"),
            class: "ml-auto navbtn favbtn",
        }

        _.view = {
            type: "btn",
            txt: ext.icon("log-out", "red"),
            class: "navbtn xbtn",
            attr: { exec: "link./logout" }
        }

    }

}
