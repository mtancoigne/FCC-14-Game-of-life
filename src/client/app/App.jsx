console.clear();

import React from 'react';
import {render} from 'react-dom';

import PageTitle from "./PageTitle.jsx";
import RecipesList from "./RecipesList.jsx";
import RecipesEmpty from './RecipesEmpty.jsx';
import ActionsButton from "./ActionsButton.jsx";
import ModalForm from "./ModalForm.jsx";
import ModalExport from "./ModalExport.jsx"

/* ------------------------------

Main React component

App
  - RecipesList
    - Recipe
      - IngredientsList
        - Ingredient
      - IngredientsEmpty if no ingredients
  - RecipesEmpty if no recipes
  - FormModal
  - ExportModal
  - ActionsButtons
------------------------------ */
class App extends React.Component {

  constructor(props){
    super(props);
    // Define some properties
    this.state={
      // LocalStorage name
      store:'mtancoigne_recipes',
      // Recipe list
      recipes:[],
      // Last id
      lastId:0,
      // Initial recipes
      firstRecipes:[
        {id:1, name: 'Spring rolls', ingredients: 'Rice, Raw salmon, Rice sheet', image: 'http://lorempixel.com/image_output/food-q-c-400-400-8.jpg'},
        {id:2, name: 'Small breads', ingredients: '', image: 'http://lorempixel.com/image_output/food-q-c-400-400-7.jpg'},
        {id:3, name: 'Delicious things', ingredients: '', image: 'http://lorempixel.com/image_output/food-q-c-400-400-3.jpg'},
        {id:4, name: 'Raw Vegetables', ingredients: 'Tomatoes, Carrots, Pepperoni, Cucumber, Mushrooms', image: 'http://lorempixel.com/image_output/food-q-c-400-400-5.jpg'},
        {id:5, name: 'Cooked meat', ingredients: 'Meat, Sauce, Herbs, Cucumber, Mushrooms', image: 'http://lorempixel.com/image_output/food-q-c-400-400-1.jpg'},
        {id:6, name: 'Hamburger', ingredients: 'Tomatoes, Lettuce, Onions, Hamburger buns', image: 'http://lorempixel.com/image_output/food-q-c-400-400-9.jpg'}
      ],
      // Modal states
      emptyRecipe:{id:null, name:'', ingredients:'', image:''},
      modalFormData:{id:null, name:'', ingredients:'', image:''},
      modalExportData:{},
    };

    // Loads the data
    if(checkStorage()){
      var store=this.state.store;
      var localData = localStorage.getItem(store);
      if (checkJSON(localData) === false || localData === null) {
        // Storage is empty or invalid, load samples.
        localStorage.setItem(store, JSON.stringify(this.state.firstRecipes));
        toast('info', 'Welcome. Sample data has been loaded. Have fun.', 3000);
        localData = localStorage.getItem(store);
      } else {
        // Let say we don't care if the content is well-formed objects...
        toast('success', 'Welcome back ! Your recipes have been loaded. Have fun.', 3000);
      }
      // Parse JSON from storage
      this.state.recipes = JSON.parse(localData);
      this.state.lastId=this.state.recipes[this.state.recipes.length-1].id;

    } else {
      // localStorage is disabled
      this.state.recipes=this.state.firstRecipes;
      toast('warning', 'localStorage is not supported by your browser.', 5000);
    }

    if(this.state.recipes.length<0){
      this.state.lastId=this.state.recipes[this.state.recipes.length-1].id;
    }
  }

  render() {
    return (
      <div className="container">
        <PageTitle />
        <div className="row">
          {this.state.recipes.length ? <RecipesList
            recipes={this.state.recipes}
            _deleteRecipe={this._deleteRecipe.bind(this)}
            _recipeForm={this._recipeForm.bind(this)}
            /> : <RecipesEmpty />}
        </div>
        <ActionsButton
          _recipeForm={this._recipeForm.bind(this)}
          _exportData={this._exportData.bind(this)}
          _importData={this._importData.bind(this)}
        />
      <ModalForm recipe={this.state.modalFormData} _saveRecipe={this._saveRecipe.bind(this)}/>
      <ModalExport data={this.state.modalExportData} _batchImport={this._batchImport.bind(this)}/>
      </div>
    );
  }

  _recipeForm(id){
    var recipe=this.state.emptyRecipe;
    if(id!=null){
      recipe=this._getRecipe(id);
      if(!recipe){
        toast('error','The recipe don\'t exists.', 3000);
        return false;
      }
    }
    this.setState({modalFormData:recipe});
    $('#formModal').openModal({dismissible:false});
    return true;
  }

  _exportData(){
    this.setState({
      modalExportData:{mode:'export', data:JSON.stringify(this.state.recipes)}
    })
    $('#exportModal').openModal({dismissible:false});
  }

  _importData(){
    this.setState({modalExportData:{mode:'import', data:''}});
    $('#exportModal').openModal({dismissible:false});
  }

  _batchImport(data){
    this.setState({recipes:data});
    this._save(data);
    toast('success', 'The data has been imported successfully', 3000);
  }

  _saveRecipe(recipe){
    var recipes=this.state.recipes;
    // Update
    if(recipe.id){
      var index=this._getRecipeIndex(recipe.id);
      if(index){
        recipes[index]=recipe;
        this._save(recipes);
        //this.setState({recipes:recipes});
        toast('success','The recipe has been updated.', 3000);
        return true
      }else{
        toast('error','The recipe don\'t exists.', 3000);
        return false;
      }
    }else{ // New recipe
      recipe.id=this.state.lastId+1;
      this._save(this.state.recipes.concat([recipe]));
      this.setState({lastId: recipe.id, recipes:this.state.recipes.concat([recipe])});
      toast('success','The recipe has been saved.', 3000);
      return true;
    }
  }

  _save(recipes){
    if(checkStorage){
      localStorage.setItem(this.state.store, JSON.stringify(recipes));
    }else{
      toast('warning', 'We can\'t save the data on your computer. You may lose changes', 3000);
    }
    this.setState({recipes:recipes});
  }

  _deleteRecipe(id){
    // Find the recipe
    var recipes=this.state.recipes;
    var index=this._getRecipeIndex(id);
    if(index){
      recipes.splice(index, 1)
      this.setState({recipes:recipes});
      this._save(recipes);
      toast('success','The recipe has been deleted',3000);
      return true
    }
    toast('error','The recipe don\'t exists.', 3000);
    return false;
  }

  _getRecipe(id){
    // Find the recipe
    for(var i=0; i<this.state.recipes.length; i++){
      if(this.state.recipes[i].id===id){
        return this.state.recipes[i];
      }
    }
    // Not found
    return false;
  }

  _getRecipeIndex(id){
    // Find the recipe
    for(var i=0; i<this.state.recipes.length; i++){
      if(this.state.recipes[i].id===id){
        return i
      }
    }
    // Not found
    return false;
  }
}

/* ------------------------------
Render the App
------------------------------ */
$(document).ready(()=>{
  render(<App/>, document.getElementById('app'));
  $('#loader').fadeOut('slow');
});
