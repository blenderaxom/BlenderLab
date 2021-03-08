const createCoursePage = document.createElement('template');
createCoursePage.innerHTML =
    `
    <link rel="stylesheet" href="../css/styles.css">
    <div class="content-container">
        <div class="bg"><div class="loader"></div></div>
        <div class="createCard">
            <h2>Create A New Course</h2>
            <custom-input name="Course name" mode="single" maxlength="100"></custom-input>
            <button class="btn btn-outline btn-large">Create</button>
        </div>
    </div>
`

class CreateCoursePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(createCoursePage.content.cloneNode(true));
        // this.shadowRoot.querySelector('.editProfilePopup').style.display = 'none'
    }

    connectedCallback() {
        setTimeout(() => {
            render()
        }, 200)
        const render = () => {
            this.shadowRoot.querySelector('.bg').style.display = 'none'
        }
    }
}

window.customElements.define('create-course-page', CreateCoursePage);
