import api from "../../api/axiosApi";

export const ukPostcodeRegex =
  /^(([Gg][Ii][Rr] 0[Aa]{2})|([A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s?\d[A-Za-z]{2}))$/;

export const roiEircodeRegex =
  /^[AC-FHKNPRTV-Y]\d{2}\s?\d[AC-FHKNPRTV-Y]{3}$/;

export const isValidPostcode = (code: string) => {
  const trimmed = code.trim().toUpperCase();
  return ukPostcodeRegex.test(trimmed) || roiEircodeRegex.test(trimmed);
};


export const lookupAddress = async (postcode: string) => {
  if (!isValidPostcode(postcode)) {
    console.warn("Invalid postcode:", postcode);
    return [];
  }

  try {
    const response = await api.post({
      action: "addressLookup",
      postCode: postcode,
    });

    const results = response.data?.results?.address_data_formatted;
    const delivery = results?.delivery_point || [];
    const postcodeFromAPI = response.data?.postcode || postcode;

    if (delivery.length === 0) return [];

    return delivery.map((d: any) => ({
      line_1: d.line_1,
      line_2: d.line_2 || "",
      town: results.town,
      traditional_county: results.traditional_county,
      udprn: d.udprn,
      postcode: postcodeFromAPI,
    }));
  } catch (err) {
    console.error("Lookup error:", err);
    return [];
  }
};
