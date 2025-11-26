# 🌍 GMT 458 - GeoGame: **Kronosfer**
**Project Orbit Tracker – A CesiumJS-Based 3D Satellite Orbit Game**

Kronosfer is a 3D geogame developed for the GMT 458 Web GIS course. Using CesiumJS, the game displays various satellite orbits on an interactive 3D Earth model. Players must quickly analyze each orbit and answer multiple-choice questions. The goal is to achieve the highest score within the time limit.

---

## 🚀 1. Project Purpose and Scope

This project demonstrates that Web GIS applications can evolve beyond traditional mapping and become interactive, game-based spatial experiences.

In Kronosfer:

- Satellite orbits are visualized on a fully interactive 3D globe,
- Players answer multiple-choice questions related to each orbit,
- Each question creates a fast-paced “planet tour” effect,
- Time pressure and limited lives increase the challenge,
- Scores are saved and displayed through a simple leaderboard system.

---

## 🌐 2. Game Components

### 🔐 **User Login**
Before the game begins, the player enters a username, which is used inside the game and in score records.

### 🪐 **3D CesiumJS Globe**
The main geospatial component:

- The player can rotate and zoom the Earth,
- Orbit lines are attached to the globe and move with it,
- The player can observe the geographic route of each orbit.

### ❓ **Question Panel**
Each question includes three answer options and appears with its corresponding orbit line.

### ❤️ **Lives – Timer – Scoring**
- **Timer:** 60-second countdown  
- **Lives:** 2  
- **Score:** +10 points for each correct answer  
- The gameplay works as a quick “geographic reflex test.”

### 🏆 **Leaderboard**
After the game ends, the top 3 scores are saved using LocalStorage and displayed.

---

## 🖥️ 3. Interface Design

The application has two main screens:

### 🟦 Login Screen
- Project title (Kronosfer)
- Username input field
- Start button

### 🌍 Game Screen
- Fullscreen Cesium 3D Earth
- Top-left info panel:
  - Timer
  - Score
  - Lives (heart icons)
- Bottom-center panel:
  - Current question
  - Three answer choices

---

## 🧭 4. Game Flow

1. The player enters a username on the login screen.
2. Pressing Start begins the 60-second countdown.
3. A random orbit and its question appear.
4. After each answer, a new orbit and new question load.
5. The game ends if the player makes 2 mistakes or the timer expires.
6. A result screen shows the final score and the top 3 scores.

**Note:** There is no fixed number of questions; the goal is to answer as many as possible before time runs out.

---

## 🛠️ 5. Technologies Used

| Technology | Purpose |
|-----------|---------|
| **CesiumJS** | 3D globe and orbit visualization |
| **JavaScript** | Game logic, timer, question handling |
| **HTML/CSS** | Interface structure and styling |
| **LocalStorage** | Saving top 3 high scores |
| **(Optional) Chart.js** | Visualizing score data |

---

## 🎮 Conclusion

Kronosfer is a 3D geographic game prototype created for the GMT 458 Web GIS course. It combines CesiumJS’s geospatial visualization capabilities with a game-based interaction system to deliver a unique and engaging experience.

sadık teymur