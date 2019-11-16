Application.load()

document
    .querySelector('[data-action-addColumn]')
    .addEventListener('click', function(event) {
        document.querySelector('.columns').append(new Column().element)
        Application.save()
    })