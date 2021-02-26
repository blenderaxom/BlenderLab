const cancelBtn = document.querySelector(".cancelBtn")
const openFolderBtn = document.querySelector(".open-folder-btn")
const createBtn = document.querySelector("#createBtn");
const defTemplateContainer = document.querySelector(".default-templates-container")

const Modes = {
    GENERAL: 'General',
    SCULPT: 'Sculpting',
    ANIM_2D: '2D-Animation',
    VFX: 'VFX',
    VIDEO_EDITING: 'Video-Editing',
};

let mode = Modes.GENERAL;
let type = "DEFAULT";

var editor = setUpEditor("editor-description")

Object.keys(Modes).map((val, l) => {
    // Object.values(Modes)[l]  returns the value of the object
    // Object.keys(Modes)[l] returns the key of the objects
    defTemplateContainer.insertAdjacentHTML("beforeend", `<template-card name=${Object.values(Modes)[l]} mode=${Object.keys(Modes)[l]} type=${type}></template-card>`);
});
const templatecards = document.querySelectorAll("template-card")

cancelBtn.addEventListener("click", (event) => {
    BL.closeWindow()
})

openFolderBtn.addEventListener("click", async (event) => {
    const result = await BL.openFolder()
    if (result != undefined) {
        document.querySelector(".location-field").value = result
    }
})


createBtn.addEventListener('click', (event) => {
    editor.save().then((outputData) => {
        const pjtName = document.querySelector("#projectName")
        // description = document.querySelector("#description")
        const blendName = document.querySelector("#blendName")
        const locationField = document.querySelector("#location")
        const selector = document.querySelector("#blender-selector-new-project")
            .shadowRoot.querySelector("select")

        if (pjtName.value == "") {
            pjtName.focus();
            return false
        }
        else if (blendName.value == "") {
            blendName.focus();
            return false
        } else if (locationField.value == "") {
            locationField.focus();
            return false
        }
        BL.createProject(
            [pjtName.value, JSON.stringify(outputData, null, 2), blendName.value, locationField.value, mode, type, selector.value]
        );
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
})



/* Modal function for popup editor */

// Get the modal
var modal = document.getElementById("modal-editor");

// Get the button that opens the modal
var btn = document.getElementsByClassName("editor-area")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closeModal")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  var des = document.querySelector('.editor-area')
  saveAndRender(editor,des)
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    
  }
}
