const createCourseBtn = document.getElementById('createCourseBtn')

createCourseBtn.addEventListener('click',async e=>{
    var page = document.createElement('create-course-page')

    addTab('Create new course', page)
})