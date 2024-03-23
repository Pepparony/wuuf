const dropdown = document.getElementById('dropdown')
const dropdownmenu = document.getElementById('dropdown-menu')
const body = document.querySelector('body')

dropdown.addEventListener('click', () => {
    dropdownmenu.classList.toggle('hiddenn')
})

window.addEventListener('scroll', () => {
    let num = window.scrollY
    body.style.marginTop = `${num * 2.5}px`
})