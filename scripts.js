import { authors, books, BOOKS_PER_PAGE, genres } from './utilities/data.js';
import {
  checkingMatches,
  createBtnPreview,
  initializeApp,
  initializeBookPreviewListener,
  toggleMessageDisplay,
  toggleThemeDay,
  toggleThemeNight,
  updateShowMoreBtn
} from './utilities/helpers.js';
import { SELECTOR } from './utilities/selectors.js';

const bookAppState = {
  page: 1,
  matches: books
}

const startingFragment = document.createDocumentFragment()

//setting the theme based on user input
document.querySelector(SELECTOR.settingsForm).addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const { theme } = Object.fromEntries(formData)
     
  theme === 'night' ? toggleThemeNight() : toggleThemeDay()

  document.querySelector(SELECTOR.settingsOverlay).open = false
})

//filtering books based on search and rendering them
document.querySelector(SELECTOR.searchForm).addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const { genre, title, author } = Object.fromEntries(formData)

  bookAppState.page = 1

  bookAppState.matches = checkingMatches(genre, title, author, books)

  toggleMessageDisplay(bookAppState.matches.length)

  document.querySelector(SELECTOR.listItems).innerHTML = ''
  const newItems = document.createDocumentFragment()

  const itemsToShow = bookAppState.matches.slice(0, BOOKS_PER_PAGE)
  itemsToShow.forEach((book)=> {
    const element = createBtnPreview(book, authors)
    newItems.appendChild(element)
  })

  document.querySelector(SELECTOR.listItems).appendChild(newItems)
    
  updateShowMoreBtn(bookAppState.matches.length, bookAppState.page, BOOKS_PER_PAGE)

  window.scrollTo({top: 0, behavior: 'smooth'})
  document.querySelector(SELECTOR.searchOverlay).open = false
})

//show more button functionality
document.querySelector(SELECTOR.listBtn).addEventListener('click', () => {
  const startIndex = bookAppState.page * BOOKS_PER_PAGE;
  const newItemsToShow = bookAppState.matches.slice(startIndex, startIndex + BOOKS_PER_PAGE)

  // Render new items
  const fragment = document.createDocumentFragment();
  newItemsToShow.forEach((book) => {
    const element = createBtnPreview(book, authors)
    fragment.appendChild(element)
  })

  document.querySelector(SELECTOR.listItems).appendChild(fragment)
    
  // Increment the page count
  bookAppState.page += 1

  // Update the button status after displaying more books
  updateShowMoreBtn(bookAppState.matches.length, bookAppState.page, BOOKS_PER_PAGE)
})
document.addEventListener("DOMContentLoaded", () => {
  initializeBookPreviewListener(SELECTOR.listItems, books, authors)
  updateShowMoreBtn(bookAppState.matches.length, bookAppState.page, BOOKS_PER_PAGE)
  initializeApp(bookAppState, authors, books, startingFragment, BOOKS_PER_PAGE, genres)
} )
