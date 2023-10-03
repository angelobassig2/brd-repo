import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";
import { ProductInterface } from "../interfaces/ProductInterface";

const cardStyle = {
  width: "300px",
  margin: "10px", // Adjust margin as needed
  backgroundColor: "#fff", // Default background color
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

const mediaStyle = {
  height: 200,
};

const contentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const subtitleStyle = {
  fontStyle: "italic",
};

function ProductCard() {
  const [currentImage, setCurrentImage] = useState("");
  const [data, setData] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/get_json?json_filename=all_products_count`
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchImageAndData = async () => {
    try {
      await fetchImage();
      await fetchData();
    } catch (error) {
      console.error("Error fetching data or products:", error);
    }
  };

  useEffect(() => {
    let intervalId: number;

    fetchImageAndData();
    intervalId = setInterval(fetchImageAndData, 5000);
    console.log("Interval started");

    // Cleanup: Stop the timer when the component unmounts or loses focus
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleared interval");
      }
    };
  }, []); // Empty dependency array to run the effect only once

  const getCountText = (count: number, threshold: number) => {
    if (count === 0) {
      return "Alert: Please refill immediately!";
    } else if (count <= threshold && count > 0) {
      return "Warning: You may now refill!";
    } else {
      return "Available stocks!";
    }
  };

  const getCountTextStyle = (count: number, threshold: number) => {
    if (count === 0) {
      return { color: "red" };
    } else if (count <= threshold && count > 0) {
      return { color: "yellow" };
    } else {
      return { color: "black" };
    }
  };

  const getProductImage = (product: string) => {
    switch (product) {
      case "coke":
        return "/coke_logo.png";
      case "mountain_dew":
        return "/mountain_dew_logo.png";
      case "pocari":
        return "/pocari_logo.png";
      case "other":
        return "/other_logo.png";
      default:
        return "No image to display";
    }
  };

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
            width: 480,
            height: 480,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          overflowX: "auto", // Enable horizontal scrolling
        }}
      >
        {data.map((datum: ProductInterface, index: number) => (
        datum.count < datum.threshold &&
          <Card sx={cardStyle} key={index}>
            <CardMedia
              sx={mediaStyle}
              component="img"
              alt="testing"
              height="200"
              src={getProductImage(datum.product)}
            />
            <CardContent>
              <Box sx={contentStyle}>
                <div>
                  <Typography sx={titleStyle} variant="h5" component="div">
                    {datum.product}
                  </Typography>
                  <Typography sx={subtitleStyle} color="text.secondary">
                    {getCountText(datum.count, datum.threshold)}
                  </Typography>
                </div>
                <Typography
                  variant="h5"
                  component="div"
                  style={getCountTextStyle(datum.count, datum.threshold)}
                >
                  {datum.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
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

export default ProductCard;
