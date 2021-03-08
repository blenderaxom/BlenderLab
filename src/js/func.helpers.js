var tools = {
    header: Header,
    delimiter: Delimiter,
    Marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
    },
    warning: Warning,
    checklist: {
        class: Checklist,
        inlineToolbar: true,
    },
    image: {
        class: ImageTool,
        config: {
            uploader: {
                uploadByFile(file) {
                    return uploadImageFromFile(file)
                        .then(link => {
                            return {
                                success: 1,
                                file: { url: link }
                            }
                        })

                },
                uploadByUrl(url) {
                    return uploadImageFromUrl(url)
                        .then(link => {
                            return {
                                success: 1,
                                file: { url: link }
                            }
                        })
                }
            }
        }
    },
    inlineCode: InlineCode,
    underline: Underline,
    table: {
        class: Table,
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    embed: {
        class: Embed,
        config: {
            services: {
                sketchfab: {
                    regex: /https?:\/\/sketchfab.com\/3d-models\/.*-([\/\w\.-]*)*\/?/,
                    embedUrl: 'https://sketchfab.com/models/<%= remote_id %>/embed',
                    html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                    height: 300,
                    width: 600,
                }
            }
        }
    },
    code: CodeTool,
}

// Setup Editor.js editor           
function setUpEditor(id) {
    const editor = new EditorJS({
        holder: id,
        autofocus: true,
        placeholder: 'Start writing here!',
        onReady: () => {
            new Undo({ editor });
        },
        tools: tools
    });
    return editor
}

function setUpEditorWithBlock(id, block) {
    const editor = new EditorJS({
        holder: id,
        placeholder: 'Start writing here!',
        data: block,
        onReady: () => {
            new Undo({ editor });
        },
        tools: tools
    });
    return editor
}

function saveEditorData(editor) {
    editor.save().then((outputData) => {
        // console.log('Article data: ', outputData)
        return parseEditorBlocks(outputData);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}


function saveAndRender(editor, element) {
    editor.save().then((outputData) => {
        // console.log('Article data: ', outputData)
        const data = parseEditorBlocks(outputData);

        element.innerHTML = data
        var cbs = document.querySelectorAll(".code-block")
        cbs.forEach((l) => {
            hljs.highlightBlock(l);
        })

    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}


function parseEditorBlocks(output) {
    console.log(output);
    const customParsers = {
        delimiter: function (data, config) {
            return `<div class="ce-delimiter cdx-block"></div>`
        },
        image: function (data,config) {
            var classes = 'cdx-block image-tool image-tool--filled'
            if (data.withBorder) classes += ' image-tool--withBorder'
            if (data.withBackground) classes += ' image-tool--withBackground'
            if (data.stretched) classes += ' image-tool--stretched'

            return `<div class="${classes}">
                        <div class="image-tool__image">
                            <div class="image-tool__preloader"></div>
                            <img class="image-tool__image-picture" src="${data.file.url}">
                        </div>
                        <div class="image__caption">${data.caption}</div>
                    </div>`
        },
        warning: function(data,config) {
            return `<div class="block-warning">
                        <div class="block-warning__icon">
                        ☝️
                        </div>
                            <div class="block-warning__title">
                            ${data.title}
                        </div>
                        <div class="block-warning__message">${data.message}</div>
                    </div>`
        },
        checklist: (data, cofig) => {
            var el = ''
            data.items.forEach(l => {
                if (l.checked == true) {
                     el += `<div class="cdx-checklist__item cdx-checklist__item--checked">
                                <span class="cdx-checklist__item-checkbox">
                                    <i class="material-icons md-18">done</i>
                                </span>
                                <div class="cdx-checklist__item-text" contenteditable="false">
                                    ${l.text}
                                </div>
                            </div>` 
                } else {
                    el += `<div class="cdx-checklist__item">
                                <span class="cdx-checklist__item-checkbox"></span>
                                <div class="cdx-checklist__item-text" contenteditable="false">
                                    ${l.text}
                                </div>
                            </div>`   
                }
            }

            )
            return el
        }
    }
    const parser = new edjsParser(undefined, customParsers);
    return parser.parse(output);
}


function showLoader(element, id) {
    var div = document.createElement('div')
    div.classList.add('loader', 'mini')
    div.id = id
    element.append(div)
}
const removeLoader = (doc, id) => {
    var loader = doc.getElementById(id)
    if (loader != null)
        loader.remove();
}