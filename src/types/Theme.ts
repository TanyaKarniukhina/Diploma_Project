export type ITheme = 'light' | 'dark';

export interface IThemeType {
    theme: ITheme;
    toggleTheme: (theme: ITheme) => void;
}