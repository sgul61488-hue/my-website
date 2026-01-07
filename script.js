/**
 * Portfolio Website - Professional JavaScript Implementation
 * Author: Shahzad Gul
 * Registration: 2025-SE-001
 * UET Abbottabad Campus
 */

// Academic Data - Updated with your information
const academicData = [
    {
        level: "Matriculation",
        institution: "Govt School Peshawar",
        year: "2022",
        board: "Board of Secondary Education, Peshawar",
        status: "Completed"
    },
    {
        level: "Intermediate (FSc)",
        institution: "Farabi Degree College Peshawar",
        year: "2024",
        board: "Board of Intermediate & Secondary Education, Peshawar",
        status: "Completed"
    },
    {
        level: "University",
        institution: "University of Engineering & Technology, Abbottabad Campus",
        year: "2025-Present",
        board: "University of Engineering & Technology, Peshawar",
        status: "Currently Enrolled"
    }
];

// DOM Elements
const academicTableBody = document.getElementById('academic-table-body');
const rowCountElement = document.getElementById('row-count');
const levelFilter = document.getElementById('level-filter');
const searchBox = document.getElementById('search-box');
const sortYearBtn = document.getElementById('sort-year');
const resetFiltersBtn = document.getElementById('reset-filters');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const carouselInner = document.getElementById('carousel-inner');
const carouselIndicators = document.getElementById('carousel-indicators');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Global variables
let currentSlide = 0;
let isAutoRotating = true;
let autoRotateInterval;

/**
 * Initialize the portfolio website
 */
function initializePortfolio() {
    populateAcademicTable(academicData);
    initializeCarousel();
    initializeProgressBars();
    setupEventListeners();
    checkThemePreference();
    setupSmoothScrolling();
    setupTableSorting();
    updateBackToTopButton();
    
    // Start auto-rotate for carousel
    startAutoRotate();
}

/**
 * Populate academic table with data
 * @param {Array} data - Academic data array
 */
function populateAcademicTable(data) {
    academicTableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.level}</td>
            <td>${item.institution}</td>
            <td>${item.year}</td>
            <td>${item.board}</td>
            <td><span class="status-badge ${item.status === 'Completed' ? 'completed' : 'ongoing'}">${item.status}</span></td>
        `;
        academicTableBody.appendChild(row);
    });
    
    rowCountElement.textContent = data.length;
    updateTableInfo(data.length);
}

/**
 * Update table information display
 * @param {number} count - Number of records displayed
 */
function updateTableInfo(count) {
    rowCountElement.textContent = count;
    rowCountElement.style.fontWeight = 'bold';
}

/**
 * Filter academic table based on selected criteria
 */
function filterAcademicTable() {
    const levelFilterValue = levelFilter.value;
    const searchValue = searchBox.value.toLowerCase();
    
    let filteredData = academicData.filter(item => {
        // Filter by level
        if (levelFilterValue !== 'all' && item.level !== levelFilterValue) {
            return false;
        }
        
        // Filter by search
        if (searchValue && 
            !item.level.toLowerCase().includes(searchValue) &&
            !item.institution.toLowerCase().includes(searchValue) &&
            !item.year.toLowerCase().includes(searchValue) &&
            !item.board.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        return true;
    });
    
    populateAcademicTable(filteredData);
}

/**
 * Sort academic data by year (descending)
 */
function sortByYear() {
    const sortedData = [...academicData].sort((a, b) => {
        const yearA = extractYearNumber(a.year);
        const yearB = extractYearNumber(b.year);
        return yearB - yearB; // Descending order (newest first)
    });
    
    populateAcademicTable(sortedData);
    showNotification('Table sorted by year (descending)', 'info');
}

/**
 * Extract year number from year string
 * @param {string} yearString - Year string (e.g., "2022", "2025-Present")
 * @returns {number} - Extracted year number
 */
function extractYearNumber(yearString) {
    const match = yearString.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
}

/**
 * Reset all filters to default state
 */
function resetFilters() {
    levelFilter.value = 'all';
    searchBox.value = '';
    populateAcademicTable(academicData);
    showNotification('Filters have been reset', 'success');
}

/**
 * Initialize carousel functionality
 */
function initializeCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    
    // Create indicators
    carouselIndicators.innerHTML = '';
    items.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
    });
}

/**
 * Navigate to specific slide
 * @param {number} index - Slide index
 */
function goToSlide(index) {
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    
    // Boundary check
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    
    // Update current slide
    currentSlide = index;
    
    // Update carousel position
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Reset auto-rotate timer
    resetAutoRotate();
}

/**
 * Navigate to next slide
 */
function nextSlide() {
    const items = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide + 1) % items.length;
    goToSlide(currentSlide);
}

/**
 * Navigate to previous slide
 */
function prevSlide() {
    const items = document.querySelectorAll('.carousel-item');
    currentSlide = (currentSlide - 1 + items.length) % items.length;
    goToSlide(currentSlide);
}

/**
 * Start auto-rotate for carousel
 */
function startAutoRotate() {
    if (isAutoRotating) {
        autoRotateInterval = setInterval(nextSlide, 5000);
    }
}

/**
 * Reset auto-rotate timer
 */
function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
}

/**
 * Pause auto-rotate on hover
 */
function pauseAutoRotate() {
    isAutoRotating = false;
    clearInterval(autoRotateInterval);
}

/**
 * Resume auto-rotate
 */
function resumeAutoRotate() {
    isAutoRotating = true;
    startAutoRotate();
}

/**
 * Initialize progress bars animation
 */
function initializeProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        // Animate the progress bar
        setTimeout(() => {
            fill.style.width = `${width}%`;
            fill.style.transition = 'width 1.5s ease-in-out';
        }, 300);
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    const themeIcon = document.querySelector('.theme-switcher i');
    
    // Update theme icon
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        showNotification('Dark mode enabled', 'info');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        showNotification('Light mode enabled', 'info');
    }
}

/**
 * Check for saved theme preference
 */
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-switcher i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Update hamburger icon
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

/**
 * Close mobile menu when clicking outside
 * @param {Event} event - Click event
 */
function closeMobileMenuOnClickOutside(event) {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(event.target) && 
        !hamburger.contains(event.target)) {
        toggleMobileMenu();
    }
}

/**
 * Setup smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

/**
 * Update back to top button visibility
 */
function updateBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Setup table column sorting
 */
function setupTableSorting() {
    const tableHeaders = document.querySelectorAll('#academic-table th[data-sort]');
    
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.getAttribute('data-sort');
            const isAscending = !header.classList.contains('asc');
            
            // Clear other sort indicators
            tableHeaders.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // Set current sort direction
            header.classList.add(isAscending ? 'asc' : 'desc');
            
            // Sort data
            const sortedData = [...academicData].sort((a, b) => {
                let aValue = a[sortKey];
                let bValue = b[sortKey];
                
                // Special handling for year sorting
                if (sortKey === 'year') {
                    aValue = extractYearNumber(aValue);
                    bValue = extractYearNumber(bValue);
                }
                
                if (aValue < bValue) return isAscending ? -1 : 1;
                if (aValue > bValue) return isAscending ? 1 : -1;
                return 0;
            });
            
            populateAcademicTable(sortedData);
            showNotification(`Table sorted by ${sortKey} (${isAscending ? 'ascending' : 'descending'})`, 'info');
        });
    });
}

/**
 * Validate contact form
 * @returns {boolean} - Whether form is valid
 */
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const successMessage = document.getElementById('success-message');
    
    let isValid = true;
    
    // Reset error messages
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    messageError.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Validate name
    if (!name.value.trim()) {
        nameError.style.display = 'block';
        nameError.textContent = 'Please enter your name';
        isValid = false;
    } else if (name.value.trim().length < 2) {
        nameError.style.display = 'block';
        nameError.textContent = 'Name must be at least 2 characters long';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.style.display = 'block';
        emailError.textContent = 'Please enter your email address';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.style.display = 'block';
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        messageError.style.display = 'block';
        messageError.textContent = 'Please enter your message';
        isValid = false;
    } else if (message.value.trim().length < 10) {
        messageError.style.display = 'block';
        messageError.textContent = 'Message must be at least 10 characters long';
        isValid = false;
    }
    
    // If form is valid, show success message
    if (isValid) {
        successMessage.style.display = 'block';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        showNotification('Your message has been sent successfully!', 'success');
    }
    
    return false; // Prevent form submission for demo
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Academic table controls
    levelFilter.addEventListener('change', filterAcademicTable);
    searchBox.addEventListener('input', filterAcademicTable);
    sortYearBtn.addEventListener('click', sortByYear);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Theme toggle
    themeToggle.addEventListener('change', toggleTheme);
    
    // Mobile navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', closeMobileMenuOnClickOutside);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Back to top button
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Show/hide back to top button
    window.addEventListener('scroll', updateBackToTopButton);
    
    // Contact form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        validateForm();
    });
    
    // Carousel controls
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Pause carousel on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', pauseAutoRotate);
    carousel.addEventListener('mouseleave', resumeAutoRotate);
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Form input validation on blur
    document.getElementById('name').addEventListener('blur', validateFormField);
    document.getElementById('email').addEventListener('blur', validateFormField);
    document.getElementById('message').addEventListener('blur', validateFormField);
}

/**
 * Validate individual form field
 * @param {Event} event - Blur event
 */
function validateFormField(event) {
    const field = event.target;
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    // Hide error by default
    errorElement.style.display = 'none';
    
    // Validate based on field type
    if (fieldId === 'name' && field.value.trim().length < 2) {
        errorElement.textContent = 'Name must be at least 2 characters long';
        errorElement.style.display = 'block';
    } else if (fieldId === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
        }
    } else if (fieldId === 'message' && field.value.trim().length < 10) {
        errorElement.textContent = 'Message must be at least 10 characters long';
        errorElement.style.display = 'block';
    }
}

// Initialize the portfolio when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        populateAcademicTable,
        filterAcademicTable,
        sortByYear,
        validateForm,
        toggleTheme
    };
}