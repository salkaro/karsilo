export const isProduction = process.env.NODE_ENV === "production";

export const root = isProduction ? "https://app.karsilo.com" : "http://localhost:3000"


export const title = "Karsilo"
export const shortenedTitle = "KS"