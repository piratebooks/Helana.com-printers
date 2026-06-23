# Helana.com Printers — Frontend Website

A responsive static frontend for the Helana.com Printers marketing website. This project is built using modern HTML, CSS and JavaScript with Bootstrap 5 and vendor libraries to create an engaging promotional site for a printing company in Anuradhapura, Sri Lanka.

## Overview

- Static frontend only
- Includes a branded homepage, service details page, quote request page and order tracking page
- Uses Bootstrap, AOS animations, GLightbox, Swiper, etc
- Designed for desktop and mobile screens

## Pages

- `index.html` — main landing page with about, services, portfolio, team, testimonials and contact sections
- `service-details.html` — detailed service descriptions for printouts, hard binding, UV printing, mug printing, graphic design, typesetting, and plan printing
- `quote.html` — request a personalized quote with a multi-step form and conditional fields
- `order.html` — order tracking interface that validates a `HELxxxxxxxxx` reference and calls a backend API
- `terms.html` — TnC page

## Key Features

- Responsive layout with mobile-first design
- Smooth scroll navigation and sticky header
- Animated content using AOS
- Portfolio and service interaction enhancements
- Quote request form with progress indicator
- Order tracking form with client-side validation
- Google Maps embed and contact information

## Project Structure

- `assets/css/main.css` — primary stylesheet
- `assets/js/main.js` — site interaction logic and UI behavior
- `assets/js/track-order.js` — order tracking form handling and API request logic
- `assets/vendor/` — third-party CSS and JS libraries
- `assets/img/` — brand assets, portfolio images, and logos

## Dependencies / Libraries

- Bootstrap 5
- Bootstrap Icons
- AOS
- GLightbox
- Swiper
- PureCounter
- Isotope
- imagesLoaded

## Setup and Usage

1. Keep the full repository structure intact, including `assets/` and all HTML files.
2. Open `index.html` in a browser to view the homepage.
3. Use a local static server for best results, or open files directly from the filesystem.

Optional static server example:

```bash
npx http-server .
```

## Backend Note

This repository contains frontend pages that reference backend endpoints such as `send-quote.php` and `api/track_order.php`. Those backend files are not included here, so quote submission and order tracking require a separate server-side implementation.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Contact

Helana.com Printers
- Location: Bank Side, Anuradhapura
- Email: helana.com@gmail.com
- Phone: +94 711 414 103

