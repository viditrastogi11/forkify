// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView'
import * as listView from './views/listView'
import * as likeView from './views/likeView'
import * as recipeView from './views/recipeView'
import {elements,renderLoader,clearLoader} from './views/base'
import Likes from './models/Likes'
/**global state of the app
 * search object
 * curent recipe object
 * shopping list object
 * liked recipe
 */


const state ={};

const controlSearch=async ()=>{
    // get query from view
    const query=searchView.getInput()
     if(query){
        //new search object and add to state
        state.search=new Search(query);

        // prepare ui for results

       searchView.clearInput();
       searchView.clearResults();
       renderLoader(elements.searchRes)
               //search for recipes
      try{ 
          await state.search.getResult();
            //render resuts on ui
            clearLoader();
            searchView.renderResults(state.search.result);
      }
      catch{
          alert('something went wrong')
          clearLoader();
      }
    }
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
})

 elements.searchResPages.addEventListener('click',e=>{
     const button=e.target.closest('.btn-inline')
     if(button){
         const goToPage=parseInt(button.dataset.goto,10);
         searchView.clearResults();
         searchView.renderResults(state.search.result,goToPage);
     }
 })





 ///recipe
 const controlRecipe=async ()=>
 {
     //get id from url
    const id =window.location.hash.replace('#','');
  
 
    if(id){
    // prepare UI for change
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    //highlight selected search item
    if(state.search){
        searchView.highlightSelected(id)
    }

    //create new recipe object
    state.recipe=new Recipe(id);
  
    //Get recipe data and parse ingredient
    try{
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        // cal serving and time
        state.recipe.calcTime()
        state.recipe.calcServing()
        // render recipe
        clearLoader()
        recipeView.renderRecipe(state.recipe,state.likes.isLiked(id))
    }
    catch(e){
        console.log(e);
        
        alert('Error processing recipe')
        clearLoader()
    }
   
    }
   

};


['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe))



///list controler
const controlList=()=>{
    if(!state.list) state.list=new List();

state.recipe.ingredients.forEach(el=>{
   const item= state.list.addItem(el.count,el.unit,el.ingredient)
    listView.renderItem(item);

})
}



elements.shopping.addEventListener('click',e=>{
const id=e.target.closest('.shopping__item').dataset.itemid;

//delete 
if(e.target.matches('.shopping__delete,.shopping__delete *')){
    
    state.list.deleteItem(id)

    listView.deleteItem(id);
}else if(e.target.matches('.shopping__count-value')){
    const val= parseFloat(e.target.value)
    state.list.updateCount(id,val)
}
})
///Likes

const controlLike=()=>{
    if(!state.likes) state.likes=new Likes()
    const currentID=state.recipe.id
  

    if(!state.likes.isLiked(currentID)){
        // add like to the state
        const newLike=state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        likeView.toggleLikeBtn(true)
        likeView.renderLike(newLike)
    }else{
        state.likes.deleteLike(currentID)
        likeView.toggleLikeBtn(false)
        likeView.deleteLike(currentID)
        //
    }
    
    likeView.toggleLikeMenu(state.likes.getNumLikes())
}

//restore

window.addEventListener('load',()=>{
  
state.likes=new Likes()
state.likes.readStorage()
likeView.toggleLikeMenu(state.likes.getNumLikes())
state.likes.likes.forEach(like=>likeView.renderLike(like))
})




///handling recipe btn clik
elements.recipe.addEventListener('click',e=>{
   
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
       if(state.recipe.servings>1){
        state.recipe.updateServing('dec') 
        recipeView.updateServingIngredient(state.recipe)
       }
       
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServing('inc')
        recipeView.updateServingIngredient(state.recipe)
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
})


