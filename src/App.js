import { useState } from "react";
import "./index.css";

function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isAddFriendBtnOpen, setIsAddFriendBtnOpen] = useState(false);

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsAddFriendBtnOpen(false)
  }
  function handleUpdateBill(bill) {
    const id = selectedFriend.id;
    setFriends((friends) => friends.map((friend) => (friend.id === id ? { ...friend, bill: bill } : friend)));
    setSelectedFriend(null);
  }

  function handleAddFriendBtn() {
    setIsAddFriendBtnOpen((isOpen) => !isOpen);
    setSelectedFriend(null)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsAddFriendBtnOpen(false);
  }

  return (
    <div className="app">
      <Sidebar>
        <List>
          {friends.map((friend) => (
            <Item friend={friend} onSelectFriend={handleSelectFriend} key={friend.id} selectedFriend={selectedFriend} />
          ))}
        </List>
        {isAddFriendBtnOpen && <AddFriend onAddFriend={handleAddFriend} isOpen={isAddFriendBtnOpen} />}
        <Button onClick={handleAddFriendBtn}>{isAddFriendBtnOpen ? "Close" : "Add friend"}</Button>
      </Sidebar>
      {selectedFriend && <Split name={selectedFriend.name} key={selectedFriend.id} onUpdateBill={handleUpdateBill} />}
    </div>
  );
}

function Split({ name, onUpdateBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const fExpense = bill && expense && bill - expense;
  const [whoPaid, setWhoPaid] = useState("u");

  function handleBill(e) {
    e.preventDefault();
    let finalBill = Number(bill) - Number(expense);
    onUpdateBill(whoPaid === "u" ? finalBill : -finalBill);
  }
  return (
    <form className="form-split-bill">
      <h2>{`SPLIT A BILL WITH ${name.toUpperCase()}`}</h2>
      <label>💰 Bill Value</label>
      <input type="text" value={bill} onChange={(e) => setBill(e.target.value)} />
      <label>🧍 Your expense</label>
      <input type="text" value={expense} onChange={(e) => setExpense(e.target.value)} />
      <label>{`🧑‍🤝‍🧑 ${name}'s expense`}</label>
      <input type="text" disabled value={fExpense} />
      <label>🤑 Who is paying the bell</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value={"u"}>You</option>
        <option value={"f"}>{name}</option>
      </select>
      <Button onClick={handleBill}>Split Bill</Button>
    </form>
  );
}

function Sidebar({ children }) {
  return <div className="sidebar">{children}</div>;
}

function List({ children }) {
  return <ul>{children}</ul>;
}

function Item({ friend, onSelectFriend, selectedFriend }) {
  const { name, imgUrl, bill } = friend;
  const currentSelected = selectedFriend && selectedFriend.id === friend.id;
  return (
    <li className={currentSelected ? "selected" : ""}>
      <img src={imgUrl} alt={name} />
      <h3>{name}</h3>
      {bill > 0 && <p className="green">{`${name} owes you ${bill}$`}</p>}
      {bill < 0 && <p className="red">{`You owe ${name} ${-bill}$`}</p>}
      {bill === 0 && <p>{`You and ${name} are even`}</p>}
      <Button onClick={() => onSelectFriend(friend)}>{currentSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !url) return;

    const friend = {
      id: Date.now(),
      name,
      imgUrl: url,
      bill: 0,
    };
    onAddFriend(friend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🖼️ Image URL</label>
      <input type="text" value={url} onChange={(e) => setURL(e.target.value)} />
      <Button onClick={handleAddFriend}>ADD</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
