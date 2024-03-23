
const body = document.querySelector('body')

window.addEventListener('scroll', () => {
    let num = window.scrollY
    body.style.marginTop = `${num * 2.5}px`
})