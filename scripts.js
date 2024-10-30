import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { renderPreview , populateGenreOptions, toggleModals, toggleThemeDay, toggleThemeNight, createPreviewButton, checkingMatches, toggleMessageDisplay, updateShowMoreBtn, initializeBookPreviewListener} from './helpers.js';

let page = 1;
let matches = books

const startingFragment = document.createDocumentFragment()

//abstracted rendering of books on page load into a function
renderPreview(matches, authors, BOOKS_PER_PAGE, startingFragment)
document.querySelector('[data-list-items]').appendChild(startingFragment)

//creates the options within the search modal
const genreHtml = document.createDocumentFragment()
populateGenreOptions(genres, genreHtml, 'All Genres')
document.querySelector('[data-search-genres]').appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
populateGenreOptions(authors, authorsHtml, 'All Authors')
document.querySelector('[data-search-authors]').appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleThemeNight()
} else {
   toggleThemeDay()
}

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
//toggling search, settings and list modals
toggleModals('[data-search-cancel]','[data-search-overlay]', false)
toggleModals('[data-settings-cancel]', '[data-settings-overlay]', false)
toggleModals('[data-list-close]', '[data-list-active]', false)
toggleModals('[data-header-settings]', '[data-settings-overlay]', true )
toggleModals('[data-header-search]','[data-search-overlay]', true, '[data-search-title]')


//setting theme based on user input
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
     toggleThemeNight()
    } else {
     toggleThemeDay() 
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})
//filtering books based on search and rendering them
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { genre, title, author } = Object.fromEntries(formData);

    page = 1;

    //resulting array from search
    matches = checkingMatches(genre, title, author, books)

    toggleMessageDisplay(matches.length)

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    const itemsToShow = matches.slice(0, BOOKS_PER_PAGE)
    for (const book of itemsToShow) {
        const element = createPreviewButton(book, authors)
        newItems.appendChild(element)
    }
updateShowMoreBtn(matches.length, page, BOOKS_PER_PAGE)

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    
    const fragment = document.createDocumentFragment()
 const newItemsToShow = matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)
    for (const book of newItemsToShow){
    const element = createPreviewButton(book, authors);
    fragment.appendChild(element)
}
    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

initializeBookPreviewListener('[data-list-items]', books, authors)