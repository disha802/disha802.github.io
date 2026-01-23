/**
 * Google Analytics Tracking Helper
 * Tracks custom events for user interactions
 */

function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
        console.log(`GA Event Tracked: ${eventName}`, eventParams);
    } else {
        console.warn('gtag is not defined. Google Analytics might be blocked or not loaded yet.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Track Navigation Clicks & CV Downloads
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const isCV = link.classList.contains('nav-cv') || link.href.includes('CV.pdf');

            if (isCV) {
                trackEvent('cv_download', {
                    file_name: 'CV.pdf',
                    link_text: link.innerText
                });
            }

            trackEvent('navigation_click', {
                link_text: link.innerText,
                link_url: link.href,
                is_cv_click: isCV
            });
        });
    });

    // 2. Track Social Media Clicks
    document.querySelectorAll('.socials a').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('social_link_click', {
                platform: link.getAttribute('aria-label') || 'unknown',
                link_url: link.href
            });
        });
    });

    // 3. Track Project Card Clicks
    document.querySelectorAll('.card[onclick*="projects.html"], .project-image').forEach(card => {
        card.addEventListener('click', () => {
            const projectTitle = card.querySelector('h3')?.innerText || card.querySelector('span')?.innerText || 'unknown_project';
            trackEvent('project_view_click', {
                project_name: projectTitle
            });
        });
    });

    // 4. Track & Handle Contact Form Submission (AJAX)
    const contactForm = document.querySelector('form[action*="formspree.io"]');
    if (contactForm) {
        const status = document.getElementById("form-status");

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);

            // Track the attempt
            trackEvent('contact_form_submission_attempt', {
                form_id: 'main_contact_form'
            });

            try {
                const response = await fetch(e.target.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Standard GA4 event for lead generation
                    trackEvent('generate_lead', {
                        form_id: 'main_contact_form',
                        method: 'ajax'
                    });

                    trackEvent('contact_form_submission_success');

                    if (status) {
                        status.innerHTML = "Message sent successfully! I'll get back to you soon.";
                        status.style.display = "block";
                        status.style.color = "#60a5fa";
                    }
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    trackEvent('contact_form_submission_error', { error: errorData.errors?.[0]?.message });
                    if (status) {
                        status.innerHTML = "Oops! " + (errorData.errors?.[0]?.message || "There was a problem.");
                        status.style.display = "block";
                        status.style.color = "#f87171";
                    }
                }
            } catch (error) {
                trackEvent('contact_form_submission_failed');
                if (status) {
                    status.innerHTML = "Oops! There was a problem submitting your form.";
                    status.style.display = "block";
                    status.style.color = "#f87171";
                }
            }
        });
    }

    // 5. Track Secret Mode Buttons
    ['starsButton', 'snowButton', 'bubblesButton'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                trackEvent('secret_mode_toggle', {
                    effect_type: id.replace('Button', '')
                });
            });
        }
    });

    // 6. Track Education/Experience Card Clicks
    document.querySelectorAll('.card').forEach(card => {
        if (!card.hasAttribute('onclick') && !card.querySelector('a')) {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3')?.innerText || 'unknown_card';
                trackEvent('info_card_click', {
                    card_title: title
                });
            });
        }
    });
});
