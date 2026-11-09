"use strict"

const yearSelect = document.getElementById("year")
const tableBody = document.getElementById("table-body")

const countries = [
  {name: "Sverige", file: "sweden"},
  {name: "Norge", file: "norway"},
  {name: "Danmark", file: "denmark"}

]

for (let year = 1900; year <= 2019; year++) {
  const option = document.createElement("option")

  option.value = year
  option.textContent = year

  yearSelect.appendChild(option)

}

yearSelect.addEventListener("change",fetchData)

async function fetchData() {
  const year = Number(yearSelect.value)

  tableBody.innerHTML = ""

  if (!year) {
    return
    
  }

  try {
    const results = await Promise.all(
      countries.map(async country => {
        const url = `https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data/${country.file}.json`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Kunde inte hämta ${country.name}`)
          
        }

        const data = await response.json()

        return {
          name: country.name,
          data: data

        }

      })
    )

    const yearData = results.map(country => {
      const records = Array.isArray(country.data)
        ? country.data
        : country.data.data

      return {
        name: country.name,
        values: records?.find(item => Number(item.year) === year)
      }

    })


    const winner = yearData
      .filter(country => country.values?.co2 !=null)
      .reduce((lowest, country) => 
        !lowest || country.values.co2 < lowest.values.co2
          ?country
          :lowest,

      null)

    yearData.forEach(country => {
      const row = document.createElement("tr")
      const nameCell = document.createElement("td")

      nameCell.textContent = country.name
      row.appendChild(nameCell)

      const values = country.values

      const columns = [
        values?.co2,
        values?.co2_per_capita,
        values?.population

      ]
      
      columns.forEach((value, index) => {
        const cell = document.createElement("td")

        cell.textContent = value == null
          ? "ingen data"
          : Number(value).toLocaleString("sv-SE")

        if (
          index === 0 &&
          winner &&
          country.name === winner.name

        ) {

          cell.classList.add("winner")
          
        }

        row.appendChild(cell)

      })

      tableBody.appendChild(row)

    })

  } catch (error) {
    console.error("Fel vid hämtning av data", error)
    tableBody.innerHTML = 
       "<tr><td colspan=`4`>Kundde inte hämta data.</td></tr>"
  }
}


  
  
