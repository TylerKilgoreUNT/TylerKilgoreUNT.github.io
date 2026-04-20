function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");

    // Re-trigger list item animation each time mobile menu opens.
    if (menu.classList.contains("open")) {
        const menuItems = menu.querySelectorAll("li");
        menuItems.forEach((item, index) => {
            item.style.animation = "none";
            item.getBoundingClientRect();
            item.style.animation = `menuItemIn 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards`;
            item.style.animationDelay = `${index * 65}ms`;
        });
    }
}

function setupHyperframeStyleAnimations() {
    const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        return;
    }

    const animationGroups = [
        { selector: "#profile .section__pic-container", effect: "hf-left", stagger: 0 },
        { selector: "#profile .section__text > *", effect: "hf-up", stagger: 70 },
        { selector: "#about .title, #about .section__text__p1", effect: "hf-up", stagger: 60 },
        { selector: "#about .details-container", effect: "hf-up", stagger: 90 },
        { selector: "#about .text-container", effect: "hf-right", stagger: 0 },
        { selector: "#experience .title, #experience .section__text__p1", effect: "hf-up", stagger: 60 },
        { selector: "#experience .details-container", effect: "hf-up", stagger: 100 },
        { selector: "#projects .title, #projects .section__text__p1", effect: "hf-up", stagger: 60 },
        { selector: "#projects .color-container", effect: "hf-scale", stagger: 110 },
        { selector: "#contact .title, #contact .section__text__p1", effect: "hf-up", stagger: 60 },
        { selector: "#contact .contact-info-container", effect: "hf-up", stagger: 90 },
        { selector: "footer .nav-links li", effect: "hf-up", stagger: 55 }
    ];

    animationGroups.forEach((group) => {
        const nodes = document.querySelectorAll(group.selector);
        nodes.forEach((node, index) => {
            node.classList.add("hf-reveal", group.effect);
            node.style.setProperty("--hf-delay", `${index * group.stagger}ms`);
        });
    });

    const revealNodes = document.querySelectorAll(".hf-reveal");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -12% 0px"
        }
    );

    revealNodes.forEach((node) => observer.observe(node));
}

function setupSocialIconHoverEffects() {
    const socialContainer = document.querySelector("#socials-container");
    if (!socialContainer) {
        return;
    }

    const socialIcons = Array.from(socialContainer.querySelectorAll(".social-icon"));

    const clearSocialStates = () => {
        socialIcons.forEach((icon) => {
            icon.classList.remove("is-active", "shift-left", "shift-right");
        });
    };

    socialIcons.forEach((icon, activeIndex) => {
        const applyState = () => {
            clearSocialStates();
            icon.classList.add("is-active");

            socialIcons.forEach((otherIcon, index) => {
                if (index < activeIndex) {
                    otherIcon.classList.add("shift-left");
                } else if (index > activeIndex) {
                    otherIcon.classList.add("shift-right");
                }
            });
        };

        icon.addEventListener("mouseenter", applyState);
        icon.addEventListener("focus", applyState);
    });

    socialContainer.addEventListener("mouseleave", clearSocialStates);
    socialContainer.addEventListener("focusout", (event) => {
        if (!socialContainer.contains(event.relatedTarget)) {
            clearSocialStates();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupHyperframeStyleAnimations();
    setupSocialIconHoverEffects();
});

