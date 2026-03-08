### Time Waster Tracker

- On load, shows the total seconds elapsed since **5 years ago today at 00:00:00**.
- Clicking the **“I coded today”** button starts a **reclaimed seconds timer**, counting from the moment the user clicked and synced with `localStorage`.
- Tracks a **daily coding streak**. If a day is missed, the streak resets.
- All state (streak, reclaimed seconds, last coded date, and “coding today” flag) is persisted in `localStorage`.

[Live Demo](http://exuberant-apparel.surge.sh/)
