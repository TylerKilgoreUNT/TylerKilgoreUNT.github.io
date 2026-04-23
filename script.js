function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (!menu || !icon) {
        return;
    }

    menu.classList.toggle("open");
    icon.classList.toggle("open");
    icon.setAttribute("aria-expanded", String(menu.classList.contains("open")));

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

function updateSocialIconsForTheme() {
    const socialContainer = document.querySelector("#socials-container");
    if (!socialContainer) {
        return;
    }

    const socialLinks = Array.from(socialContainer.querySelectorAll(".social-link"));
    const socialIcons = socialLinks
        .map((link) => link.querySelector(".social-icon"))
        .filter(Boolean);

    const isDarkMode = document.body.dataset.theme === "dark";
    socialIcons.forEach((icon) => {
        const originalDefaultSrc = icon.dataset.originalDefaultSrc || icon.dataset.defaultSrc;
        const originalHoverSrc = icon.dataset.originalHoverSrc || icon.dataset.hoverSrc;

        if (!originalDefaultSrc || !originalHoverSrc) {
            return;
        }

        icon.dataset.originalDefaultSrc = originalDefaultSrc;
        icon.dataset.originalHoverSrc = originalHoverSrc;

        if (isDarkMode) {
            icon.dataset.defaultSrc = originalHoverSrc;
            icon.dataset.hoverSrc = originalHoverSrc;
            icon.src = originalHoverSrc;
        } else {
            icon.dataset.defaultSrc = originalDefaultSrc;
            icon.dataset.hoverSrc = originalHoverSrc;
            icon.src = originalDefaultSrc;
        }
    });
}

function updateLogoForTheme() {
    const isDarkMode = document.body.dataset.theme === "dark";
    document.querySelectorAll(".logo[data-dark-src]").forEach((logo) => {
        const defaultSrc = logo.dataset.defaultSrc;
        const darkSrc = logo.dataset.darkSrc;
        if (isDarkMode && darkSrc) {
            logo.src = darkSrc;
        } else if (defaultSrc) {
            logo.src = defaultSrc;
        }
    });
}

function setupThemeToggle() {
    const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
    if (themeToggles.length === 0) {
        return;
    }

    const storageKey = "preferred-theme";
    const systemPrefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = globalThis.localStorage.getItem(storageKey);
    let initialTheme = savedTheme;
    if (savedTheme !== "dark" && savedTheme !== "light") {
        initialTheme = systemPrefersDark ? "dark" : "light";
    }

    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;

        const isDark = theme === "dark";
        themeToggles.forEach((toggle) => {
            toggle.setAttribute("aria-pressed", String(isDark));
            toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

            const icon = toggle.querySelector(".theme-toggle__icon");
            if (icon) {
                icon.textContent = isDark ? "sun" : "moon";
            }
        });

        updateLogoForTheme();
        updateSocialIconsForTheme();
    };

    applyTheme(initialTheme);

    themeToggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            globalThis.localStorage.setItem(storageKey, nextTheme);
        });
    });
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

    const socialLinks = Array.from(socialContainer.querySelectorAll(".social-link"));
    const socialIcons = socialLinks
        .map((link) => link.querySelector(".social-icon"))
        .filter(Boolean);

    if (socialIcons.length === 0) {
        return;
    }

    updateSocialIconsForTheme();

    socialIcons.forEach((icon) => {
        const hoverSrc = icon.dataset.hoverSrc;
        if (hoverSrc) {
            const preload = new Image();
            preload.src = hoverSrc;
        }
    });

    const setIconImageState = (icon, isActive) => {
        const defaultSrc = icon.dataset.defaultSrc;
        const hoverSrc = icon.dataset.hoverSrc;

        if (isActive && hoverSrc) {
            icon.src = hoverSrc;
            return;
        }

        if (defaultSrc) {
            icon.src = defaultSrc;
        }
    };

    const clearSocialStates = () => {
        socialIcons.forEach((icon) => {
            icon.classList.remove("is-active", "shift-left", "shift-right");
            setIconImageState(icon, false);
        });
    };

    socialLinks.forEach((link, activeIndex) => {
        const icon = socialIcons[activeIndex];
        if (!icon) {
            return;
        }

        const applyState = () => {
            clearSocialStates();
            icon.classList.add("is-active");
            setIconImageState(icon, true);

            socialIcons.forEach((otherIcon, index) => {
                if (index < activeIndex) {
                    otherIcon.classList.add("shift-left");
                } else if (index > activeIndex) {
                    otherIcon.classList.add("shift-right");
                }
            });
        };

        link.addEventListener("mouseenter", applyState);
        link.addEventListener("focus", applyState);
    });

    socialContainer.addEventListener("mouseleave", clearSocialStates);
    socialContainer.addEventListener("focusout", (event) => {
        if (!socialContainer.contains(event.relatedTarget)) {
            clearSocialStates();
        }
    });
}

function setupDesktopNavHoverEffects() {
    const desktopNavLinksContainer = document.querySelector("#desktop-nav .nav-links");
    if (!desktopNavLinksContainer) {
        return;
    }

    const navLinks = Array.from(desktopNavLinksContainer.querySelectorAll("a"));
    if (navLinks.length === 0) {
        return;
    }

    const clearNavStates = () => {
        navLinks.forEach((link) => {
            link.classList.remove("is-active", "shift-left", "shift-right");
        });
    };

    navLinks.forEach((link, activeIndex) => {
        const applyState = () => {
            clearNavStates();
            link.classList.add("is-active");

            navLinks.forEach((otherLink, index) => {
                if (index < activeIndex) {
                    otherLink.classList.add("shift-left");
                } else if (index > activeIndex) {
                    otherLink.classList.add("shift-right");
                }
            });
        };

        link.addEventListener("mouseenter", applyState);
        link.addEventListener("focus", applyState);
    });

    desktopNavLinksContainer.addEventListener("mouseleave", clearNavStates);
    desktopNavLinksContainer.addEventListener("focusout", (event) => {
        if (!desktopNavLinksContainer.contains(event.relatedTarget)) {
            clearNavStates();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const hamburgerButton = document.querySelector(".hamburger-icon");
    if (hamburgerButton) {
        hamburgerButton.addEventListener("click", toggleMenu);
    }

    setupThemeToggle();
    setupHyperframeStyleAnimations();
    setupSocialIconHoverEffects();
    setupDesktopNavHoverEffects();
});

