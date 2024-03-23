const img1 = document.getElementById('img1')
const img2 = document.getElementById('img2')
const img3 = document.getElementById('img3')
const img4 = document.getElementById('img4')
const img5 = document.getElementById('img5')
const img6 = document.getElementById('img6')
const main = document.getElementById('mainimg')

img1.addEventListener('click', () => {
    main.src = img1.src
})

img2.addEventListener('click', () => {
    main.src = img2.src
})

img3.addEventListener('click', () => {
    main.src = img3.src
})

img4.addEventListener('click', () => {
    main.src = img4.src
})

img5.addEventListener('click', () => {
    main.src = img5.src
})

img6.addEventListener('click', () => {
    main.src = img6.src
})
