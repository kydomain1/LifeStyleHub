// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                showMessage('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showMessage('Please enter a valid email address.', 'error');
            }
        });
    }

    // Content filtering for category pages
    const filterButtons = document.querySelectorAll('.filter-btn');
    const contentCards = document.querySelectorAll('.content-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            contentCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Sorting functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const container = document.querySelector('.content-grid');
            const cards = Array.from(container.querySelectorAll('.content-card'));

            cards.sort((a, b) => {
                const dateA = new Date(a.querySelector('.content-date')?.textContent || '');
                const dateB = new Date(b.querySelector('.content-date')?.textContent || '');

                switch(sortValue) {
                    case 'newest':
                        return dateB - dateA;
                    case 'oldest':
                        return dateA - dateB;
                    case 'popular':
                        // This would typically be based on actual popularity metrics
                        const ratingA = parseFloat(a.querySelector('.content-rating')?.textContent || '0');
                        const ratingB = parseFloat(b.querySelector('.content-rating')?.textContent || '0');
                        return ratingB - ratingA;
                    default:
                        return 0;
                }
            });

            // Re-append sorted cards
            cards.forEach(card => container.appendChild(card));
        });
    }

    // Pagination functionality
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    paginationNumbers.forEach(number => {
        number.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all numbers
            paginationNumbers.forEach(num => num.classList.remove('active'));
            // Add active class to clicked number
            this.classList.add('active');

            // Update prev/next button states
            updatePaginationButtons();

            // Scroll to top of content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentActive = document.querySelector('.pagination-number.active');
            const prevNumber = currentActive.previousElementSibling;

            if (prevNumber && prevNumber.classList.contains('pagination-number')) {
                currentActive.classList.remove('active');
                prevNumber.classList.add('active');
                updatePaginationButtons();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentActive = document.querySelector('.pagination-number.active');
            const nextNumber = currentActive.nextElementSibling;

            if (nextNumber && nextNumber.classList.contains('pagination-number')) {
                currentActive.classList.remove('active');
                nextNumber.classList.add('active');
                updatePaginationButtons();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Social share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = window.location.href;
            const title = document.title;

            if (this.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            } else if (this.classList.contains('twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            } else if (this.classList.contains('pinterest')) {
                const img = document.querySelector('.article-hero-image img, .product-image img')?.src || '';
                window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(img)}&description=${encodeURIComponent(title)}`, '_blank');
            } else if (this.classList.contains('email')) {
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
            }
        });
    });

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.article-card, .category-card, .content-card, .product-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);

    // Contact form functionality
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (name && validateEmail(email) && message) {
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                showMessage('Please fill in all fields correctly.', 'error');
            }
        });
    }
});

// Helper Functions
function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (searchTerm) {
        // In a real implementation, this would search through content
        // For now, we'll just show a message
        showMessage(`Searching for "${searchTerm}"...`, 'info');

        // Simulate search results
        setTimeout(() => {
            showMessage(`Found results for "${searchTerm}". This is a demo - implement actual search functionality.`, 'success');
        }, 1500);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup message-${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(messageDiv);

    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

function updatePaginationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const activeNumber = document.querySelector('.pagination-number.active');
    const firstNumber = document.querySelector('.pagination-number:first-of-type');
    const lastNumber = document.querySelector('.pagination-number:last-of-type');

    if (prevBtn) {
        prevBtn.disabled = activeNumber === firstNumber;
    }

    if (nextBtn) {
        nextBtn.disabled = activeNumber === lastNumber;
    }
}

// Add some CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .content-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
        background: linear-gradient(135deg, #e8b4b8 0%, #d4a5a9 100%);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
        background: linear-gradient(135deg, #e8b4b8 0%, #d4a5a9 100%);
    }

    .hamburger.active {
        background: rgba(232, 180, 184, 0.15);
    }

    .lazy {
        filter: blur(5px);
        transition: filter 0.3s;
    }

    .lazy.loaded {
        filter: blur(0);
    }
`;
document.head.appendChild(style);