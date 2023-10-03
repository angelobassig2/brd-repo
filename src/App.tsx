import React, {SetStateAction, useState} from "react";
import LineGraph from "./components/LineGraph";
import Form from "./components/Form";
import Alert from "./components/Alert";
import Warning from "./components/Warning";
import DetectedFrame from "./components/DetectedFrame";

function App() {
  const [sharedValue, setSharedValue] = useState('');

  // Function to update sharedValue
  const updateValue = (newValue: any) => {
    setSharedValue(newValue);
  };

  return (
    <div
      style={{
        // border: "2px solid black",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch", // Stretch children horizontally
        padding: "2.5%", // Padding for the entire content
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Wrap the items to the next line if needed
          marginBottom: 20
        }}
      >
        <div style={{ flex: "1" }}>
          {/* Left side containing DetectedFrame */}
          <DetectedFrame value={sharedValue} />
        </div>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Right side containing Form, Warning, and Alert */}
          <Form value={sharedValue} updateValue={updateValue} />
          <Warning value={sharedValue} />
          <Alert value={sharedValue} />
        </div>
      </div>
      {/* LineGraph is placed below */}
      {/* <div style={{ backgroundColor: "white", height: 400 }}> */}
        <LineGraph />
      {/* </div> */}
    </div>
  );
}

export default App;


// import React from "react";
// import LineGraph from "./components/LineGraph";
// import ProductCard from "./components/ProductCard";
// import Form from "./components/Form";
// import Alert from "./components/Alert";
// import Warning from "./components/Warning";
// import DetectedFrame from "./components/DetectedFrame";

// function App() {
//   return (
//     <div
//       style={{
//         border: "2px solid black",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "flex-start", // Adjust alignment to start from the top
//         // padding: "10% 20% 0", // 20% padding on top, 20% on the left and right
//         margin: "10% 10% 0", // 20% padding on top, 20% on the left and right
//         // height: '100vh', // Make the container occupy the full viewport height
//       }}
//     >
//       <Form />
//       {/* <ProductCard /> */}
//       <DetectedFrame />
//       <Warning />
//       <Alert />
// <div style={{ backgroundColor: "white", height: 400 }}>
//   <LineGraph />
// </div>
//     </div>
//   );
// }

// export default App;

// // import ListGroup from "./components/ListGroup";
// import LineGraph from "./components/LineGraph";
// import ProductCard from "./components/ProductCard";
// import Form from "./components/Form";

// function App() {
//   return (
//     <>
//       <Form />
//       {/* <div> */}
//         <ProductCard />
//       {/* </div> */}

//       <div style={{ height: 400, backgroundColor: "white", width: '90%'}}>
//         <LineGraph />
//       </div>
//     </>
//   );
// }

// export default App;
