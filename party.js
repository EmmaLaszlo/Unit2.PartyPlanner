// Have a way to access the API
const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-FTB-MT-WEB-PT/events";

// Access the DOM to manage a LIST for parties
const partyList = document.getElementById("partyList");

// Access the DOM to manage NEW PARTY ENTRIES
const partyForm = document.getElementById("partyForm");

// Fetch and display the parties
// use "try and catch?"
async function fetchParties() {
  try {
    const response = await fetch(API_URL); // fetch data
    const responseData = await response.json(); // translate data

    // THIS SECTION WAS A PROBLEM
    // only the data ARRAY from responseData is passed to the API
    // I had to look this up because the web page wouldn't show the list of upcoming parties
    if (responseData && responseData.data) {
      renderParties(responseData.data); // Send only the array of parties
    } else {
      console.error("Unexpected API response format:", responseData);
    }
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

// Make a function that shows the party list with all their details
function renderParties(parties) {
  partyList.innerHTML = ""; // Clear inner list
  parties.forEach((party) => {
    // loop through the list
    const li = document.createElement("li"); // creates an element under list
    li.textContent = `${party.name} - ${party.date} at ${party.location}`; // all details of each party

    // Making the button delete a party
    const deleteBtn = document.createElement("button"); // accessing the dom
    deleteBtn.textContent = "Delete"; // says "delete"
    deleteBtn.onclick = () => deleteParty(party.id);

    li.appendChild(deleteBtn); // each party will have a delete button next to it
    partyList.appendChild(li); // each party is added as a list
  });
}

// Make a function for submitting a new party - FORM

// Add new party
partyForm.addEventListener("submit", async (event) => {
  // Listens for submission
  event.preventDefault(); // so it doesn't reload
  const name = document.getElementById("name").value; // enter party name
  const date = document.getElementById("date").value; // enter the date
  const location = document.getElementById("location").value; // enter the location

  // Send it to the API via "POST"
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // literally just took this from the lecture repo
      body: JSON.stringify({ name, date, location }), // format the data as a string
    });

    if (response.ok) {
      fetchParties();
      partyForm.reset(); // looked this part up but basically it resets the form so users can enter a new party, no need to delete previous info
    }
  } catch (error) {
    console.error("Error adding party:", error);
  }
});

// Make a function for deleting a party
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" }); // will delete from the page

    if (response.ok) {
      fetchParties(); // Refresh list to show new list without the deleted party
    }
  } catch (error) {
    console.error("Error deleting party:", error); // catch errors
  }
}

// Load parties when the page loads
fetchParties();
