/**
 * Renders a preview of books in a given document fragment
 * @param {Array} matches - the array of book matches to render
 * @param {object} authors - an object containing author names and IDs
 * @param {number} BOOKS_PER_PAGE - maximum number of books to display
 * @param {DocumentFragment} startingFragment -document fragment to append the book previews to
 */

export const renderPreview = (matches, authors, BOOKS_PER_PAGE, startingFragment)=> {
    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
        const bookPreviewBtn = document.createElement('button')
        bookPreviewBtn.classList = 'preview'
        bookPreviewBtn.setAttribute('data-preview', id)
    
        bookPreviewBtn.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
    
        startingFragment.appendChild(bookPreviewBtn)
    }
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