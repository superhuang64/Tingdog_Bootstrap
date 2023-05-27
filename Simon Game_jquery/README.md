# Simon Game
This is a Simon Game. 
Tech: Jquery

- Jquery CDN, where to put the script link
- DOM manipulation with jquery 

- understand the game logic
- how to divide function into small tasks
- how to set variable/array

tasks:
user action
1. start:
- dectect keydown to trigger start
- set title level
- ⭐️ go to **next game level**
2. click:
- detect the click button
- **button sound**
- **button animation**
- ⭐️ **check answer**
3. over and restart
- reset the started state/game pattern/level

---

note: add Jquery CDN and inner script: just before `</body>`
```
 <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E="
    crossorigin="anonymous"></script>
  <script src="game.js" charset="UTF-8"></script>
```

1. start:
- dectect keypress to trigger start
  - `.keydown` event
  - set start state(ture or false)
- set title level(DOM)
- go to **next game level**
**next sequence function**
visible:
  - random button:get random number from 1-4 as index of random color
  - button sound
  - button animation
  - level title iteration
invisible:
  - gamepattern iteration(`.push()`)
  - clear userpattern

2. click:
- detect the click button
- **button sound**
  - new audio object+ play method
- **button animation**
click animation + new button fade animation
  - add pressed class(button style- shadow)
  - gradually hidden and then appear(button action)
   `.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);`
- **check answer**
  - ⭐️ compare userpattern and gamepattern
    - two factors of evaluation:
      - value of current level and list length
