import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";

export interface RowData {
  name: string;
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearfull: number;
  disgusted: number;
  surprised: number;
}

const defaultRows: RowData[] = [];

export function addEntry(
  name: string,
  neutral: number,
  happy: number,
  sad: number,
  angry: number,
  fearfull: number,
  disgusted: number,
  surprised: number
) {
  const existingEntry = newEntries.find((entry) => entry.name === name);
  if (existingEntry) {
    existingEntry.neutral = (existingEntry.neutral + neutral) / 2;
    existingEntry.happy = (existingEntry.happy + happy) / 2;
    existingEntry.sad = (existingEntry.sad + sad) / 2;
    existingEntry.angry = (existingEntry.angry + angry) / 2;
    existingEntry.fearfull = (existingEntry.fearfull + fearfull) / 2;
    existingEntry.disgusted = (existingEntry.disgusted + disgusted) / 2;
    existingEntry.surprised = (existingEntry.surprised + surprised) / 2;
  } else {
    const entry: RowData = {
      name,
      neutral,
      happy,
      sad,
      angry,
      fearfull,
      disgusted,
      surprised,
    };
    newEntries.push(entry);
  }
}

export const newEntries: RowData[] = [];

export default function ExperimentTable() {
  const [rows, setRows] = useState<RowData[]>(defaultRows);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RowData;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  function addNewRow() {
    const allRows = [...rows, ...newEntries];
    setRows(allRows);
    newEntries.length = 0;
  }

  function handleSort(key: keyof RowData) {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }

  function clearEntries() {
    newEntries.length = 0;
    setRows([]);
  }

  const sortedRows = React.useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig.key) {
      sortableRows.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRows;
  }, [sortConfig, rows]);

  return (
    <div>
      <TableContainer component={Paper} style={{ height: "300px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "name"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("name")}
                >
                  Adaptation name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "neutral"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("neutral")}
                >
                  neutral
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "happy"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("happy")}
                >
                  happy
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "sad"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("sad")}
                >
                  sad
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "angry"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("angry")}
                >
                  angry
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "fearfull"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("fearfull")}
                >
                  fearfull
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "disgusted"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("disgusted")}
                >
                  disgusted
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === "surprised"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("surprised")}
                >
                  surprised
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.neutral}</TableCell>
                <TableCell align="right">{row.happy}</TableCell>
                <TableCell align="right">{row.sad}</TableCell>
                <TableCell align="right">{row.angry}</TableCell>
                <TableCell align="right">{row.fearfull}</TableCell>
                <TableCell align="right">{row.disgusted}</TableCell>
                <TableCell align="right">{row.surprised}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={addNewRow}>Add Entries</button>
      <button onClick={clearEntries}>Clear Entries</button>
    </div>
  );
}
