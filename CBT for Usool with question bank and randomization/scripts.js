document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform basic validation
    if (username === "admin" && password === "123") {
        // Successful login - redirect to the exam page
        window.location.href = "exam.html"; // Redirect to exam page
    } else {
        // Display error message
        document.getElementById('error-message').textContent = "Invalid username or password!";
    }
});
