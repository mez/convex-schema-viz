import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import clsx from "clsx";
import { useEffect } from "react";

type TableNode = Node<Table, "table">;

export const TableNode = ({ id, data: table }: NodeProps<TableNode>) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    // need to call this to have the edges render
    // because we are dynamically creating handles.
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  return (
    <div className="min-w-[250px] rounded-lg">
      {table.isReferenced && (
        <Handle
          className="-top-1 border border-white bg-transparent"
          position={Position.Top}
          id={table.name}
          type="target"
        />
      )}
      <div className="flex h-8 items-center justify-center rounded-t-lg bg-[#8d2676] p-1 text-center">
        <h1 className="font-bold text-2xl text-white capitalize">
          {table.name}
        </h1>
      </div>
      {table.fields.map((field, index) => (
        <div
          key={field.name}
          className="flex h-8 items-end justify-between border-none p-2 text-white last:rounded-b odd:bg-[#232323] even:bg-[#282828]"
        >
          <span>{field.name}</span>

          <span className={clsx(field.hasReference && "capitalize")}>
            {field.hasReference ? field.referenceTable : field.type}
            {field.type === "array" && "[ ]"}
          </span>
          {field.hasReference && (
            <Handle
              className="-right-1 border border-white bg-transparent"
              position={Position.Right}
              id={`${table.name}-${field.referenceTable}`}
              type="source"
              style={{ top: 32 + 16 + 32 * index }}
              // header size 32, field height 32/2 = center point,
            />
          )}
        </div>
      ))}
    </div>
  );
};
