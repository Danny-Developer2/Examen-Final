import { SafeHtml } from "@angular/platform-browser";

export type ToastType = {
    id: string,
    type: "success" | "info" | "danger" | "warning",
    message: SafeHtml | string,
    dismissible: boolean,
    duration: number
};
