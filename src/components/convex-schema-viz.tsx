import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import schema from "@convex/schema.ts";
import { TableNode } from "./table-node";

// going to put most of the code here. we don't need to maintain state for reactflow since
// the schema is fixed.

const getTablesFromConvexSchema = (): Table[] => {
  const tables: Table[] = [];
  const isTableReferenced: Record<string, boolean> = {};

  for (const [table, definition] of Object.entries(schema.tables)) {
    const fields: TableField[] = [];
    for (const [fieldName, field] of Object.entries(
      definition.validator.fields,
    )) {
      const tableField = {
        name: fieldName,
        type: field.kind,
        isOptional: field.isOptional !== "required",
        hasReference:
          field.kind === "id" ||
          (field.kind === "array" && field.element.kind === "id"),
        referenceTable:
          field.kind === "id"
            ? field.tableName
            : field.kind === "array" && field.element.kind === "id"
              ? field.element.tableName
              : undefined,
      };

      fields.push(tableField);

      if (tableField.referenceTable) {
        isTableReferenced[tableField.referenceTable] = true;
      }
    }
    tables.push({
      name: table,
      fields,
      isReferenced: isTableReferenced[table],
    });
  }

  console.log(tables);

  return tables;
};

const tables: Table[] = getTablesFromConvexSchema();

const calculateRequiredNumberOfGridRowsForNodes = (): number => {
  let numberOfRows = 1;
  while (true) {
    if (numberOfRows ** 2 >= tables.length) break;
    numberOfRows++;
  }

  return numberOfRows;
};

const generateNodes = (tables: Table[]): Node[] => {
  // This is for create the X by X grid we will use to place the nodes in the viewport
  let row = 0;
  let column = 0;
  const numberOfGridRows = calculateRequiredNumberOfGridRowsForNodes();

  return tables.map((table, index) => {
    const x = row * 300;
    const y = column * 300;

    if (numberOfGridRows % index === 0) {
      column = 0;
      row++;
    } else {
      column++;
    }

    return {
      id: table.name,
      position: { x, y },
      data: table,
      type: "table",
    };
  });
};

const generateEdges = (tables: Table[]): Edge[] => {
  const edges: Edge[] = [];
  for (const table of tables) {
    for (const field of table.fields) {
      if (field.hasReference) {
        edges.push({
          id: `${table.name}-${field.referenceTable}`,
          source: table.name,
          target: field.referenceTable as string,
          animated: true,
          sourceHandle: `${table.name}-${field.referenceTable}`,
          targetHandle: field.referenceTable,
          style: {
            strokeWidth: 2,
            stroke: "#e1ad01",
          },
        });
      }
    }
  }

  return edges;
};

const nodes: Node[] = generateNodes(tables);

const edges: Edge[] = generateEdges(tables);

const nodeTypes = {
  table: TableNode,
};

export const ConvexSchemaViz = () => {
  return (
    <div className="h-dvh w-dvw">
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.4 }}
        defaultNodes={nodes}
        defaultEdges={edges}
        proOptions={{
          // this is open source, but show them some love/money if you want to use this for profit!
          hideAttribution: true,
        }}
        colorMode="dark"
        nodeTypes={nodeTypes}
      >
        <Background color="#222" variant={BackgroundVariant.Lines} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
