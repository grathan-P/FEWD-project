// login.js - Form validation for Teacher Login Portal

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    const teacherId = document.getElementById('teacherId');
    const password = document.getElementById('password');
    
    const idFeedback = document.getElementById('idFeedback');
    const passwordFeedback = document.getElementById('passwordFeedback');

    // Teacher ID validation (real-time)
    teacherId.addEventListener('input', () => {
        if (teacherId.value.length >= 3) {
            idFeedback.textContent = 'Valid Teacher ID!';
            idFeedback.className = 'valid';
        } else if (teacherId.value.length > 0) {
            idFeedback.textContent = 'Teacher ID must be at least 3 characters long.';
            idFeedback.className = 'error';
        } else {
            idFeedback.textContent = '';
            idFeedback.className = '';
        }
    });

    // Password validation (real-time)
    password.addEventListener('input', () => {
        if (password.value.length >= 8) {
            passwordFeedback.textContent = 'Password is strong!';
            passwordFeedback.className = 'valid';
        } else if (password.value.length > 0) {
            passwordFeedback.textContent = 'Password must be at least 8 characters long.';
            passwordFeedback.className = 'error';
        } else {
            passwordFeedback.textContent = '';
            passwordFeedback.className = '';
        }
    });

    // Form submission validation with credential check
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Always prevent default form submission
        
        let isValid = true;
        
        // Validate Teacher ID
        if (teacherId.value.length < 3) {
            idFeedback.textContent = 'Teacher ID must be at least 3 characters long.';
            idFeedback.className = 'error';
            isValid = false;
        }
        
        // Validate Password
        if (password.value.length < 8) {
            passwordFeedback.textContent = 'Password must be at least 8 characters long.';
            passwordFeedback.className = 'error';
            isValid = false;
        }
        
        // If basic validation fails, stop here
        if (!isValid) {
            alert('Please fill out the form correctly before submitting.');
            return;
        }
        
        // Fetch credentials from JSON file
        try {
            const response = await fetch('credentials.json');
            const data = await response.json();
            
            // Check if credentials match
            const validTeacher = data.teachers.find(
                teacher => teacher.id === teacherId.value && teacher.password === password.value
            );
            
            if (validTeacher) {
                // Valid credentials - redirect to home page
                alert('Login successful! Welcome to Teacher Portal.');
                window.location.href = 'home.html';
            } else {
                // Invalid credentials
                alert('Invalid username or password. Please try again.');
                idFeedback.textContent = 'Invalid credentials';
                idFeedback.className = 'error';
                passwordFeedback.textContent = 'Invalid credentials';
                passwordFeedback.className = 'error';
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
