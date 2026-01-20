import BaseRow from "./BaseRow";
import { Column } from "./DataTable";

interface Props<T> {
  readonly row: T;
  readonly columns: Column<T>[];
  readonly index: number;
  readonly rowKey: (row: T, index: number) => string | number;
  readonly onClick: () => void;
  readonly getRowStatusColor?: (row: T) => string;
}

export default function ProjectRow<T>(props: Props<T>) {
  return <BaseRow {...props} rowKey={props.rowKey(props.row, props.index)} />;
}
