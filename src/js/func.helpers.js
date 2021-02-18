
// Setup Editor.js editor           
function setUpEditor(id) {
    const editor = new EditorJS({
        holder: id,
        autofocus: true,
        placeholder: 'Start writing here!',
        onReady: () => {
            new Undo({ editor });
            new DragDrop(editor);
        },
        tools: {
            header: Header,
            Marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
            },
            inlineCode: InlineCode,
            underline: Underline,
            raw: RawTool,
            table: {
                class: Table,
            },
            list: {
                class: List,
                inlineToolbar: true,
            },
            paragraph: {
                class: Paragraph,
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
    const parser = new edjsParser();
    return parser.parse(output);
}