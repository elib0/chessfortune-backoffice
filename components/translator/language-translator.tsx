import Script from "next/script";
import React, { FC } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { setLanguageCookie, getLanguageCookie } from "./cookieUtils";
import Image from "next/image";
import Loader from "../shared/loader";
import { GlobeIcon } from "../icons/globe-icon";

const languages = [
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
  { label: "Spanish", value: "es", src: "https://flagcdn.com/h60/es.png" },
  // { label: "French", value: "fr", src: "https://flagcdn.com/h60/fr.png" },
];

function googleTranslateElementInit() {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "auto",
      includedLanguages: languages.map((lang) => lang.value).join(","),
    },
    "google_translate_element"
  );
}

const LanguageTranslator: FC<{ className?: string }> = ({ className }) => {
  const [lang, setLang] = React.useState(getLanguageCookie());
  const [isWidgetReady, setIsWidgetReady] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;

    const checkTranslateElement = setInterval(() => {
      const element = document.querySelector(".goog-te-combo");
      if (element) {
        setIsWidgetReady(true);
        clearInterval(checkTranslateElement);
        (element as HTMLSelectElement).value = lang;
        element.dispatchEvent(new Event("change"));
      }
    }, 500);
  }, [lang]);

  const onChange = (value: string) => {
    if (!isWidgetReady) return;

    setIsLoading(true);

    setLang(value);
    setLanguageCookie(value);

    const element = document.querySelector(".goog-te-combo");
    if (element) {
      (element as HTMLSelectElement).value = value;
      element.dispatchEvent(new Event("change"));
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={className}>
      <div id="google_translate_element" className="hidden" />
      <Dropdown placement="left">
        <DropdownTrigger>
          <span
            style={{
              cursor: "pointer",
            }}
          >
            {isLoading ? <Loader /> : <GlobeIcon />}
          </span>
        </DropdownTrigger>
        <DropdownMenu aria-label="Language selection">
          {languages.map((lang) => (
            <DropdownItem key={lang.value} onClick={() => onChange(lang.value)}>
              <button className="flex gap-3 justify-center items-center border-none border-0 outline-none">
                <Image
                  width={28}
                  height={20}
                  src={lang.src}
                  objectFit="cover"
                  alt={`${lang.label} flag`}
                />
                {lang.label}
              </button>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default LanguageTranslator;
