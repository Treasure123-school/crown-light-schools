/**
 * Centralized Default Branding Configuration
 * 
 * This file contains all default/fallback branding values used across the app.
 * These defaults are used when no school-specific settings have been configured
 * in the admin panel (via /api/public/settings).
 * 
 * To customize for a specific school:
 *   1. Deploy the app
 *   2. Log in as admin/super-admin
 *   3. Update branding in Settings > School Information
 * 
 * The values here are intentionally generic so the project can be reused
 * for any school without code changes.
 */

export const DEFAULT_BRANDING = {
    // School identity
    schoolName: "Your School Name",
    schoolNameUpper: "YOUR SCHOOL NAME",
    schoolMotto: "Excellence in Education",

    // Location
    schoolAddress: "123 School Street, City, State",

    // Portal
    portalName: "School Management Portal",
    loginPageText: "Welcome to the School Portal",
    adminSubtitle: "School Administration Portal",

    // Footer / legal
    get footerText() {
        return `© ${new Date().getFullYear()} Your School Name. All rights reserved.`;
    },
    footerDescription: "Our school has a rich history of educational excellence, providing quality education and nurturing young minds for a brighter future.",

    // Alt text
    logoAlt: "School Logo",
    heroAlt: "School hero image",
    buildingAlt: "School building and campus",

    // SEO (used in index.html as static fallbacks)
    seoTitle: "School Management System - Quality Education",
    seoDescription: "A comprehensive school management system providing quality education. Manage students, teachers, classes, exams, and more.",
    seoKeywords: "school management, education, students, teachers, online portal, school administration",
} as const;
