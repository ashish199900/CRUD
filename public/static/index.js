$(document).ready(function () {
    const apiUrl = '/items';

    // Fetch items
    function fetchItems() {
        $.get(apiUrl, function (data) {
            $('#itemsList').empty();

            data.forEach(item => {
                $('#itemsList').append(`
                    <tr id="item-${item._id}">
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.contact}</td>
                        <td>
                            <button onclick="viewItem('${item._id}')">View</button>
                            <button onclick="editItem('${item._id}')">Edit</button>
                            <button onclick="deleteItem('${item._id}')">Delete</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    fetchItems();
    function validateName(name) {
        // Regex allows letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        return name.length > 0 && nameRegex.test(name);
    }
    function validateEmail(email) {
        // More comprehensive regex pattern for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validateTenDigitNumber(value) {
        const tenDigitRegex = /^\d{10}$/; // Matches exactly 10 digits
        return tenDigitRegex.test(value);
    }

    // Add item
    $('#addItem').click(function () {
        let name = $('#name').val();
        let email = $('#email').val();
        let contact = $('#contact').val();

        if (validateName(name)) {
            console.log('Valid name.');
        } else {
            console.log('Invalid name.');
            alert('Name is invalid').
            return;
        }

        if (validateEmail(email)) {
            console.log('Email is valid.');
        } else {
            console.log('Email is invalid.');
            alert('Email is invalid').
            return;
        }

        if (validateTenDigitNumber(contact)) {
            console.log('Valid 10-digit number.');
        } else {
            console.log('Invalid 10-digit number.');
            alert('Number should be of 10 digits').
            return;
        }


    
        console.log('Sending data:', { name, email, contact });
        let jsonData = JSON.stringify({       // Convert the data to a JSON string
            name: name,
            email: email,
            contact: contact
        });

        //console.log('here is some',some);
        $.ajax({
            url: apiUrl,                 // URL to which the request is sent
            type: 'POST',                // Type of request to be made (POST in this case)
            dataType: 'json',            // The type of data expected back from the server (e.g., json)
            contentType: 'application/json; charset=utf-8', // The content type sent to the server
            data: jsonData,
            success: function (data) {   // Function to be executed if the request succeeds
                console.log('Success:', data);
                $('#itemsList').append(`
                    <tr id="item-${data._id}">
                        <td>${data.name}</td>
                        <td>${data.email}</td>
                        <td>${data.contact}</td>
                        <td>
                            <button onclick="viewItem('${data._id}')">View</button>
                            <button onclick="editItem('${data._id}')">Edit</button>
                            <button onclick="deleteItem('${data._id}')">Delete</button>
                        </td>
                    </tr>
                `);
                $('#itemForm')[0].reset(); // Reset the form after successfully adding the item
            },
            error: function (jqXHR, textStatus, errorThrown) { // Function to be executed if the request fails
                console.error('Error:', textStatus, errorThrown);
            }
        });
    });
    

    // View item
    window.viewItem = function (id) {
        $.get(`${apiUrl}/${id}`, function (data) {
            alert(`Viewing item:\nName: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}`);
        });
    };

    // Edit item
    window.editItem = function (id) {
        $.get(`${apiUrl}/${id}`, function (data) {
            $('#name').val(data.name);
            $('#email').val(data.email);
            $('#contact').val(data.contact);
            //$('#id').val(data._id);
            
            $('#addItem').text('Update Item').off('click').on('click', function () {
                
                if (validateName($('#name').val())) {
                    console.log('Valid name.');
                } else {
                    console.log('Invalid name.');
                    alert('Name is invalid').
                    return;
                }
                if (validateEmail($('#email').val())) {
                    console.log('Email is valid.');
                } 
                else {
                    console.log('Email is invalid.');
                    alert('Email is invalid');
                    return;
                }

                if (validateTenDigitNumber($('#contact').val())) {
                    console.log('Valid 10-digit number.');
                } else {
                    console.log('Invalid 10-digit number.');
                    alert('Number should be of 10 digits');
                    return;
                }


                let jsonData = JSON.stringify({       // Convert the data to a JSON string
                    name: $('#name').val(),
                    email: $('#email').val(),
                    contact: $('#contact').val()
                });

                $.ajax({
                    url: `${apiUrl}/${id}`,
                    method: 'PUT',
                    contentType: "application/json",
                    data: jsonData,
                    success: function (updatedItem) {
                        $(`#item-${id}`).html(`
                            <td>${updatedItem.name}</td>
                            <td>${updatedItem.email}</td>
                            <td>${updatedItem.contact}</td>
                            <td>
                                <button onclick="viewItem('${updatedItem._id}')">View</button>
                                <button onclick="editItem('${updatedItem._id}')">Edit</button>
                                <button onclick="deleteItem('${updatedItem._id}')">Delete</button>
                            </td>
                        `);
                        $('#itemForm')[0].reset();
                        // $('#addItem').text('Add Item').off('click').on('click', function () {
                        //     const name = $('#name').val();
                        //     const email = $('#email').val();
                        //     const contact = $('#contact').val();
                        //     const id = $('#id').val();
                        //     $.post(apiUrl, { name, email, contact, id }, function (data) {
                        //         $('#itemsList').append(`
                        //             <tr id="item-${data._id}">
                        //                 <td>${data.name}</td>
                        //                 <td>${data.email}</td>
                        //                 <td>${data.contact}</td>
                        //                 <td>${data.id}</td>
                        //                 <td>
                        //                     <button onclick="viewItem('${data._id}')">View</button>
                        //                     <button onclick="editItem('${data._id}')">Edit</button>
                        //                     <button onclick="deleteItem('${data._id}')">Delete</button>
                        //                 </td>
                        //             </tr>
                        //         `);
                        //         $('#itemForm')[0].reset();
                        //     });
                        // });
                    },
                    error: function (jqXHR, textStatus, errorThrown) { // Function to be executed if the request fails
                        console.error('Error:', textStatus, errorThrown);
                    }
                });
            });
        });
    };

    // Delete item
    window.deleteItem = function (id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            success: function () {
                $(`#item-${id}`).remove();
            }
        });
    };
});
