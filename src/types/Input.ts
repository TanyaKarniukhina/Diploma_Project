export interface IInput {
    title: string;
    placeholderText: string;
    disabled?: boolean;
    onChange: (e: any) => void;
    type?: string;
}