import axios from "axios";

export const ukPostcodeRegex =
  /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;

export const roiEircodeRegex =
  /^[AC-FHKNPRTV-Y]{1}[0-9]{2}\s?[0-9AC-FHKNPRTV-Y]{4}$/;

export const isValidPostcode = (code: string) => {
  const trimmed = code.trim().toUpperCase();
  return ukPostcodeRegex.test(trimmed) || roiEircodeRegex.test(trimmed);
};

export const lookupAddress = async (postcode: string) => {
  try {
    const token = localStorage.getItem("access");

    const response = await axios.post(
      "https://api-veen-e.ewipro.com/installer/info/",
      {
        action: "addressLookup",
        postCode: postcode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const delivery =
      response.data?.results?.address_data_formatted?.delivery_point;
    const postcodeFromAPI = response.data?.postcode || postcode;

    if (delivery?.length > 0) {
      return delivery.map((d: any) => ({
        line_1: d.line_1,
        line_2: d.line_2 || "",
        town: response.data.results.address_data_formatted.town,
        traditional_county:
          response.data.results.address_data_formatted.traditional_county,
        udprn: d.udprn,
        postcode: postcodeFromAPI,
      }));
    }
    return [];
  } catch (err) {
    console.error("Lookup error:", err);
    return [];
  }
};