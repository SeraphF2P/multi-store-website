import { FC } from "react";
import { Tooltip } from ".";

interface TableProps {
  content: { [key: string]: any }[];
}

const Table: FC<TableProps> = ({ content }) => {
  if (content[0] == null) return null;
  const headers = Object.keys(content[0]);
  return (
    <table className=" max-w-full border-separate border-spacing-2   border-2 ">
      <thead className="">
        <tr className=" ">
          {headers.map((header) => {
            return <th key={header}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {content.map((row, index) => {
          const cols = Object.values(row);
          return (
            <tr key={index} className="">
              {cols.map((col, index) => {
                return (
                  <td key={index} className="">
                    <Tooltip hiddenContent={col.toString()}>
                      <p className=" line-clamp-1 ">{col.toString()}</p>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
