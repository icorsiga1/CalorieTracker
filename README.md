# 🍽️ Calorie & Protein Tracker  

This project is a **meal tracking web app** that helps you monitor daily **calorie and protein intake** against your personal goals. You can add meals, edit them, track progress with interactive bars, and even save **custom premade meals** for quick entry. All data is saved to `localStorage` so your progress is preserved across sessions.  

---

## 🚀 Features  

- ✅ **Progress Tracking**  
  - Displays progress bars for **calories** and **protein**.  
  - Updates automatically as meals are added, edited, or removed.  
  - Plays a sound when goals are achieved.  

- ✅ **Meal Management**  
  - Add meals manually with calorie and protein values.  
  - Edit or remove existing meals directly from the meal list.  
  - Track unlimited meals per day.  

- ✅ **Custom Premade Meals**  
  - Add your own premade meals with name, calories, and protein.  
  - Quickly insert premade meals into your daily tracker.  
  - Remove or edit premade meals anytime.  

- ✅ **Goal Management**  
  - Set and edit your daily calorie and protein goals.  
  - Goals persist via local storage.  

- ✅ **Persistent Data**  
  - Meals, progress, and custom meals are saved automatically to `localStorage`.  
  - Data is restored on page reload.  

---

## 📂 Project Structure  
📦 calorie-protein-tracker
┣ 📜 index.html # Main UI
┣ 📜 style.css # Styles for progress bars and cards
┣ 📜 main.js # Core logic (meal tracking, localStorage, event handling)
┣ 📜 mealCard.js # Utility for creating meal cards
┗ 📜 README.md # Documentation

---

## 🛠️ How It Works  

1. **Set Your Goals**  
   - Click **Edit Goals** to set calorie & protein limits.  

2. **Add Meals**  
   - Enter calories and protein manually via the form.  
   - OR click **Add** on a premade meal to insert instantly.  

3. **Track Progress**  
   - Progress bars update automatically.  
   - Labels show current vs. target intake.  

4. **Edit / Remove Meals**  
   - Click **Edit** on a meal card to adjust values.  
   - Click **Remove** to delete a meal and update progress.  

5. **Premade Meals**  
   - Use the **Custom Premade Meal Form** to add reusable meals.  
   - Save them for quick access in future sessions.  

6. **Reset Tracker**  
   - Click **Reset** to clear all meals and start fresh.  

--- 

## 💾 Data Persistence  

All information is stored in **localStorage**:  

- `calorieTrackerData` → progress, goals, and meal history  
- `customMeals` → saved premade meals  

Data is automatically saved when you:  
- Add/edit/remove meals  
- Change goals  
- Add/remove premade meals  

---

## 🎯 Future Improvements  

- Add support for **multiple days** or history tracking.  
- Include **nutrient tracking** (carbs, fats, etc.).  
- Export/import meal logs to share or back up data.  
- Mobile-friendly interface.  

---

## ▶️ Getting Started  

1. Clone or download the repository.  
2. Open `index.html` in your browser.  
3. Start tracking your meals!  
