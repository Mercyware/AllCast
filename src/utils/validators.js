// src/utils/validators.js

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const stripDomain = (domain) => {
    // Remove http://, https://, and www. if present
    return domain.replace(/^(https?:\/\/)?(www\.)?/, '');
};

export const isValidDomain = (domain) => {
    // Strip the domain first
    const strippedDomain = stripDomain(domain);
    
    // Validate the stripped domain
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(strippedDomain);
};