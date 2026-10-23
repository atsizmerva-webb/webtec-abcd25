/**
 * Enable a responsive navbar toggle.
 */
console.log('Hello navbar')

// Get the hamburger menu button element by its ID
const menuToggle = document.getElementById('menu-toggle')
const navLinks = document.getElementById('nav-links')


// Add a click event listener to the menu button
menuToggle.addEventListener('click', () => {
  // Toggle the 'show' class on the nav links to show/hide the menu
  navLinks.classList.toggle('show')
})

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show")
  })
})