import { mealCard } from './mealCard.js';

document.addEventListener("DOMContentLoaded", () => {
    const mealList = document.getElementById("meal-list");
    const calorieProgress = document.getElementById("calorie-progress");
    const proteinProgress = document.getElementById("protein-progress");
    const calorieLabel = document.getElementById("calorie-label");
    const proteinLabel = document.getElementById("protein-label");
    const goalSound = document.getElementById("goalSound");
    const premadeMealContainer = document.querySelector(".premade-meal-container");
    const customPremadeForm = document.getElementById("custom-premade-form");

    let mealCount = 1;
    let actualCalories = 0;
    let actualProtein = 0;
    let calorieGoalMet = false;
    let proteinGoalMet = false;

    // Load saved calorie & protein progress and meals
    const savedData = localStorage.getItem("calorieTrackerData");
    if (savedData) {
        const { actualCalories: savedCal, actualProtein: savedProt, calorieMax, proteinMax, meals } = JSON.parse(savedData);

        actualCalories = savedCal;
        actualProtein = savedProt;
        calorieProgress.max = calorieMax;
        proteinProgress.max = proteinMax;
        calorieProgress.value = Math.min(actualCalories, calorieMax);
        proteinProgress.value = Math.min(actualProtein, proteinMax);

        updateLabel(calorieLabel, actualCalories, calorieMax, "Calorie");
        updateLabel(proteinLabel, actualProtein, proteinMax, "Protein");

        mealCount = 1;
        meals.forEach(meal => {
            const card = createMealCard(meal.baseName, meal.calories, meal.protein, mealCount++);
            mealList.appendChild(card);
        });
    }

    // Load saved custom premade meals or fallback to empty array
    let customMeals = JSON.parse(localStorage.getItem("customMeals")) || [];
    loadCustomMeals();

    // --- Functions ---

    function createMealCard(baseName, calories, protein, number) {
        const card = document.createElement("div");
        card.className = "meal-card";
        const displayName = number ? `${baseName} ${number}` : baseName;
        card.innerHTML = `
            <div class="meal-info">
                <strong>${displayName}</strong><br>
                Calories: <span class="calories">${calories}</span> cal<br>
                Protein: <span class="protein">${protein}</span> g
            </div>
            <div class="meal-actions">
                <button class="edit-btn">Edit</button>
                <button class="remove-btn">Remove</button>
            </div>
        `;
        return card;
    }

    function updateLabel(label, value, max, type) {
        label.innerText = `${type} Progress: ${value} / ${max}`;
    }

    function updateProgress(progress, valueToAdd, label, type) {
        const numValue = parseInt(valueToAdd) || 0;

        if (type === "Calorie") {
            actualCalories += numValue;
            progress.value = Math.min(actualCalories, progress.max);
            updateLabel(label, actualCalories, progress.max, type);
        } else if (type === "Protein") {
            actualProtein += numValue;
            progress.value = Math.min(actualProtein, progress.max);
            updateLabel(label, actualProtein, progress.max, type);
        }
        saveProgress();
        checkGoalAndPlaySound();
    }

    function subtractProgress(progress, valueToSubtract, type) {
        if (type === "Calorie") {
            actualCalories = Math.max(0, actualCalories - parseInt(valueToSubtract));
            progress.value = Math.min(actualCalories, progress.max);
            updateLabel(calorieLabel, actualCalories, progress.max, "Calorie");
            if (actualCalories < calorieProgress.max) {
                calorieGoalMet = false;
            }
        } else if (type === "Protein") {
            actualProtein = Math.max(0, actualProtein - parseInt(valueToSubtract));
            progress.value = Math.min(actualProtein, progress.max);
            updateLabel(proteinLabel, actualProtein, progress.max, "Protein");
            if (actualProtein < proteinProgress.max) {
                proteinGoalMet = false;
            }
        }
    }

    function checkGoalAndPlaySound() {
        if (actualCalories >= calorieProgress.max && !calorieGoalMet) {
            calorieGoalMet = true;
            if (goalSound) goalSound.play();
        }
        if (actualProtein >= proteinProgress.max && !proteinGoalMet) {
            proteinGoalMet = true;
            if (goalSound) goalSound.play();
        }
    }

    function handleEditGoals() {
        const calorieGoal = prompt("Enter new calorie goal:");
        const proteinGoal = prompt("Enter new protein goal:");

        if (!isNaN(calorieGoal) && calorieGoal.trim() !== "") {
            calorieProgress.max = calorieGoal;
            calorieProgress.value = Math.min(actualCalories, calorieProgress.max);
            updateLabel(calorieLabel, actualCalories, calorieProgress.max, "Calorie");
            calorieGoalMet = actualCalories >= calorieProgress.max;
        }
        if (!isNaN(proteinGoal) && proteinGoal.trim() !== "") {
            proteinProgress.max = proteinGoal;
            proteinProgress.value = Math.min(actualProtein, proteinProgress.max);
            updateLabel(proteinLabel, actualProtein, proteinProgress.max, "Protein");
            proteinGoalMet = actualProtein >= proteinProgress.max;
        }
        saveProgress();
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const caloriesToAdd = document.getElementById("calories").value.trim() === "" ? 0 :
            parseInt(document.getElementById("calories").value) || 0;
        const proteinToAdd = document.getElementById("food-item").value.trim() === "" ? 0 :
            parseInt(document.getElementById("food-item").value) || 0;

        updateProgress(calorieProgress, caloriesToAdd, calorieLabel, "Calorie");
        updateProgress(proteinProgress, proteinToAdd, proteinLabel, "Protein");

        addMealToList("Meal", caloriesToAdd, proteinToAdd);

        document.getElementById("calories").value = "";
        document.getElementById("food-item").value = "";
    }

    function addMealToList(baseName, calories, protein) {
        const card = createMealCard(baseName, calories, protein, mealCount++);
        mealList.appendChild(card);
        saveProgress();
        return card;
    }

    function handleReset() {
        localStorage.removeItem("calorieTrackerData");
        actualCalories = 0;
        actualProtein = 0;
        calorieProgress.value = 0;
        proteinProgress.value = 0;
        calorieGoalMet = false;
        proteinGoalMet = false;
        updateLabel(calorieLabel, 0, calorieProgress.max, "Calorie");
        updateLabel(proteinLabel, 0, proteinProgress.max, "Protein");
        mealList.innerHTML = "";
        mealCount = 1;
    }

    function handleMealCardClick(event) {
        const editBtn = event.target.closest('.edit-btn');
        const removeBtn = event.target.closest('.remove-btn');

        if (!editBtn && !removeBtn) return;

        const card = event.target.closest('.meal-card');
        if (!card) return;

        const mealInfo = card.querySelector('.meal-info');
        const nameLine = mealInfo.querySelector('strong').innerText;
        const currentCalories = parseInt(mealInfo.querySelector('.calories').innerText) || 0;
        const currentProtein = parseInt(mealInfo.querySelector('.protein').innerText) || 0;

        if (editBtn) {
            const newCalories = prompt("New calories:", currentCalories);
            const newProtein = prompt("New protein:", currentProtein);

            if (newCalories !== null && newProtein !== null) {
                actualCalories = actualCalories - currentCalories + parseInt(newCalories || 0);
                actualProtein = actualProtein - currentProtein + parseInt(newProtein || 0);

                calorieProgress.value = Math.min(actualCalories, calorieProgress.max);
                proteinProgress.value = Math.min(actualProtein, proteinProgress.max);

                mealInfo.innerHTML = `
                    <strong>${nameLine}</strong><br>
                    Calories: <span class="calories">${newCalories}</span> cal<br>
                    Protein: <span class="protein">${newProtein}</span> g
                `;

                updateLabel(calorieLabel, actualCalories, calorieProgress.max, "Calorie");
                updateLabel(proteinLabel, actualProtein, proteinProgress.max, "Protein");
                saveProgress();
            }
        }
        else if (removeBtn) {
            subtractProgress(calorieProgress, currentCalories, "Calorie");
            subtractProgress(proteinProgress, currentProtein, "Protein");
            card.remove();
            saveProgress();
        }
    }

    function handlePremadeMealClick(baseName, calories, protein) {
        updateProgress(calorieProgress, calories, calorieLabel, "Calorie");
        updateProgress(proteinProgress, protein, proteinLabel, "Protein");

        const card = createMealCard(baseName, calories, protein, mealCount++);
        mealList.appendChild(card);
        saveProgress();
    }

    // Save meals & progress to localStorage
    function saveProgress() {
        const meals = Array.from(mealList.children).map(card => {
            const fullName = card.querySelector("strong").innerText;
            const baseName = fullName.replace(/\s\d+$/, '');
            return {
                baseName,
                calories: card.querySelector(".calories").innerText,
                protein: card.querySelector(".protein").innerText
            };
        });

        const progressData = {
            actualCalories,
            actualProtein,
            calorieMax: calorieProgress.max,
            proteinMax: proteinProgress.max,
            meals
        };
        localStorage.setItem("calorieTrackerData", JSON.stringify(progressData));
        saveCustomMealsToLocalStorage();
    }

    // Save current premade meals (including custom ones) to localStorage
    function saveCustomMealsToLocalStorage() {
        const meals = Array.from(premadeMealContainer.querySelectorAll(".premade-meal")).map(mealDiv => ({
            name: mealDiv.dataset.name,
            calories: parseInt(mealDiv.dataset.calories),
            protein: parseInt(mealDiv.dataset.protein)
        }));
        localStorage.setItem("customMeals", JSON.stringify(meals));
    }

    // Load premade meals from localStorage and populate container
    function loadCustomMeals() {
        premadeMealContainer.innerHTML = ""; // Clear existing to avoid duplicates

        if (customMeals.length === 0) {
            // Optionally load default premade meals if none saved
            // (If you want, add your default premade meals here)
            // Otherwise just leave empty and rely on hardcoded HTML
        } else {
            customMeals.forEach(meal => {
                const div = document.createElement("div");
                div.className = "premade-meal";
                div.dataset.name = meal.name;
                div.dataset.calories = meal.calories;
                div.dataset.protein = meal.protein;

                div.innerHTML = `
                    <strong>${meal.name}</strong><br>
                    Calories: ${meal.calories} cal<br>
                    Protein: ${meal.protein} g<br>
                    <button class="add-premade-btn">Add</button>
                    <button class="remove-premade-btn">Remove</button>
                `;
                premadeMealContainer.appendChild(div);
            });
        }
    }

    // --- Event Listeners ---

    // Delegated event listener for premade meal container
    premadeMealContainer.addEventListener("click", (e) => {
        const target = e.target;

        if (target.classList.contains("remove-premade-btn")) {
            const mealDiv = target.closest(".premade-meal");
            if (mealDiv && confirm(`Remove premade meal "${mealDiv.dataset.name}"?`)) {
                mealDiv.remove();
                saveCustomMealsToLocalStorage();
            }
        }

        if (target.classList.contains("add-premade-btn")) {
            const mealDiv = target.closest(".premade-meal");
            if (mealDiv) {
                const name = mealDiv.dataset.name;
                const calories = parseInt(mealDiv.dataset.calories);
                const protein = parseInt(mealDiv.dataset.protein);
                handlePremadeMealClick(name, calories, protein);
            }
        }
    });

    // Handle meal list edits and removals
    mealList.addEventListener("click", handleMealCardClick);

    // Handle adding custom premade meals
    customPremadeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("custom-name").value.trim();
        const calories = parseInt(document.getElementById("custom-calories").value);
        const protein = parseInt(document.getElementById("custom-protein").value);

        if (!name || isNaN(calories) || isNaN(protein)) {
            alert("Please enter valid meal name, calories, and protein values.");
            return;
        }

        // Create new premade meal div
        const newDiv = document.createElement("div");
        newDiv.className = "premade-meal";
        newDiv.dataset.name = name;
        newDiv.dataset.calories = calories;
        newDiv.dataset.protein = protein;

        newDiv.innerHTML = `
            <strong>${name}</strong><br>
            Calories: ${calories} cal<br>
            Protein: ${protein} g<br>
            <button class="add-premade-btn">Add</button>
            <button class="remove-premade-btn">Remove</button>
        `;

        premadeMealContainer.appendChild(newDiv);

        // Update saved custom meals list and localStorage
        customMeals.push({ name, calories, protein });
        saveCustomMealsToLocalStorage();

        customPremadeForm.reset();
    });

    // Handle edit goals button
    document.getElementById("edit-goals-btn")?.addEventListener("click", handleEditGoals);
    // Handle adding custom meals manually
    document.getElementById("calorie-form")?.addEventListener("submit", handleFormSubmit);
    // Reset button clears all
    document.getElementById("reset-btn")?.addEventListener("click", handleReset);

    // Initialize progress labels
    updateLabel(calorieLabel, actualCalories, calorieProgress.max, "Calorie");
    updateLabel(proteinLabel, actualProtein, proteinProgress.max, "Protein");

    console.log("main.js is loaded and ready!");
});
