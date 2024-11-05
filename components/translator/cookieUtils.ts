import Cookie from "js-cookie";

// Function to set a cookie
export const setLanguageCookie = (language: string) => {
  Cookie.set("prefLang", language);
};

// Function to get a cookie
export const getLanguageCookie = () => {
  return Cookie.get("prefLang") || "en"; // Default to 'en' if no cookie is set
};
