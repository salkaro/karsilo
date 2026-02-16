export interface ExportOptions {
    format: 'csv' | 'iif';
    csv?: {
        includeHeaders: boolean;
        delimiter: ',' | ';' | '\t';
    };
    iif?: {
        includeRecurring: boolean;
        includeOneTime: boolean;
    };
}
