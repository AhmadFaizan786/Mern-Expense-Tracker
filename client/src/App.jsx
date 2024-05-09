import "./App.css";
import "./index.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setname] = useState("");
  const [datetime, setdatetime] = useState("");
  const [description, setdescription] = useState("");
  const [transactions, settransactions] = useState([]);

  useEffect(() => {
    getTransactions().then((data) => {
      // Sort transactions by datetime in descending order
      const sortedTransactions = data.sort((a, b) => {
        return new Date(b.datetime) - new Date(a.datetime);
      });
      settransactions(sortedTransactions);
    });
  }, []);

  async function getTransactions() {
    const url = import.meta.env.VITE_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();

    const parts = name.trim().split(" "); // Split by space to isolate price and name
    const priceInput = parts[0];
    const nameInput = parts.slice(1).join(" "); // Join the rest back for the name

    // Parse price as a float to ensure it's a number
    const price = parseFloat(priceInput);
    if (isNaN(price)) {
      alert(
        "Invalid price entered. Please enter a numeric value for the price."
      );
      return;
    }

    // Ensure all required fields are filled
    if (!nameInput || !description || !datetime) {
      alert("Please fill in all the details.");
      return;
    }

    const url = import.meta.env.VITE_APP_API_URL + "/transaction";
    // const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        settransactions([json, ...transactions]);
        setname(" "),
          setdatetime(" "),
          setdescription(" "),
          console.log("result", json);
      });
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  return (
    <main>
      <h2>Expense Tracker App</h2>
      <div className="upper-div">
        <header>
          <h1>
          ₹{balance}.<span>{fraction}</span>
          </h1>
        </header>
        <form onSubmit={addNewTransaction}>
          <div className="basic-info">
            <input
              type="text"
              placeholder={"+200 new samsung tv"}
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setdatetime(e.target.value)}
              placeholder={"+200 new samsung tv"}
            ></input>
          </div>
          <div className="description">
            <input
              type="text"
              placeholder={"description"}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            ></input>
          </div>
          <button type="submit">Add new transaction</button>
        </form>
      </div>

      <div className="lower-div">
        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction) => (
              <div className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div>{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price" + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">
                    {new Date(transaction.datetime).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default App;
