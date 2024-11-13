const calendarDays = document.getElementById("calendar-days");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const currentDatetime = document.getElementById("current-datetime");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const eventModal = document.getElementById("event-modal");
const saveEventBtn = document.getElementById("save-event");
const closeModalBtn = document.getElementById("close-modal");
const eventTitleInput = document.getElementById("event-title");

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let events = {};



function updateCurrentDatetime() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true 
    };
    currentDatetime.innerText = now.toLocaleString('en-US', options);
    setTimeout(updateCurrentDatetime, 1000);
  }
  

function renderCalendar(month, year) {
    calendarDays.innerHTML = ""; // Clear previous days
    const firstDay = new Date(year, month, 1).getDay(); // First day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month
    const today = new Date(); // Get the current date
  
    // Add empty divs for the first row of the calendar if the month doesn't start on Sunday
    for (let i = 0; i < firstDay; i++) {
      calendarDays.innerHTML += `<div class="day empty"></div>`;
    }
  
    // Loop through all the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Check if this is today's date to apply a highlight class
      const isToday = 
        day === today.getDate() && 
        month === today.getMonth() && 
        year === today.getFullYear();
      
      // Add highlight class if it's today
      const dayClass = isToday ? "day highlight bg-purple-500 text-white font-bold rounded-lg" : "day";
       const event = events[`${year}-${month}-${day}`]; // Retrieve any event for this day
       const eventHtml = event ? `<div class="event mt-1">${event}</div>` : "";

       
  
       // Add each day to the calendar with the appropriate classes
       calendarDays.innerHTML += `<div class="${dayClass}" data-day="${day}">${day}${eventHtml}</div>`;
       
      // const dayClasses = isToday
      // ? "p-2 rounded-lg bg-indigo-500 text-white font-semibold"
      // : "p-2 rounded-lg hover:bg-indigo-200 text-gray-700";
      

    //  calendarDays.innerHTML += `<div class="${dayClasses}">${day}</div>`;
    }
  
    // Attach click event listeners to each day
    document.querySelectorAll(".day").forEach(day => {
      day.addEventListener("click", (e) => {
        const selectedDay = e.currentTarget.getAttribute("data-day");
        if (selectedDay) openEventModal(parseInt(selectedDay), month, year);
      });
    });
  }
  
  

function populateMonthAndYearSelectors() {
  monthSelect.innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<option value="${i}" ${i === currentMonth ? "selected" : ""}>${new Date(0, i).toLocaleString("default", { month: "long" })}</option>`
  ).join("");

  const yearRange = [currentYear - 60, currentYear + 60];
  yearSelect.innerHTML = Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) =>
    `<option value="${yearRange[0] + i}" ${yearRange[0] + i === currentYear ? "selected" : ""}>${yearRange[0] + i}</option>`
  ).join("");
}

function openEventModal(day, month, year) {
  eventModal.classList.remove("hidden");
  eventTitleInput.value = events[`${year}-${month}-${day}`] || "";
  saveEventBtn.onclick = () => saveEvent(day, month, year);
}

function saveEvent(day, month, year) {
  const eventTitle = eventTitleInput.value.trim();
  if (eventTitle) {
    events[`${year}-${month}-${day}`] = eventTitle;
  } else {
    delete events[`${year}-${month}-${day}`];
  }
  renderCalendar(month, year);
  closeEventModal();
}

function closeEventModal() {
  eventModal.classList.add("hidden");
  eventTitleInput.value = "";
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  populateMonthAndYearSelectors();
  renderCalendar(currentMonth, currentYear);
}

monthSelect.addEventListener("change", () => {
  currentMonth = parseInt(monthSelect.value);
  renderCalendar(currentMonth, currentYear);
});

yearSelect.addEventListener("change", () => {
  currentYear = parseInt(yearSelect.value);
  renderCalendar(currentMonth, currentYear);
});

prevMonthBtn.addEventListener("click", () => changeMonth(-1));
nextMonthBtn.addEventListener("click", () => changeMonth(1));
closeModalBtn.addEventListener("click", closeEventModal);

updateCurrentDatetime();
populateMonthAndYearSelectors();
renderCalendar(currentMonth, currentYear);
