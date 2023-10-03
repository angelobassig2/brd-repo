import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import axiosInstance from "./axiosInstance";
import { GraphInterface } from "../interfaces/GraphInterface";

type SeriesVisibility = Record<string, boolean>;

function LineGraph() {
  const [productList, setProductList] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [isFocused, setIsFocused] = useState(true);
  const [seriesVisibility, setSeriesVisibility] = useState<SeriesVisibility>(
    {}
  );

  const toggleSeriesVisibility = (seriesId: string) => {
    setSeriesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [seriesId]: !prevVisibility[seriesId],
    }));
  };

  const fetchGraphData = async () => {
    try {
      const promises = productList.map(async (product) => {
        const response = await axiosInstance.get(
          `/generate_graph?product_codename=${product}`
        );
        const responseData = response.data;
        return {
          id: product,
          color: `hsl(104, 70%, 50%)`,
          data: responseData.map((item: GraphInterface) => ({
            x: item.Date_created,
            y: item.Product_count,
          })),
        };
      });

      const transformedDataArray: any = await Promise.all(promises);
      setTransformedData(transformedDataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get(`/get_all_products`);
      setProductList(response.data.all_products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Fetch products and initial graph data on component mount
    fetchAllProducts();
    fetchGraphData();

    // Start the interval when the component is focused
    const intervalId = setInterval(() => {
      if (isFocused) {
        fetchGraphData();
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isFocused]);

  // Handle window focus and blur events
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []); // Empty dependency array ensures this effect runs only once on initial load

  useEffect(() => {
    const initialVisibility: SeriesVisibility = {};
    productList.forEach((product) => {
      initialVisibility[product] = true;
    });
    setSeriesVisibility(initialVisibility);
  }, [productList]);

  const colors: Record<string, string> = {
    coke: "rgb(240, 128, 128)",
    mountain_dew: "rgb(152, 251, 152)",
    other: "rgb(192, 192, 192)",
    pocari: "rgb(173, 216, 230)",
  };

  //   const colors = {
  //     coke: "red",
  //     mountain_dew: "yellow",
  //     other: "black",
  //     pocari: "blue",
  //   };

  const theme = {
    fontFamily: "Arial, sans-serif",
    textColor: "#333", // Dark Gray
    grid: {
      line: {
        stroke: "#eee", // Light Gray
        strokeWidth: 1,
      },
    },
    axis: {
      legend: {
        text: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      ticks: {
        text: {
          fontSize: 12, // Adjust the font size as needed
          fontWeight: "bold", // Make the text bold
        },
      },
    },
    crosshair: {
      line: {
        stroke: "#aaa", // Light Gray
        strokeWidth: 1,
        strokeDasharray: "6 6",
      },
    },
  };

  return (
    <>
      <div
        style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", height: 400 }}
      >
        <ResponsiveLine
          data={transformedData}
          // gridYValues={1,2,3,4,5,6,7,8,9}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          // yScale={customYScale}
          // yScale={{
          //   type: "linear",
          //   min: "auto",
          //   max: "auto",
          //   stacked: true,
          //   reverse: false,
          // }}
          // yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: Array.from({ length: 101 }, (_, i) => i),
            legend: "Count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          // colors={(series) => colors[series.id]}
          colors={(series) =>
            seriesVisibility[series.id] ? colors[series.id] : "rgba(0, 0, 0, 0)"
          }
          enableSlices="x"
          pointSize={8} // Increase point size for solid points
          pointColor={{ from: "color" }} // Use series color for points
          pointBorderWidth={2}
          pointBorderColor={{ from: "color" }} // Use series color for point borders
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 90,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          theme={theme}
        />
      </div>
      {/* Legends */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-around", // Spread items evenly
          alignItems: "center",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {productList.map((product) => (
          <div
            key={product}
            onClick={() => toggleSeriesVisibility(product)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              opacity: seriesVisibility[product] ? 1 : 0.5,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: colors[product],
                marginRight: "5px",
              }}
            />
            <span>{product}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default LineGraph;

// // install (please try to align the version of installed @nivo packages)
// // yarn add @nivo/line
// import { useState, useEffect } from "react";
// import { ResponsiveLine } from "@nivo/line";
// import { MockData as data } from "../sample_data/sample";
// import axiosInstance from "./axiosInstance";
// import { GraphInterface } from "../interfaces/GraphInterface";

// function LineGraph() {
//   const [currentImage, setCurrentImage] = useState("");

//   const fetchImage = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/get_one_image?image_path=current_image.jpg`
//       );
//       setCurrentImage(response.data.image_base64);
//       console.log(
//         "Checker that this fetchImage api is indeed fetching an image on a specified interval"
//       );
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const [productList, setProductList] = useState([]);

//   // Step 1: Create a state variable to store the transformed data
//   const [transformedData, setTransformedData] = useState([]);

//   //   const [groupedData, setGroupedData] = useState({});
//   // const isFetchingData = useRef(false);
//   // const isScrolling = useRef(false); // Add this ref to track scrolling
//   // const isFocused = useIsFocused();

//   //   const fetchData = async () => {
//   //     const transformedDataArray: any = [];

//   //     for (let i = 0; i < productList.length; i++) {
//   //       try {
//   //         const response = await axiosInstance.get(
//   //           `/generate_graph?product_codename=${productList[i]}`
//   //         );
//   //         const responseData = response.data;

//   //         const transformedProductData = {
//   //           id: productList[i],
//   //           color: `hsl(104, 70%, 50%)`,
//   //           data: responseData.map((item: GraphInterface) => ({
//   //             x: item.Date_created,
//   //             y: item.Product_count,
//   //           })),
//   //         };

//   //         transformedDataArray.push(transformedProductData);
//   //       } catch (error) {
//   //         console.error(`Error fetching data for ${productList[i]}`);
//   //       }
//   //     }

//   //     // Update the state with the transformed data
//   //     setTransformedData(transformedDataArray);
//   //   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const promises = productList.map(async (product) => {
//           const response = await axiosInstance.get(
//             `/generate_graph?product_codename=${product}`
//           );
//           const responseData = response.data;
//           return {
//             id: product,
//             color: `hsl(104, 70%, 50%)`,
//             data: responseData.map((item: GraphInterface) => ({
//               x: item.Date_created,
//               y: item.Product_count,
//             })),
//           };
//         });

//         // Wait for all promises to resolve
//         const transformedDataArray: any = await Promise.all(promises);

//         // Update the state with the transformed data
//         setTransformedData(transformedDataArray);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     const fetchAllProducts = async () => {
//       try {
//         const response = await axiosInstance.get(`/get_all_products`);
//         setProductList(response.data.all_products);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     //   const fetchData = async () => {
//     //     for (let i = 0; i < productList.length; i++) {
//     //       try {
//     //         const response = await axiosInstance.get(
//     //           `/generate_graph?product_codename=${productList[i]}`
//     //         );
//     //         const responseData = response.data;
//     //       } catch (error) {
//     //         console.error(`Error fetching data for ${productList[i]}`);
//     //       }
//     //     }
//     //   };

//     const fetchDataAndProducts = async () => {
//       try {
//         console.log("Interval started");
//         await fetchAllProducts();
//         console.log("nakapag fetch na ng products!");
//         console.log("PRODUCT LIST:", productList);
//         await fetchData();
//         console.log("OKAY NA ANG GRAPHH!");
//         console.log("TRANSFORMED DATA:", transformedData);
//         //   await fetchImage();
//         console.log("Fetching done DAPAT itu!");
//       } catch (error) {
//         console.error("Error fetching data or products:", error);
//       }
//     };

//     let intervalId = 0;

//     fetchDataAndProducts();
//     intervalId = setInterval(fetchDataAndProducts, 30000);
//     console.log("Interval startedfasfsafasf");

//     // Cleanup: Stop the timer when the component unmounts or loses focus
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//         console.log("Cleared intervafasfsafasl");
//       }
//     };
//   }, []);

//   const colors: any = {
//     coke: "red",
//     mountain_dew: "yellow",
//     other: "black",
//     pocari: "blue",
//   };

//   return (
//     <>
//       <ResponsiveLine
//         data={transformedData}
//         // gridYValues={1,2,3,4,5,6,7,8,9}
//         margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//         xScale={{ type: "point" }}
//         // yScale={customYScale}
//         // yScale={{
//         //   type: "linear",
//         //   min: "auto",
//         //   max: "auto",
//         //   stacked: true,
//         //   reverse: false,
//         // }}
//         yFormat=" >-.2f"
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "products",
//           legendOffset: 36,
//           legendPosition: "middle",
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "count",
//           legendOffset: -40,
//           legendPosition: "middle",
//         }}
//         colors={(series) => colors[series.id]}
//         enableSlices="x"
//         pointSize={10}
//         pointColor={{ theme: "background" }}
//         pointBorderWidth={2}
//         pointBorderColor={{ from: "serieColor" }}
//         pointLabelYOffset={-12}
//         useMesh={true}
//         legends={[
//           {
//             anchor: "bottom-right",
//             direction: "column",
//             justify: false,
//             translateX: 100,
//             translateY: 0,
//             itemsSpacing: 0,
//             itemDirection: "left-to-right",
//             itemWidth: 80,
//             itemHeight: 20,
//             itemOpacity: 0.75,
//             symbolSize: 12,
//             symbolShape: "circle",
//             symbolBorderColor: "rgba(0, 0, 0, .5)",
//             effects: [
//               {
//                 on: "hover",
//                 style: {
//                   itemBackground: "rgba(0, 0, 0, .03)",
//                   itemOpacity: 1,
//                 },
//               },
//             ],
//           },
//         ]}
//       />
//     </>
//   );
// }

// export default LineGraph;
