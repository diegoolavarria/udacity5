import moment from "moment";
import getDataFromForm from "./helpers/getDataFromForm";

document.getElementById("start_date").value = moment().add(1, "day").toDate();

const content = document.getElementById("content");
const dateTravelForm = document.getElementById("dateTravelForm");
const dateTravelFormSubmitButton = document.getElementById(
  "dateTravelFormSubmitButton"
);

const handleSubmit = (e) => {
  e.preventDefault();

  const formData = getDataFromForm(dateTravelForm);
  const { city, start_date, end_date } = formData;

  if (!city || !start_date || !end_date) {
    alert("Missing data!");

    return false;
  }

  if (moment(end_date).isBefore(moment(start_date), "days")) {
    alert("Invalid date");

    return false;
  }

  fetch("http://localhost:3001/submitform", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city, start_date, end_date }),
  })
    .then((res) => {
      return res.json();
    })
    .then((results) => {
      console.log({ results });
      results.forEach((resultData, index) => {
        const newResult = document.createElement("section");
        newResult.setAttribute("id", `result-${index}`);
        newResult.setAttribute("class", "result");

        newResult.innerHTML = `
          <img class="result-img" src=${resultData.image} />
          <div class="result-info">
            <div class="result-dates">  
                <div>Picked date: ${moment(resultData.start_date).format(
                  "DD/MM/YYYY"
                )}</div>
                <div>Time remaining: ${resultData.dateFromNow}</div>
                <div>Travel duration: ${resultData.daysDuration}</div>
                <div>Travel end: ${moment(resultData.end_date).format(
                  "DD/MM/YYYY"
                )}</div>
              </div>
              <div class="result-weather">
                <div>High Temp: ${resultData.high_temp}</div>
                <div>Low Temp: ${resultData.low_temp}</div>
                <div>Visibility: ${resultData.vis}</div>
                <div>Expectation: ${resultData.description}</div>
              </div>
          </div>
        `;

        content.appendChild(newResult);
      });

      // fieldsRequired.forEach((field) => {
      //   document.getElementById(field).innerHTML = data[field];
      // });
    });

  return true;
};

dateTravelFormSubmitButton.addEventListener("click", handleSubmit);

export { handleSubmit };
