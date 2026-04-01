function addStyles(win, styles) {
    styles.forEach((style) => {
        let link = win.document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", style);
        win.document.getElementsByTagName("head")[0].appendChild(link);
    });
}
  
export const HtmlToPaper = ( el , localOptions , callback ) => {
    let options = {
        defaultName : "_blank",
        defaultSpecs : ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
        defaultReplace : true,
        defaultStyles : [

        ]
    };

    const element = window.document.getElementById(el);

    if (!element) {
        alert(`Element to print #${el} not found!`);
        return;
    }

    const url = "";
    const win = window.open(url, options.name, options.specs, replace);

    win.document.write(`
        <html>
        <head>
            <title>${window.document.title}</title>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `);

    addStyles(win, styles);

    setTimeout(() => {
        win.document.close();
        win.focus();
        win.print();
        win.close();
        cb();
    }, 1000);

    return true;
};