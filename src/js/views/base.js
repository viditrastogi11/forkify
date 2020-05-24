export const elements={
    searchInput: document.querySelector('.search__field'),
    searchForm:document.querySelector('.search'),
    searchResList:document.querySelector('.results__list'),
    searchRes:document.querySelector('.results'),
    searchResPages:document.querySelector('.results__pages'),
    recipe:document.querySelector('.recipe'),
    shopping:document.querySelector('.shopping__list'),
    likeMenu:document.querySelector('.likes__field'),
    likeList:document.querySelector('.likes__list')
}

// export const renderLoader=parent=>{
//     const loader=`
//     <div class="loader">
//     <svg>
//     <use href="img/refresh.svg"></use>
//     </div>
//     `;
//     parent.insertAdjacentHTML('afterbegin',loader)

// }
export const elementString ={
    loader:'loader'
}

export const renderLoader = parent => {
    const loader = 
    `
    <div class="${elementString.loader}">
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
  }
  export const clearLoader=()=>{
      const loader =document.querySelector(`.${elementString.loader}`)
      if(loader) loader.parentElement.removeChild(loader)

  }