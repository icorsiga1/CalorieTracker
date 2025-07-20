// mealCard.js
export function mealCard(mealName, calories, protein) {
    const card = document.createElement('div');
    card.className = 'meal-card';

    // Counter for meal count
    if (!mealCard.mealCount) {
        mealCard.mealCount = 0;
    }
    mealCard.mealCount++;

    card.innerHTML = `
    <div class="meal-info">
        <strong>${mealName} ${mealCard.mealCount}</strong><br>
        Calories: <span class="calories">${calories}</span> cal<br>
        Protein: <span class="protein">${protein}</span> g
    </div>
    <div class="meal-actions">
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
    </div> 
`;


    // Event listeners
    card.querySelector('.edit-btn').addEventListener('click', () => {

        if (typeof mealCard.onEdit === 'function') {
            mealCard.onEdit(mealName, newCalories, newProtein);
        }

    });

    card.querySelector('.remove-btn').addEventListener('click', () => {
        card.remove();
        // Notify main about removal
        if (typeof mealCard.onRemove === 'function') {
            mealCard.onRemove(mealName);
        }
    });

    return card; // <== This must return a DOM element!
}
