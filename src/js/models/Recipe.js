import axios from 'axios'
let i=0;
export default class Recipe{
    constructor(id){
        this.id=id
    }

    async getRecipe(){
        try{
            const res =await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher_url;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;
            this.servings=res.data.recipe.servings;
        }
        catch{
            console.log(error);
            alert('eeeeeeeeeeeeee');
        }
    }
    calcTime(){
        const numIng=this.ingredients.length;
        const periods=Math.ceil(numIng/3);
        this.time= periods*15
    }
    calcServing(){
        this.servings=4;
    }
   
    parseIngredients(){
        const unitsLong=['tablespoon','tablespoons', 'ounce','ounces','teaspoon','teaspoons','cups','pounds','ozs','tbsps']
        const unitsShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound','oz','tbsp','g','kg']
        const newIngredients=this.ingredients.map(el=>{
            // uniform unit
            let ingredient=el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitsShort[i])
            })
            //remove paranthensis
          ingredient= ingredient.replace(/ \([\s\S]*?\)/g, '')
          
          if(ingredient[0]=='('){
             
            ingredient= ingredient.replace(/[{()}]/g, '')
           
          }
         
            //parse ingred into count ,unit and ingred
            const arrIng=ingredient.split(' ')
            const unitIndex=arrIng.findIndex(el2=>unitsShort.includes(el2))
            let objIng;
            
            if(unitIndex>-1){
                const arrCount=arrIng.slice(0,unitIndex)
                
                let count;  
                if (arrCount.length===1){
                    count=eval(arrIng[0].replace('-','+'))
                }
                
                else{
                 if(!arrIng[0]===NaN){
                        count=eval(arrIng.slice(0,unitIndex).join('+'))
                    }
                    else{
                         for(i=0;i<arrIng.length;i++)
                         {
                             if(parseInt(arrIng[i])){
                                 console.log(arrIng[i])
                                 count=arrIng[i];
                                 arrIng[i]=''
                                 break;
                             }
                         }
                        
                         objIng={
                             count,
                             unit:'',
                             ingredient:arrIng.join(' ')
                         }
                       return objIng;

                    }
                }
                
                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
            }
            else if(parseInt(arrIng[0],10)){
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' '),
                }
                


            }else if(unitIndex===-1){
                objIng={
                    count:1,
                    unit:'',
                    ingredient,
                }
               

            }
        
           
            return objIng;
        })
        this.ingredients=newIngredients
    }

    updateServing(type){
        
         const newServings= type==='dec'?this.servings-1:this.servings+1;
         this.ingredients.forEach(ing=>{
                 ing.count=ing.count*(newServings/this.servings)
            })

         this.servings=newServings;

     }







}