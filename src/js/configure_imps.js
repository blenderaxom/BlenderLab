document.body.addEventListener('notify', (e) => {
    if (e.detail.type == "info")
        toastr.info(e.detail.message)
    if (e.detail.type == "success")
        toastr.success(e.detail.message)
    if (e.detail.type == "error")
        toastr.error(e.detail.message)
})

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

const makeCustomMenuItem = (menu, icon, menuName, callback) => new Promise((resolve, reject) => {
    try {
        var btn = document.createElement('a')
        btn.innerHTML = `<i class="material-icons md-18">${icon}</i> ${menuName}`
        menu.append(btn)
        btn.addEventListener('click', e => {
            e.stopPropagation()
            menu.style.display = 'none'
            menu.click()
            callback()
        })
        return resolve(btn)
    } catch {
        return reject('error creating element.')
    }

})


async function setUpCropper(element) {
    var croppr = new Croppr(element, {
        aspectRatio: 1,
        startSize: [80, 80, '%'],
    });

    return croppr
}

