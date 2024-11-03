import { SELECTOR } from "./selectors.js";

/**
 * Renders a batch of book previews into a provided fragment.
 * @param {Array<Object>} matches - Array of book objects to render.
 * @param {Object} authors - Dictionary mapping author IDs to author names.
 * @param {number} BOOKS_PER_PAGE - Number of books to render per page.
 * @param {DocumentFragment} startingFragment - The fragment to append the preview elements to.
 */
export const renderPreview = (matches, authors, BOOKS_PER_PAGE, startingFragment) => {
  for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
    const bookPreviewBtn = createBtnPreview(book, authors)
    startingFragment.appendChild(bookPreviewBtn)
  }
};

/**
 * Creates a preview button element for a book
 * @param {Object} param0 - Book details.
 * @param {string} param0.id - The ID of the book.
 * @param {string} param0.image - The image URL of the book cover.
 * @param {string} param0.title - The title of the book.
 * @param {string} param0.author - The author ID.
 * @param {Object} authors - A dictionary mapping author IDs to author names.
 * @returns {HTMLElement} The created book preview element.
  
 */
export function createBtnPreview({id, image, title, author }, authors){
  const element = document.createElement('book-preview')
  element.setAttribute('title', title)
  element.setAttribute('image', image)
  element.setAttribute('author', authors[author] )
  element.setAttribute('data-preview', id)
  return element
}

/**
 * Populates a document fragment with options for a select element
 * @param {string} defaultText - the default text shown when opening the search modal
 * @param {Object} options - object mapping IDs and names
 * @param {DocumentFragment} html - the fragment to appened option elements to
 */
export const populateGenreOptions = (options, html, defaultText)=>{
  //default option
  const defaultOption = document.createElement('option')
  defaultOption.value = 'any'
  defaultOption.innerText = defaultText
  html.appendChild(defaultOption)
  //populates with other options
  for (const [id, name] of Object.entries(options)) {
    const optionElement = document.createElement('option')
    optionElement.value = id
    optionElement.innerText = name
    html.appendChild(optionElement)
  }
}

export const toggleThemeNight = () => {
  document.documentElement.style.setProperty('--color-dark', '255, 255, 255')
  document.documentElement.style.setProperty('--color-light', '10, 10, 20')
}
export const toggleThemeDay = () => {
  document.documentElement.style.setProperty('--color-dark', '10, 10, 20')
  document.documentElement.style.setProperty('--color-light', '255, 255, 255')
}
/* eslint-disable max-len */
/**
     * Toggles the modal open/close state and optionally sets focus on the title bar
     * @param {string | HTMLElement} triggerBtn Selector string or button element to trigger the modal
     * @param {string | HTMLElement} overlay -Selector string or overlay element of the modal
     * @param {boolean} state -state to set for the modal's open property.
     * @param {string | HTMLElement | null} titleBar - Selector or element for the title bar to focus when the modal opens
     */
export const toggleModals = (triggerBtn, overlay, state, titleBar = null)=>{
  document.querySelector(triggerBtn).addEventListener('click', ()=>{
    document.querySelector(overlay).open = state
    if(state && titleBar){
      document.querySelector(titleBar).focus()
    }
  })
}

/**
 * filters books based on genre, title or author. 
 * 'any' means the filter has not been specified
 * @param {string} genre -Selected genre filter
 * @param {string} title -Title filter to match part or all of a book's title.
 * @param {string} author -Author filter
 * @param {Array<Object>} books -Array of book objects to filter. Each book should have `genres`, `title`, and `author` properties.
 * @returns {Array<Object>} - Array of books that match the specified filters.
 */
export   const checkingMatches = (genre, title, author, books) => {
        
  const genreMatches = (bookGenres, filterGenre) => {
    if (filterGenre === 'any') return true
    return bookGenres.includes(filterGenre)
  }
    
  const titleMatches = (bookTitle, filterTitle) => {
    return filterTitle.trim() === '' || bookTitle.toLowerCase().includes(filterTitle.toLowerCase())
  }
    
  const authorMatches = (bookAuthor, filterAuthor) => {
    return filterAuthor === 'any' || bookAuthor === filterAuthor
  }
    
  const result = books.filter(book => 
    genreMatches(book.genres, genre) &&
            titleMatches(book.title, title) &&
            authorMatches(book.author, author)
  )
  return result
}
    
/**
 * Toggles the visibility of the message based on the number of matches
 * @param {number} matchCount -the length of matching items
 */
export const toggleMessageDisplay = (matchCount) => {
  if (matchCount < 1) {
    document.querySelector(SELECTOR.listMessage).classList.add('list__message_show')
  } else {
    document.querySelector(SELECTOR.listMessage).classList.remove('list__message_show')
  }
} 

/**
 * Updates the state and content of the "Show More" button based on the current match count and page
 * @param {number} matchCount total number of matches found
 * @param {number} page 
 * @param {number} BOOKS_PER_PAGE 
 */
export const updateShowMoreBtn = (matchCount, page, BOOKS_PER_PAGE ) => {
  const showMoreButton = document.querySelector(SELECTOR.listBtn)
    
  if (!showMoreButton){
    throw new Error('button not found')
  }
  const remainingCount = Math.max(0, matchCount - (page * BOOKS_PER_PAGE))
     
  showMoreButton.disabled = remainingCount <= 0
  showMoreButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remainingCount})</span>
    `
}
 
/**
 * initialize the event listener for book previews
 * @param {string} bookListSelector - selector for the book list element
 * @param {Array} books -array of book objects
 * @param {Object} authors -object mapping author IDs to author names
 */
export const initializeBookPreviewListener = (bookListSelector, books, authors) => {
  document.querySelector(bookListSelector).addEventListener('click', (event) => {
    const clickedBook = getClickedBook(event, books)
    if (clickedBook) {
      displayBookDetails(clickedBook, authors)
    }
  });
};

/**
 * Gets the clicked book based on the event path.
 * @param {Event} event - The click event.
 * @param {Array} books - An array of book objects.
 * @returns {Object|null} - The clicked book object or null if not found.
 */
const getClickedBook = (event, books) => {
  const pathArray = Array.from(event.path || event.composedPath())
    
  for (const node of pathArray) {
    const bookId = node?.dataset?.preview
    if (bookId) {
      return books.find(book => book.id === bookId) || null // Use find to get the book
    }
  }
  return null // Return null if no book is found
};

/**
 * Displays book details in the UI.
 * @param {Object} book - book object to display
 * @param {Object} authors - object mapping author IDs to author names
 */
const displayBookDetails = (book, authors) => {
  const modal = document.querySelector(SELECTOR.listActive)
  const blurImage = document.querySelector(SELECTOR.listBlur)
  const mainImage = document.querySelector(SELECTOR.listImg)
  const titleElement = document.querySelector(SELECTOR.listTitle)
  const subtitleElement = document.querySelector(SELECTOR.listSubtitle)
  const descriptionElement = document.querySelector(SELECTOR.listDescription)

  modal.open = true // Open the modal
  blurImage.src = book.image
  mainImage.src = book.image
  titleElement.innerText = book.title
  subtitleElement.innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`
  descriptionElement.innerText = book.description
}

/**
  * 
  * @param {object} bookAppState -application state object, containing the current page and books matched by filters
  * @param {Object.<string, string>} authors - An object mapping author IDs to author names.
  * @param {Array.<{id: string, title: string, author: string, genres: Array.<string>, published: string, description: string}>} books - Array of book objects, each with specific properties.
  * @param {DocumentFragment} startingFragment - A DocumentFragment to hold initial book preview elements for efficient rendering.
  * @param {number} BOOKS_PER_PAGE - The number of books displayed on each page.
  * @param {Object.<string, string>} genres - An object mapping genre IDs to genre names.
  */
export const initializeApp = (bookAppState, authors, books, startingFragment,BOOKS_PER_PAGE, genres) =>{
  //abstracted rendering of books on page load into a function
  renderPreview(bookAppState.matches, authors, BOOKS_PER_PAGE, startingFragment)
  document.querySelector(SELECTOR.listItems).appendChild(startingFragment)
    
  //creates the options within the search modal
  const genreHtml = document.createDocumentFragment()
  populateGenreOptions(genres, genreHtml, 'All Genres')
  document.querySelector(SELECTOR.searchGenre).appendChild(genreHtml)

  const authorsHtml = document.createDocumentFragment()
  populateGenreOptions(authors, authorsHtml, 'All Authors')
  document.querySelector(SELECTOR.searchAuthor).appendChild(authorsHtml)

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode ? toggleThemeNight() : toggleThemeDay();

  document.querySelector(SELECTOR.listBtn).innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
  document.querySelector(SELECTOR.listBtn).disabled = (bookAppState.matches.length - (bookAppState.page * BOOKS_PER_PAGE)) < 0

  //toggling search, settings and list modals
  toggleModals(SELECTOR.searchCancel,SELECTOR.searchOverlay, false)
  toggleModals(SELECTOR.settingsCancel, SELECTOR.settingsOverlay, false)
  toggleModals(SELECTOR.listClose, SELECTOR.listActive, false)
  toggleModals(SELECTOR.headerSettings, SELECTOR.settingsOverlay, true )
  toggleModals(SELECTOR.headerSearch, SELECTOR.searchOverlay, true, SELECTOR.searchTitle)

}
// eslint-enable max-len

