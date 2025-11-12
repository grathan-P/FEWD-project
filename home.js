// Select both buttons
const enterBtn = document.getElementsByClassName('primary')[0];
const viewBtn = document.getElementsByClassName('secondary')[0];

// Create the input element
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter Student USN';
input.classList.add('usn-input');

// When the "Enter Student USN" button is clicked
enterBtn.addEventListener('click', () => {
  // Fade out the Enter button
  enterBtn.style.opacity = '0';
  enterBtn.style.transform = 'scale(0.9)';

  // Wait a bit, then remove it and show input
  setTimeout(() => {
    enterBtn.style.display = 'none';

    // Insert the input before "View Reports"
    viewBtn.parentNode.insertBefore(input, viewBtn);

    // Focus the input
    input.focus();
  }, 300);
});
