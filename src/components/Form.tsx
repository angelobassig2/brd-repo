import React, { ChangeEvent, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import axiosInstance from "./axiosInstance";
import { IonIcon } from "@ionic/react";
import { warning } from "ionicons/icons";
import { FormProps } from "../interfaces/FormProps";

function Form({ value, updateValue }: FormProps) {
  //   const [input1, setInput1] = useState("");
  //   const [input2, setInput2] = useState("");
  const [toggle, setToggle] = useState(false);

  const [timeInterval, setTimeInterval] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [timeIntervalValidator, setTimeIntervalValidator] = useState(false);
  const [thresholdValidator, setThresholdValidator] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const toggleSwitch = (timeInterval: string, threshold: string) => {
    setIsEnabled((previousState) => !previousState);

    // Run when the Switch is clicked
    if (!isEnabled) {
      // Run when the Switch is turned on
      console.log("Switch is turned ON");
      if (timeInterval === "" || threshold === "" || timeInterval === '0' || threshold === '0') {
        if (timeInterval === "") {
          setTimeIntervalValidator(true);
          console.log("Time Interval", timeIntervalValidator);
        }
        if (threshold === "") {
          setThresholdValidator(true);
          console.log("Threshold", thresholdValidator);
        }
        if (timeInterval === '0') {
            setTimeIntervalValidator(true);
        }
        if (threshold === '0') {
            setThresholdValidator(true);
        }
      } else {
        detectObjects(timeInterval, threshold);
        updateValue(timeInterval); // Updates the sharedValue state (for Time Interval Refresh)
      }
    } else {
      // Run when the Switch is turned off
      setTimeIntervalValidator(false);
      setThresholdValidator(false);
      console.log("Switch is turned OFF");
      stopWebcam();
    }
  };

  const stopWebcam = async () => {
    const response = await axiosInstance.post(`/stop_webcam`);
  };

  const detectObjects = async (timeInterval: String, threshold: String) => {
    const response = await axiosInstance.get(
      `/detect_objects?timeInterval=${timeInterval}&threshold=${threshold}&allProducts=${allProducts}`
    );
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/get_all_products`);
      setAllProducts(response.data.all_products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTimeIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Use a regular expression to remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Update the state with the numeric value
    setTimeInterval(numericValue);
  };

  const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Use a regular expression to remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Update the state with the numeric value
    setThreshold(numericValue);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        marginBottom="5px"
        // marginTop="16px"
      >
        <Box paddingRight={1}>
          {" "}
          {/* Add padding to the right */}
          <TextField
            label="Time Interval"
            variant="outlined"
            value={timeInterval}
            onChange={handleTimeIntervalChange}
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              },
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </Box>

        <Box>
          {" "}
          {/* Add padding to the right */}
          <TextField
            label="Threshold"
            variant="outlined"
            value={threshold}
            onChange={handleThresholdChange}
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
              },
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={() => {
                toggleSwitch(timeInterval, threshold);
              }}
            />
          }
          label="Turn on AI"
          labelPlacement="start"
          style={{
            textAlign: "justify",
            fontWeight: "bold",
            // letterSpacing: "3px",
          }}
        />
      </Box>
      {timeIntervalValidator && (
        <span style={{ paddingRight: 10, fontStyle: 'italic' }}>
          <IonIcon icon={warning} style={{ fontSize: 24, verticalAlign: 'bottom'}}/> Please input a valid time interval!
        </span>
      )}
      {thresholdValidator && (
        <span style={{ paddingRight: 10, fontStyle: 'italic' }}>
          <IonIcon icon={warning} style={{ fontSize: 24, verticalAlign: 'bottom'}}/> Please input a valid threshold!
        </span>
      )}
    </div>
  );
  //   return (
  //     <div>
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         marginBottom="16px"
  //         marginTop="16px"
  //       >
  //         <TextField
  //           label="Time Interval"
  //           variant="outlined"
  //           value={timeInterval}
  //           onChange={handleTimeIntervalChange}
  //           fullWidth
  //           size="small"
  //           sx={{
  //             backgroundColor: "white",
  //             borderRadius: "4px",
  //             transition: "box-shadow 0.3s",
  //             "&:hover": {
  //               boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  //             },
  //           }}
  //           inputProps={{
  //             inputMode: "numeric",
  //             pattern: "[0-9]*", // Only allow numeric characters
  //           }}
  //           //   style={{ width: '90%' }} // Reduce width to 50%
  //         />
  //       </Box>
  //       {timeIntervalValidator && <p>Please input a valid time interval!</p>}
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         marginBottom="16px"
  //       >
  //         <TextField
  //           label="Threshold"
  //           variant="outlined"
  //           value={threshold}
  //           onChange={handleThresholdChange}
  //           fullWidth
  //           size="small"
  //           sx={{
  //             backgroundColor: "white",
  //             borderRadius: "4px",
  //             transition: "box-shadow 0.3s",
  //             "&:hover": {
  //               boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  //             },
  //           }}
  //           inputProps={{
  //             inputMode: "numeric",
  //             pattern: "[0-9]*", // Only allow numeric characters
  //           }}
  //           //   style={{ width: '90%' }} // Reduce width to 50%
  //         />
  //       </Box>
  //       {thresholdValidator && <p>Please input a valid threshold!</p>}
  //       <Box display="flex" alignItems="center" justifyContent="center">
  //         <FormControlLabel
  //           control={
  //             <Switch
  //               checked={isEnabled}
  //               onChange={() => {
  //                 toggleSwitch(timeInterval, threshold);
  //               }}
  //             />
  //           }
  //           label="Turn on AI"
  //         />
  //       </Box>
  //     </div>
  //   );
}

export default Form;
