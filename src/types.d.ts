type TableField = {
  name: string;
  isOptional: boolean;
  type: string;
  hasReference?: boolean;
  referenceTable?: string;
};

type Table = {
  name: string;
  fields: TableField[];
  isReferenced?: boolean;
};

type TableReference = {
  target: string;
  source: string;
  name: string;
};
