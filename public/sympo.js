// Function to limit selection of checkboxes
function limitCheckboxSelection(category, maxSelection) {
    const checkboxes = document.querySelectorAll(`input[name="${category}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const selectedCheckboxes = document.querySelectorAll(`input[name="${category}"]:checked`);
            if (selectedCheckboxes.length > maxSelection) {
                this.checked = false; // Prevent selecting more than maxSelection
                alert(`You can select only ${maxSelection} events in this category.`);
            }
        });
    });
}

// Apply restriction for Tech and Non-Tech events
limitCheckboxSelection("techEvents[]", 2);
limitCheckboxSelection("nonTechEvents[]", 2);


// // Function to preview uploaded image
// document.getElementById("paymentScreenshot").addEventListener("change", function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const preview = document.getElementById("preview");
//             preview.src = e.target.result;
//             preview.style.display = "block";
//         };
//         reader.readAsDataURL(file);
//     }
// });




