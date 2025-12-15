import BaseRow from "./BaseRow";
import { Column } from "./DataTable";

interface Props<T> {
  row: T;
  columns: Column<T>[];
  index: number;
  rowKey: (row: T, index: number) => string | number;
  onClick: () => void;
  getRowStatusColor?: (row: T) => string;
}

export default function ProjectRow<T>(props: Props<T>) {
  return <BaseRow {...props} rowKey={props.rowKey(props.row, props.index)} />;
}
