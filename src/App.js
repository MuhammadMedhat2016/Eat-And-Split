import { useState } from "react";
import "./index.css";

function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }
  function handleUpdateBill(bill) {
    const id = selectedFriend.id;
    setFriends((friends) => friends.map((friend) => (friend.id === id ? { ...friend, bill: bill } : friend)));
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <Sidebar
        onSelectFriend={handleSelectFriend}
        selectedFriend={selectedFriend}
        friends={friends}
        setFriends={setFriends}
      />
      {selectedFriend && <Split name={selectedFriend.name} onUpdateBill={handleUpdateBill} />}
    </div>
  );
}

function Split({ name, onUpdateBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const fExpense = bill && expense && bill - expense;
  const [whoPaid, setWhoPaid] = useState("u");

  function reset() {
    setBill("");
    setExpense("");
    setWhoPaid("u");
  }

  function handleBill(e) {
    e.preventDefault();
    let finalBill = Number(bill) - Number(expense);
    onUpdateBill(whoPaid === "u" ? finalBill : -finalBill);
    reset();
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

function Sidebar({ onSelectFriend, selectedFriend, friends, setFriends }) {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsAddFriendOpen(false);
  }
  return (
    <div className="sidebar">
      <List friends={friends} onSelectFriend={onSelectFriend} selectedFriend={selectedFriend} />
      <AddFriend onAddFriend={handleAddFriend} isOpen={isAddFriendOpen} setIsOpen={setIsAddFriendOpen} />
      <Button onClick={() => setIsAddFriendOpen((isOpen) => !isOpen)}>
        {isAddFriendOpen ? "Close" : "Add Friend"}
      </Button>
    </div>
  );
}

function List({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Item friend={friend} onSelectFriend={onSelectFriend} key={friend.id} selectedFriend={selectedFriend} />
      ))}
    </ul>
  );
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

function AddFriend({ onAddFriend, isOpen }) {
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
    setName("");
    setURL("");
    onAddFriend(friend);
  }

  return (
    isOpen && (
      <form className="form-add-friend" onSubmit={handleAddFriend}>
        <label>🧑‍🤝‍🧑 Friend name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>🖼️ Image URL</label>
        <input type="text" value={url} onChange={(e) => setURL(e.target.value)} />
        <Button onClick={handleAddFriend}>ADD</Button>
      </form>
    )
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
