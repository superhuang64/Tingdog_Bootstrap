
# Web Development/ TinDog
A Dating app for dog

---
# Screenshot
<img src="TinDog-bootstrap/screenshot/tindog.gif" alt="tindog">

---

Tech:bootstrap
- navbar:collapse/spacing
- grid system+ break points
- carousel:silde,control part
- image rotate, position
- insert icon from fontawsome toy button, and change style

---
Add link/script in`<head>`section
- bootstrap;stylesheet
- Font:google font
- icon:font awesome

# Components:
1. nav bar
- container:`<div></div>`&`class= "container-fluid"`
- list,button,anchor tag
- **responsive**:
`class="collapse navbar-collapse"`
grouping and hiding navbar contents by a parent breakpoint
- **spacing**:
`class="ms-auto"`
  - `.ms-auto` (margin-inline-start: auto) ≈ 
    `.ml-auto` (margin-left: auto)
    - align the element to the right
  - `me-auto` align the element to the left

2. title
combined selector
- **responsive buttons**
`class="col-lg-6 col-md-12"`
- grid system, breakpoints
- add button style
`class="btn btn-outline-light download-button">`
- **add icons to the button**(from font awesome)
`<i class="fa-brands fa-apple"></i>`
- add font style(from google fonts)
```
.big-heading {
    font-family: "Montserrat-Black";}
```
3. image
```
.title-image {
    width: 20%;
    transform: rotate(25deg);
    position: absolute;
    right: 20%;
}
```
**Image styling**
- Rotate the image:
`transform: rotate(25deg);`
- Image round
`border-radius: 100%;`
- set absolute position

4. icon
- set color for <i></i> 
```
.icon {
    color: #ef8172;
    margin-bottom: 1rem;
}
```
- set icon hover color
```
.icon:hover {
    color: #ff4c68;
}
```

5. bootstrap carousel
- shift by slide:`class="carousel slide"`
- remove auto slide:`data-ride="false"`
- add control button
```
<a class="carousel-control-prev" href="#testimonials-carousel" role="button" data-slide="prev">
<span class="carousel-control-prev-icon"></span></a>
<a class="carousel-control-next" href="#testimonials-carousel" role="button" data-slide="next">
<span class="carousel-control-next-icon"></span></a>
```

