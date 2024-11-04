const httpHeaderOptions: RequestInit = {
  cache: "no-store",
  next: { revalidate: 0 },
};

export default httpHeaderOptions;
