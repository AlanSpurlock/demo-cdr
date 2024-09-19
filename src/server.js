const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express server!" });
});

app.get("/cdrs/:tn", (req, res) => {
  const { tn } = req.params;

  console.log("Fetching CDRs for:", tn);

  const filePath = path.join(
    __dirname,
    "..",
    "data",
    "EXTENDED_MOCK_DATA_WITH_DUPLICATES.csv"
  );

  // Read the CSV file
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Parse the CSV file
  const parsedData = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Find all records with the matching tn in to or from
  const matchingRecords = parsedData.data.filter((record) => {
    return record.to === tn || record.from === tn;
  });

  console.log(`Found ${matchingRecords.length} records for ${tn}`);

  return res.json(matchingRecords || []);
});

// Start the server
const PORT = process.env.PORT || 6061;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
