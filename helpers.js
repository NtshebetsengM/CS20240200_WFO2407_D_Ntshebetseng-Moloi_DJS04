/**
 * Renders a batch of book previews into a provided fragment.
 * @param {Array<Object>} matches - Array of book objects to render.
 * @param {Object} authors - Dictionary mapping author IDs to author names.
 * @param {number} BOOKS_PER_PAGE - Number of books to render per page.
 * @param {DocumentFragment} startingFragment - The fragment to append the preview elements to.
 */
export const renderPreview = (matches, authors, BOOKS_PER_PAGE, startingFragment) => {
    for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
        const bookPreviewBtn = createPreviewButton(book, authors);
        startingFragment.appendChild(bookPreviewBtn);
    }
};
/**
 * Creates a preview button element for a book.
 * @param {Object} param0 - Object containing book information.
 * @param {string} param0.id - Unique identifier for the book.
 * @param {string} param0.image - URL for the book's cover image.
 * @param {string} param0.title - Title of the book.
 * @param {string} param0.author - Author ID of the book.
 * @param {Object} authors - Dictionary mapping author IDs to author names.
 * @returns {HTMLElement} - The constructed button element representing a book preview.
 */
export function createPreviewButton({ id, image, title, author }, authors) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

    return element;
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



export    const toggleThemeNight = () => {
        document.querySelector('[data-settings-theme]').value = 'night'
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    
    }
export    const toggleThemeDay = () => {
        document.querySelector('[data-settings-theme]').value = 'day'
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    
    }

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
            if (filterGenre === 'any') return true;
            return bookGenres.includes(filterGenre);
        };
    
        const titleMatches = (bookTitle, filterTitle) => {
            return filterTitle.trim() === '' || bookTitle.toLowerCase().includes(filterTitle.toLowerCase());
        };
    
        const authorMatches = (bookAuthor, filterAuthor) => {
            return filterAuthor === 'any' || bookAuthor === filterAuthor;
        };
    
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
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }
} 

/**
 * Updates the state and content of the "Show More" button based on the current match count and page
 * @param {number} matchCount -total number of matches found
 * @param {number} page -current page number (zero-based index)
 * @param {number} BOOKS_PER_PAGE -number of books displayed per page
 */
export const updateShowMoreBtn = (matchCount, page, BOOKS_PER_PAGE ) => {
    const showMoreButton = document.querySelector('[data-list-button]');
    
    showMoreButton.disabled = (matchCount - (page * BOOKS_PER_PAGE)) < 1;

    const remainingCount = Math.max(0, matchCount - (page * BOOKS_PER_PAGE));
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
        const clickedBook = getClickedBook(event, books);
        if (clickedBook) {
            displayBookDetails(clickedBook, authors);
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
    const modal = document.querySelector('[data-list-active]')
    const blurImage = document.querySelector('[data-list-blur]')
    const mainImage = document.querySelector('[data-list-image]')
    const titleElement = document.querySelector('[data-list-title]')
    const subtitleElement = document.querySelector('[data-list-subtitle]')
    const descriptionElement = document.querySelector('[data-list-description]')

    modal.open = true // Open the modal
    blurImage.src = book.image
    mainImage.src = book.image
    titleElement.innerText = book.title
    subtitleElement.innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`
    descriptionElement.innerText = book.description
}