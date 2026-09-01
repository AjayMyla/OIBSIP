/* =========================================================
   AJAY MYLA — PORTFOLIO JAVASCRIPT
   ========================================================= */


/* =========================
   MOBILE MENU
========================= */

const menuButton = document.getElementById("menuButton");

const navLinks = document.getElementById("navLinks");

const links = document.querySelectorAll(".nav-link");


menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


/* Close menu after clicking */

links.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections = document.querySelectorAll(
    ".section-anchor"
);


const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const id = entry.target.id;


                links.forEach(link => {

                    link.classList.remove("active");


                    if (
                        link.getAttribute("href")
                        === `#${id}`
                    ) {

                        link.classList.add("active");

                    }

                });

            }

        });

    },

    {
        threshold: 0.35
    }

);


sections.forEach(section => {

    observer.observe(section);

});


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(
                    entry.target
                );

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================
   CURRENT YEAR
========================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================
   CLOSE MENU WITH ESC
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        navLinks.classList.remove("open");

    }

});