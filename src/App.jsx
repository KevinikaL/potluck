
import { useState } from 'react'
import  useTable  from './useTable.js'
import { supabase } from './utils/supabase'
import MealCard from './MealCard.jsx'
import './App.css'


function App() {

    const { data, error, reload } = useTable("meals")
    const [newestMeals, setNewestMeals] = useState([])
    const totalServings = data.reduce((total, meal) => total + meal.serves, 0)
    const addMeal = async (event) => {
      event.preventDefault()
      const form = event.target
      const meal = {
        meal_name: form.mealName.value,
        guest_name: form.guestName.value,
        serves: Number(form.serves.value),
    }

    const result = await supabase.from("meals").insert(meal)
    
    if (result.error) {
    console.log(result.error.message)
    return
   }
    form.reset()
    reload()
  }

   const removeMeal = async (id) => {
   const result = await supabase.from("meals").delete().eq("id", id)
    if (result.error) {
    console.log(result.error.message)
    return
  }
  reload()
}


const loadNewest = async () => {
  const { data, error } = await supabase
    .from("meals")
    .select()
    .order("created_at", { ascending: false })

  if (error) {
    console.log(error.message)
    return
  }

  setNewestMeals(data)
}




  return (
    <div>
      <h1>Potluck</h1>
      <p>Total servings: {totalServings}</p>

      <form onSubmit={addMeal}>
        <input name="mealName" placeholder="Dish" required />
        <input name="guestName" placeholder="Your name" required />
        <input name="serves" type="number" placeholder="Serves" min="1" required />
        <button>Add</button>
      </form>
        
      <button onClick={loadNewest}>Newest first</button>
      {newestMeals.map((meal) => (
        <p key={meal.id}>{meal.meal_name}</p>
      ))}
      
      <p>{error}</p>
      {data.map((meal) => <MealCard key={meal.id} meal={meal} onRemove={removeMeal} />)}
    </div>
  )
}

export default App
