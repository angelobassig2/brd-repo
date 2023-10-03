import { MouseEvent } from "react";

function ListGroup() {
  let items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];
  let selectedIndex = 0;

  // Event handler
  const handleClick = (event: MouseEvent) => console.log(event);

  //   const message = items.length === 0 ? <p>No item found</p> : null

  //   const getMessage = () => {
  //     return items.length === 0 ? <p>No item found</p> : null;
  //   };

  return (
    <>
      <h1>List</h1>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className="list-group-item active"
            key={index}
            onClick={handleClick}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
