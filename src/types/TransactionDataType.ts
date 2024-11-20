export type EvmTransactionDataType = {
    from: string;
    to: string;
    value: string;
} & Record<string, any>;

export type EvmTransactionDataTypeOptional = {
    from?: string;
    to?: string;
    value?: string;
} & Record<string, any>;
