import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";
import { ProductInterface } from "../interfaces/ProductInterface";

function DetectedFrame({ value }: { value: string }) {
  const [currentImage, setCurrentImage] = useState("");

  const fetchImage = async () => {
    try {
      const response = await axiosInstance.get(
        `/get_one_image?image_path=current_image.jpg`
      );
      setCurrentImage(response.data.image_base64);
      console.log(
        "Checker that this fetchImage api is indeed fetching an image on a specified interval"
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let intervalId: number | null = null;

    const fetchImageInterval = () => {
      fetchImage();
      if (value === "") {
        intervalId = setInterval(fetchImage, 5000);
        console.log("Interval started");
      } else {
        intervalId = setInterval(fetchImage, parseInt(value) * 1000);
        console.log("Interval started");
      }
    };

    // Initial data fetching
    fetchImageInterval();

    // Cleanup: Stop the timer when the component unmounts or loses focus
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleared interval");
      }
    };
  }, [value]); // Run the effect whenever the 'value' state changes

//   useEffect(() => {
//     let intervalId: number;

//     fetchImage();
//     intervalId = setInterval(fetchImage, 5000);
//     console.log("Interval started");

//     // Cleanup: Stop the timer when the component unmounts or loses focus
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//         console.log("Cleared interval");
//       }
//     };
//   }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={`data:image/png;base64,${currentImage}`}
          alt="Image"
          style={{
            width: 640,
            height: 640,
            boxShadow: "0px 4px 6px rgba(0.9, 0.9, 0.9, 0.9)"
          }}
        />
      </div>
    </>
  );

  //   return (
  //     {data.map((datum: ProductInterface, index: number) => {
  //         <Card sx={cardStyle}>
  //           <CardMedia
  //             sx={mediaStyle}
  //             component="img"
  //             alt='testing'
  //             height="200"
  //             src='randomURL'
  //           />
  //           <CardContent>
  //             <Box sx={contentStyle}>
  //               <div>
  //                 <Typography sx={titleStyle} variant="h5" component="div">
  //                   {datum.product}
  //                 </Typography>
  //                 <Typography sx={subtitleStyle} color="text.secondary">
  //                   {getCountText(datum.count, datum.threshold)}
  //                 </Typography>
  //               </div>
  //               <Typography variant="h5" component="div" style={getCountTextStyle(datum.count, datum.threshold)}>
  //                 {datum.count}
  //               </Typography>
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       })}
  //   );

  //   return (
  //     <div style={{ marginTop: 10, marginBottom: 10 }}>
  //       <Card sx={cardStyle}>
  //         <CardMedia
  //           sx={mediaStyle}
  //           component="img"
  //           alt="Coke"
  //           height="200"
  //           src="/coke_roi.jpg"
  //         />
  //         <CardContent>
  //           <Box sx={contentStyle}>
  //             <div>
  //               <Typography sx={titleStyle} variant="h5" component="div">
  //                 Coke
  //               </Typography>
  //               <Typography sx={subtitleStyle} color="text.secondary">
  //                 Please refill!
  //               </Typography>
  //             </div>
  //             <Typography variant="h5" component="div">
  //               3
  //             </Typography>
  //           </Box>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
}

export default DetectedFrame;
